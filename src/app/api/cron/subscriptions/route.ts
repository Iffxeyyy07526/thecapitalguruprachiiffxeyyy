import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendExpiryReminderEmail, sendExpiredEmail } from "@/lib/resend";

function startOfUtcDay(d: Date) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Whole calendar days from `from` (typically "today") to `endDate` (subscription end). */
function calendarDaysUntil(from: Date, endDate: Date) {
  return Math.round(
    (startOfUtcDay(endDate) - startOfUtcDay(from)) / 86_400_000
  );
}

const REMINDER_COOLDOWN_MS = 20 * 60 * 60 * 1000;

function wasSentRecently(iso: string | null | undefined): boolean {
  if (!iso) return false;
  return Date.now() - new Date(iso).getTime() < REMINDER_COOLDOWN_MS;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const now = new Date();
  const processed = { expired: 0, sevenDay: 0, oneDay: 0 };
  const errors: string[] = [];

  const { data: activeSubs, error: fetchError } = await supabaseAdmin
    .from("user_subscriptions")
    .select(
      "id, user_id, end_date, status, reminder_7d_sent_at, reminder_1d_sent_at, profiles ( full_name ), subscription_plans ( name )"
    )
    .eq("status", "active");

  if (fetchError) {
    console.error("cron subscriptions: fetch", fetchError);
    return NextResponse.json(
      {
        ok: false,
        error: { code: "FETCH_FAILED", message: fetchError.message },
      },
      { status: 500 }
    );
  }

  for (const sub of activeSubs ?? []) {
    const end = new Date(sub.end_date as string);
    const endMs = end.getTime();
    const subId = sub.id as string;
    const userId = sub.user_id as string;

    type ProfileJoin = { full_name: string | null } | null;
    type PlanJoin = { name: string | null } | null;
    const profiles = sub.profiles as ProfileJoin | ProfileJoin[];
    const plans = sub.subscription_plans as PlanJoin | PlanJoin[];
    const profileRow = Array.isArray(profiles) ? profiles[0] : profiles;
    const planRow = Array.isArray(plans) ? plans[0] : plans;

    const firstName =
      profileRow?.full_name?.split(" ")[0] || "Trader";
    const planName = planRow?.name || "Plan";

    try {
      if (endMs < now.getTime()) {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
          userId
        );
        const email = userData?.user?.email;
        if (email) {
          await sendExpiredEmail({
            email,
            first_name: firstName,
            plan_name: planName,
            end_date: end.toLocaleDateString("en-IN"),
          });
        }
        await supabaseAdmin
          .from("user_subscriptions")
          .update({ status: "expired" })
          .eq("id", subId);
        processed.expired++;
        continue;
      }

      const daysLeft = calendarDaysUntil(now, end);

      if (daysLeft === 7) {
        const last7 = sub.reminder_7d_sent_at as string | null | undefined;
        if (wasSentRecently(last7)) {
          continue;
        }
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
          userId
        );
        const email = userData?.user?.email;
        if (email) {
          await sendExpiryReminderEmail({
            email,
            first_name: firstName,
            plan_name: planName,
            end_date: end.toLocaleDateString("en-IN"),
            days: 7,
          });
          await supabaseAdmin
            .from("user_subscriptions")
            .update({ reminder_7d_sent_at: new Date().toISOString() })
            .eq("id", subId);
          processed.sevenDay++;
        }
      }

      if (daysLeft === 1) {
        const last1 = sub.reminder_1d_sent_at as string | null | undefined;
        if (wasSentRecently(last1)) {
          continue;
        }
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
          userId
        );
        const email = userData?.user?.email;
        if (email) {
          await sendExpiryReminderEmail({
            email,
            first_name: firstName,
            plan_name: planName,
            end_date: end.toLocaleDateString("en-IN"),
            days: 1,
          });
          await supabaseAdmin
            .from("user_subscriptions")
            .update({ reminder_1d_sent_at: new Date().toISOString() })
            .eq("id", subId);
          processed.oneDay++;
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown";
      errors.push(`${subId}:${msg}`);
    }
  }

  return NextResponse.json({
    success: true,
    processed,
    ...(errors.length ? { errors } : {}),
  });
}
