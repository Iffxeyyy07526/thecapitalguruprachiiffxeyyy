import type { SupabaseClient } from "@supabase/supabase-js";
import { SOCIAL_TELEGRAM_URL } from "@/lib/social";
import { logPaymentError, logPaymentWarn } from "@/lib/payment/payment-log";
import { validateRazorpayCapturedPayment } from "@/lib/payment/validate-razorpay-captured";

export type PlanRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  price_inr: number | null;
  duration_months: number;
  is_active: boolean | null;
};

/** Postgres unique_violation — safe to treat as idempotent success when keys are payment-scoped. */
const PG_UNIQUE_VIOLATION = "23505";

/** Wall-clock budget for waiting on a concurrent worker to finish payment row. */
const RECONCILE_MAX_TOTAL_MS = 90_000;
const RECONCILE_BASE_MS = 150;
const RECONCILE_MAX_BACKOFF_MS = 4_000;

export function planBaseInr(plan: Pick<PlanRow, "price" | "price_inr">): number {
  if (plan.price_inr != null && plan.price_inr > 0) {
    return plan.price_inr;
  }
  return Math.max(1, Math.round(plan.price / 100));
}

export function totalAmountPaiseWithGst(
  plan: Pick<PlanRow, "price" | "price_inr">
): number {
  const inr = planBaseInr(plan);
  return Math.round(inr * 1.18 * 100);
}

type FulfillParams = {
  userId: string;
  userEmail: string;
  planId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string | null;
};

export type FulfillResult =
  | { ok: true; duplicate?: boolean }
  | { ok: false; code: string; message: string };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Link a success payment row that lost subscription_id (e.g. repair after duplicate insert). */
async function linkOrphanSuccessPaymentToSubscription(
  admin: SupabaseClient,
  razorpay_payment_id: string,
  subscriptionId: string
): Promise<void> {
  await admin
    .from("payments")
    .update({ subscription_id: subscriptionId })
    .eq("razorpay_payment_id", razorpay_payment_id)
    .eq("status", "success")
    .is("subscription_id", null);
}

type EmailCtx = {
  userId: string;
  userEmail: string;
  razorpay_payment_id: string;
  planName: string;
  totalPaise: number;
  now: Date;
  endDate: Date;
  telegramLink: string;
};

/**
 * DB-level idempotency: claim row on payments, then send at most one access email per Razorpay payment.
 */
async function trySendAccessEmailWithDbClaim(
  admin: SupabaseClient,
  ctx: EmailCtx
): Promise<void> {
  const { data: sub } = await admin
    .from("user_subscriptions")
    .select("id")
    .eq("razorpay_payment_id", ctx.razorpay_payment_id)
    .maybeSingle();

  if (!sub) {
    logPaymentWarn("access_email_skip_no_subscription", {
      paymentId: ctx.razorpay_payment_id,
      userId: ctx.userId,
    });
    return;
  }

  const { data: claimed, error: claimErr } = await admin
    .from("payments")
    .update({ telegram_access_email_sent_at: new Date().toISOString() })
    .eq("razorpay_payment_id", ctx.razorpay_payment_id)
    .eq("status", "success")
    .is("telegram_access_email_sent_at", null)
    .select("id")
    .maybeSingle();

  if (claimErr) {
    logPaymentError("access_email_claim_failed", {
      paymentId: ctx.razorpay_payment_id,
      userId: ctx.userId,
      message: claimErr.message,
    });
    return;
  }

  if (!claimed) {
    return;
  }

  try {
    const { sendTelegramAccessEmail } = await import("@/lib/resend");
    const { data: profile } = await admin
      .from("profiles")
      .select("full_name")
      .eq("id", ctx.userId)
      .maybeSingle();

    await sendTelegramAccessEmail({
      email: ctx.userEmail,
      first_name: profile?.full_name?.split(" ")[0] || "Trader",
      plan_name: ctx.planName,
      start_date: ctx.now.toLocaleDateString("en-IN"),
      end_date: ctx.endDate.toLocaleDateString("en-IN"),
      amount: (ctx.totalPaise / 100).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      }),
      telegram_link: ctx.telegramLink,
    });

    await admin
      .from("user_subscriptions")
      .update({ telegram_link_sent: true })
      .eq("id", sub.id);
  } catch (emailError) {
    logPaymentError("access_email_send_failed", {
      paymentId: ctx.razorpay_payment_id,
      userId: ctx.userId,
      error: emailError instanceof Error ? emailError.message : String(emailError),
    });
    await admin
      .from("payments")
      .update({ telegram_access_email_sent_at: null })
      .eq("razorpay_payment_id", ctx.razorpay_payment_id);
  }
}

function emailCtx(
  params: FulfillParams,
  planRow: PlanRow,
  totalPaise: number,
  now: Date,
  endDate: Date,
  telegramLink: string
): EmailCtx {
  return {
    userId: params.userId,
    userEmail: params.userEmail,
    razorpay_payment_id: params.razorpay_payment_id,
    planName: planRow.name,
    totalPaise,
    now,
    endDate,
    telegramLink,
  };
}

/**
 * Verify + webhook can run concurrently. The loser of the subscription INSERT
 * waits (exponential backoff + jitter, up to RECONCILE_MAX_TOTAL_MS) for the
 * winner to record payment, then backfills payment if needed.
 */
async function reconcileAfterSubscriptionRace(
  admin: SupabaseClient,
  params: FulfillParams,
  planRow: PlanRow,
  totalPaise: number,
  now: Date,
  endDate: Date,
  telegramLink: string
): Promise<FulfillResult> {
  const { userId, userEmail, planId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    params;

  let elapsed = 0;
  let attempt = 0;

  while (elapsed < RECONCILE_MAX_TOTAL_MS) {
    const { data: pay } = await admin
      .from("payments")
      .select("id, status")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .maybeSingle();
    if (pay?.status === "success") {
      await trySendAccessEmailWithDbClaim(
        admin,
        emailCtx(params, planRow, totalPaise, now, endDate, telegramLink)
      );
      return { ok: true, duplicate: true };
    }

    const exp = Math.min(
      RECONCILE_MAX_BACKOFF_MS,
      RECONCILE_BASE_MS * Math.pow(2, attempt)
    );
    const jitter = Math.floor(Math.random() * Math.max(1, exp * 0.35));
    const delayMs = exp + jitter;
    await sleep(delayMs);
    elapsed += delayMs;
    attempt++;
  }

  logPaymentWarn("reconcile_poll_budget_exhausted", {
    paymentId: razorpay_payment_id,
    userId,
    orderId: razorpay_order_id,
    elapsedMs: elapsed,
    message:
      "Polling window exhausted waiting for concurrent worker; attempting payment backfill",
  });

  const { data: sub, error: subErr } = await admin
    .from("user_subscriptions")
    .select("id, user_id, plan_id")
    .eq("razorpay_payment_id", razorpay_payment_id)
    .maybeSingle();

  if (subErr || !sub) {
    logPaymentError("reconcile_subscription_missing_after_race", {
      paymentId: razorpay_payment_id,
      userId,
      orderId: razorpay_order_id,
      message: subErr?.message,
    });
    return {
      ok: false,
      code: "SUBSCRIPTION_RACE",
      message: "Could not confirm payment. Please retry or contact support with your payment ID.",
    };
  }

  if (sub.user_id !== userId || sub.plan_id !== planId) {
    logPaymentError("reconcile_subscription_mismatch", {
      paymentId: razorpay_payment_id,
      userId,
      orderId: razorpay_order_id,
      expectedPlan: planId,
      actualPlan: sub.plan_id,
    });
    return {
      ok: false,
      code: "SUBSCRIPTION_MISMATCH",
      message: "Payment is tied to a different account or plan.",
    };
  }

  const { error: payErr } = await admin.from("payments").insert({
    user_id: userId,
    subscription_id: sub.id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount: totalPaise,
    currency: "INR",
    status: "success",
  });

  if (payErr) {
    if (payErr.code === PG_UNIQUE_VIOLATION) {
      await linkOrphanSuccessPaymentToSubscription(
        admin,
        razorpay_payment_id,
        sub.id
      );
      await trySendAccessEmailWithDbClaim(
        admin,
        emailCtx(params, planRow, totalPaise, now, endDate, telegramLink)
      );
      return { ok: true, duplicate: true };
    }
    logPaymentError("reconcile_payment_insert_failed", {
      paymentId: razorpay_payment_id,
      userId,
      orderId: razorpay_order_id,
      message: payErr.message,
    });
    return {
      ok: false,
      code: "PAYMENT_INSERT_FAILED",
      message: payErr.message,
    };
  }

  await trySendAccessEmailWithDbClaim(
    admin,
    emailCtx(params, planRow, totalPaise, now, endDate, telegramLink)
  );

  return { ok: true };
}

/**
 * Idempotent: unique indexes on razorpay_payment_id (payments + user_subscriptions),
 * Razorpay API validation, DB-backed email claim, and race reconciliation.
 */
export async function fulfillPaidSubscription(
  admin: SupabaseClient,
  params: FulfillParams
): Promise<FulfillResult> {
  const {
    userId,
    userEmail,
    planId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = params;

  const { data: plan, error: planError } = await admin
    .from("subscription_plans")
    .select("id, name, slug, price, price_inr, duration_months, is_active")
    .eq("id", planId)
    .eq("is_active", true)
    .maybeSingle();

  if (planError || !plan) {
    logPaymentError("fulfill_plan_not_found", {
      paymentId: razorpay_payment_id,
      userId,
      orderId: razorpay_order_id,
      planId,
      message: planError?.message,
    });
    return { ok: false, code: "PLAN_NOT_FOUND", message: "Plan not found or inactive" };
  }

  const planRow = plan as PlanRow;
  const totalPaise = totalAmountPaiseWithGst(planRow);

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + planRow.duration_months * 30);

  const telegramLink =
    process.env.NEXT_PUBLIC_TELEGRAM_GROUP || SOCIAL_TELEGRAM_URL;

  const { data: existingPayment } = await admin
    .from("payments")
    .select("id, status")
    .eq("razorpay_payment_id", razorpay_payment_id)
    .maybeSingle();

  if (existingPayment?.status === "success") {
    const { data: subForPayment } = await admin
      .from("user_subscriptions")
      .select("id")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .maybeSingle();

    if (!subForPayment) {
      logPaymentWarn("fulfill_repair_success_payment_missing_subscription", {
        paymentId: razorpay_payment_id,
        userId,
        orderId: razorpay_order_id,
        message:
          "Continuing to recreate subscription row for captured payment (cron/reconcile safe)",
      });
    } else {
      await trySendAccessEmailWithDbClaim(
        admin,
        emailCtx(params, planRow, totalPaise, now, endDate, telegramLink)
      );
      return { ok: true, duplicate: true };
    }
  }

  const remote = await validateRazorpayCapturedPayment({
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    expectedPaise: totalPaise,
    userId,
  });
  if (!remote.ok) {
    logPaymentError("fulfill_razorpay_validation_failed", {
      paymentId: razorpay_payment_id,
      userId,
      orderId: razorpay_order_id,
      code: remote.code,
      message: remote.message,
    });
    return { ok: false, code: remote.code, message: remote.message };
  }

  const { data: existingSubRow } = await admin
    .from("user_subscriptions")
    .select("id, user_id, plan_id")
    .eq("razorpay_payment_id", razorpay_payment_id)
    .maybeSingle();

  if (existingSubRow) {
    if (existingSubRow.user_id !== userId || existingSubRow.plan_id !== planId) {
      logPaymentError("fulfill_existing_subscription_mismatch", {
        paymentId: razorpay_payment_id,
        userId,
        orderId: razorpay_order_id,
        planId,
      });
      return {
        ok: false,
        code: "SUBSCRIPTION_MISMATCH",
        message: "Payment is tied to a different account or plan.",
      };
    }

    const { data: payCheck } = await admin
      .from("payments")
      .select("status")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .maybeSingle();

    if (payCheck?.status === "success") {
      await trySendAccessEmailWithDbClaim(
        admin,
        emailCtx(params, planRow, totalPaise, now, endDate, telegramLink)
      );
      return { ok: true, duplicate: true };
    }

    const { error: healPayErr } = await admin.from("payments").insert({
      user_id: userId,
      subscription_id: existingSubRow.id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: totalPaise,
      currency: "INR",
      status: "success",
    });

    if (healPayErr) {
      if (healPayErr.code === PG_UNIQUE_VIOLATION) {
        await linkOrphanSuccessPaymentToSubscription(
          admin,
          razorpay_payment_id,
          existingSubRow.id
        );
        await trySendAccessEmailWithDbClaim(
          admin,
          emailCtx(params, planRow, totalPaise, now, endDate, telegramLink)
        );
        return { ok: true, duplicate: true };
      }
      logPaymentError("fulfill_heal_payment_insert_failed", {
        paymentId: razorpay_payment_id,
        userId,
        orderId: razorpay_order_id,
        message: healPayErr.message,
      });
      return {
        ok: false,
        code: "PAYMENT_INSERT_FAILED",
        message: healPayErr.message,
      };
    }

    await trySendAccessEmailWithDbClaim(
      admin,
      emailCtx(params, planRow, totalPaise, now, endDate, telegramLink)
    );

    return { ok: true };
  }

  const { data: subscription, error: subError } = await admin
    .from("user_subscriptions")
    .insert({
      user_id: userId,
      plan_id: planRow.id,
      status: "active",
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      telegram_link: telegramLink,
      telegram_link_sent: false,
      razorpay_order_id,
      razorpay_payment_id,
    })
    .select("id")
    .single();

  if (subError) {
    if (subError.code === PG_UNIQUE_VIOLATION) {
      return reconcileAfterSubscriptionRace(
        admin,
        params,
        planRow,
        totalPaise,
        now,
        endDate,
        telegramLink
      );
    }
    logPaymentError("fulfill_subscription_insert_failed", {
      paymentId: razorpay_payment_id,
      userId,
      orderId: razorpay_order_id,
      message: subError.message,
    });
    return {
      ok: false,
      code: "SUBSCRIPTION_INSERT_FAILED",
      message: subError.message,
    };
  }

  const { error: payError } = await admin.from("payments").insert({
    user_id: userId,
    subscription_id: subscription.id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount: totalPaise,
    currency: "INR",
    status: "success",
  });

  if (payError) {
    if (payError.code === PG_UNIQUE_VIOLATION) {
      logPaymentWarn("fulfill_concurrent_payment_insert", {
        paymentId: razorpay_payment_id,
        userId,
        orderId: razorpay_order_id,
        subscriptionId: subscription.id,
      });
      await linkOrphanSuccessPaymentToSubscription(
        admin,
        razorpay_payment_id,
        subscription.id
      );
      await trySendAccessEmailWithDbClaim(
        admin,
        emailCtx(params, planRow, totalPaise, now, endDate, telegramLink)
      );
      return { ok: true, duplicate: true };
    }
    logPaymentError("fulfill_payment_insert_failed", {
      paymentId: razorpay_payment_id,
      userId,
      orderId: razorpay_order_id,
      subscriptionId: subscription.id,
      message: payError.message,
    });
    await admin.from("user_subscriptions").delete().eq("id", subscription.id);
    return {
      ok: false,
      code: "PAYMENT_INSERT_FAILED",
      message: payError.message,
    };
  }

  await trySendAccessEmailWithDbClaim(
    admin,
    emailCtx(params, planRow, totalPaise, now, endDate, telegramLink)
  );

  return { ok: true };
}
