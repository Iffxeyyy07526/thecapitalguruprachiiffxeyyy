import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fulfillPaidSubscription } from "@/lib/payment/fulfill-payment";
import {
  RECONCILE_BATCH_LIMIT,
  collectReconcileJobs,
  countStalePendingPayments,
} from "@/lib/payment/reconcile-payment-state";
import { logPaymentError, logPaymentInfo } from "@/lib/payment/payment-log";

export const runtime = "nodejs";

/**
 * Repairs inconsistent payment ↔ subscription rows by re-running idempotent fulfillment.
 * Vercel Hobby: schedule at most once per day (see vercel.json). Secure with CRON_SECRET.
 * For more frequent runs, use Pro or an external scheduler hitting this route.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
      { status: 401 }
    );
  }

  try {
    const stalePending = await countStalePendingPayments(supabaseAdmin);
    const jobs = await collectReconcileJobs(supabaseAdmin, RECONCILE_BATCH_LIMIT);

    const processed = {
      attempted: jobs.length,
      fulfilledOk: 0,
      fulfilledDuplicate: 0,
      failed: 0,
    };
    const failures: string[] = [];

    for (const job of jobs) {
      const result = await fulfillPaidSubscription(supabaseAdmin, {
        userId: job.userId,
        userEmail: job.userEmail,
        planId: job.planId,
        razorpay_order_id: job.razorpay_order_id,
        razorpay_payment_id: job.razorpay_payment_id,
        razorpay_signature: null,
      });

      if (result.ok) {
        if (result.duplicate) processed.fulfilledDuplicate++;
        else processed.fulfilledOk++;
        logPaymentInfo("reconcile_cron_fulfill_ok", {
          userId: job.userId,
          paymentId: job.razorpay_payment_id,
          orderId: job.razorpay_order_id,
          source: job.source,
          duplicate: Boolean(result.duplicate),
        });
      } else {
        processed.failed++;
        failures.push(
          `${job.razorpay_payment_id}:${result.code}:${result.message.slice(0, 120)}`
        );
        logPaymentError("reconcile_cron_fulfill_failed", {
          userId: job.userId,
          paymentId: job.razorpay_payment_id,
          orderId: job.razorpay_order_id,
          source: job.source,
          code: result.code,
          message: result.message,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      processed,
      stalePendingPaymentsOver2h: stalePending,
      ...(failures.length ? { failures } : {}),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json(
      {
        ok: false,
        error: { code: "RECONCILE_ERROR", message },
      },
      { status: 500 }
    );
  }
}
