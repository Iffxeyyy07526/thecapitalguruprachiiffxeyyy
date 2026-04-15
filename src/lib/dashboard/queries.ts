import "server-only";

import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  BillingPaymentRow,
  DashboardPaymentSummary,
  UserSubscriptionRow,
} from "@/lib/dashboard/types";

export type {
  BillingPaymentRow,
  DashboardPaymentSummary,
  UserSubscriptionRow,
} from "@/lib/dashboard/types";

export type DashboardHomePayload = {
  user: User;
  profile: { full_name: string | null; created_at: string } | null;
  activeSubscription: UserSubscriptionRow | null;
  recentPayments: DashboardPaymentSummary[];
};

function normalizeSubscriptionRows(data: unknown): UserSubscriptionRow[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const r = row as UserSubscriptionRow & {
      subscription_plans?: unknown;
    };
    const p = r.subscription_plans;
    const plan = Array.isArray(p) ? p[0] ?? null : p;
    return {
      ...r,
      subscription_plans:
        plan as UserSubscriptionRow["subscription_plans"],
    };
  });
}

function mapPaymentJoin(raw: {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  razorpay_payment_id: string | null;
  user_subscriptions:
    | { subscription_plans: { name: string } | null }
    | { subscription_plans: { name: string } | null }[]
    | null;
}): DashboardPaymentSummary {
  const embed = raw.user_subscriptions;
  const planName = Array.isArray(embed)
    ? embed[0]?.subscription_plans?.name
    : embed?.subscription_plans?.name;
  return {
    id: raw.id,
    created_at: raw.created_at,
    amount: raw.amount,
    status: raw.status,
    razorpay_payment_id: raw.razorpay_payment_id,
    plan_name: planName ?? "—",
  };
}

export async function getDashboardHomeData(): Promise<DashboardHomePayload | null> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const [profileRes, subsRes, paysRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("user_subscriptions")
      .select(
        "id, status, start_date, end_date, telegram_link, created_at, subscription_plans ( id, name, slug, price, duration_months, features )"
      )
      .eq("user_id", user.id)
      .order("end_date", { ascending: false }),
    supabase
      .from("payments")
      .select(
        "id, created_at, amount, status, razorpay_payment_id, user_subscriptions ( subscription_plans ( name ) )"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const now = Date.now();
  const subscriptions = normalizeSubscriptionRows(subsRes.data);
  const activeSubscription =
    subscriptions.find(
      (s) => s.status === "active" && new Date(s.end_date).getTime() >= now
    ) ?? null;

  const recentPayments =
    paysRes.data?.map((p) =>
      mapPaymentJoin(p as unknown as Parameters<typeof mapPaymentJoin>[0])
    ) ?? [];

  return {
    user,
    profile: profileRes.data ?? null,
    activeSubscription,
    recentPayments,
  };
}

export async function getSubscriptionPageData(): Promise<{
  subscriptions: UserSubscriptionRow[];
} | null> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select(
      "id, status, start_date, end_date, telegram_link, created_at, subscription_plans ( id, name, slug, price, duration_months, features )"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Subscription page query error:", error);
    return { subscriptions: [] };
  }

  return { subscriptions: normalizeSubscriptionRows(data) };
}

export async function getBillingPayments(): Promise<BillingPaymentRow[] | null> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("payments")
    .select(
      "id, created_at, amount, status, razorpay_payment_id, user_subscriptions ( subscription_plans ( name ) )"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Billing page query error:", error);
    return [];
  }

  return (
    data?.map((p) =>
      mapPaymentJoin(p as unknown as Parameters<typeof mapPaymentJoin>[0])
    ) ?? []
  );
}
