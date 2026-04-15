import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";

/** Max fulfill retries per cron invocation (keeps Razorpay load bounded). */
export const RECONCILE_BATCH_LIMIT = 25;

/** Report pending rows older than this (informational only). */
const STALE_PENDING_MS = 2 * 60 * 60 * 1000;

export type ReconcileJob = {
  readonly source: "sub_missing_payment" | "payment_missing_sub";
  readonly userId: string;
  readonly userEmail: string;
  readonly planId: string;
  readonly razorpay_order_id: string;
  readonly razorpay_payment_id: string;
};

/**
 * Collects inconsistent rows for batch repair via `fulfillPaidSubscription`.
 *
 * 1. Active subscription with Razorpay ids but no `payments.status = success` for that payment id.
 * 2. `payments.status = success` with no `user_subscriptions` row for that payment id (plan/user from order notes).
 */
export async function collectReconcileJobs(
  admin: SupabaseClient,
  limit: number
): Promise<ReconcileJob[]> {
  const jobs: ReconcileJob[] = [];
  const seen = new Set<string>();

  const push = (job: ReconcileJob) => {
    if (seen.has(job.razorpay_payment_id) || jobs.length >= limit) return;
    seen.add(job.razorpay_payment_id);
    jobs.push(job);
  };

  const { data: successRows, error: successErr } = await admin
    .from("payments")
    .select("razorpay_payment_id")
    .eq("status", "success");

  if (successErr) {
    throw new Error(`reconcile: list success payments: ${successErr.message}`);
  }

  const successPayIds = new Set(
    (successRows ?? [])
      .map((r) => r.razorpay_payment_id)
      .filter((id): id is string => Boolean(id))
  );

  const { data: activeSubs, error: subErr } = await admin
    .from("user_subscriptions")
    .select("user_id, plan_id, razorpay_order_id, razorpay_payment_id")
    .eq("status", "active")
    .not("razorpay_payment_id", "is", null)
    .not("razorpay_order_id", "is", null);

  if (subErr) {
    throw new Error(`reconcile: list subscriptions: ${subErr.message}`);
  }

  for (const s of activeSubs ?? []) {
    if (jobs.length >= limit) break;
    const paymentId = s.razorpay_payment_id as string;
    if (successPayIds.has(paymentId)) continue;

    const userId = s.user_id as string;
    const planId = s.plan_id as string;
    const { data: userData, error: uErr } = await admin.auth.admin.getUserById(userId);
    if (uErr || !userData?.user?.email) continue;

    push({
      source: "sub_missing_payment",
      userId,
      userEmail: userData.user.email,
      planId,
      razorpay_order_id: s.razorpay_order_id as string,
      razorpay_payment_id: paymentId,
    });
  }

  if (jobs.length >= limit) {
    return jobs;
  }

  const { data: subPayRows, error: spErr } = await admin
    .from("user_subscriptions")
    .select("razorpay_payment_id")
    .not("razorpay_payment_id", "is", null);

  if (spErr) {
    throw new Error(`reconcile: list subscription payment ids: ${spErr.message}`);
  }

  const subPayIds = new Set(
    (subPayRows ?? [])
      .map((r) => r.razorpay_payment_id)
      .filter((id): id is string => Boolean(id))
  );

  const { data: orphanPayRows, error: opErr } = await admin
    .from("payments")
    .select("user_id, razorpay_order_id, razorpay_payment_id")
    .eq("status", "success")
    .not("razorpay_payment_id", "is", null)
    .not("razorpay_order_id", "is", null)
    .limit(300);

  if (opErr) {
    throw new Error(`reconcile: list orphan payment candidates: ${opErr.message}`);
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const rzp =
    keyId && keySecret ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;

  for (const p of orphanPayRows ?? []) {
    if (jobs.length >= limit) break;
    const paymentId = p.razorpay_payment_id as string;
    if (subPayIds.has(paymentId)) continue;

    const userId = p.user_id as string | null;
    if (!userId) continue;

    const orderId = p.razorpay_order_id as string;
    if (!rzp) continue;

    let order: { notes?: Record<string, string> };
    try {
      order = (await rzp.orders.fetch(orderId)) as { notes?: Record<string, string> };
    } catch {
      continue;
    }

    const planId = order.notes?.planId;
    const noteUserId = order.notes?.userId;
    if (!planId || noteUserId !== userId) continue;

    const { data: userData, error: uErr } = await admin.auth.admin.getUserById(userId);
    if (uErr || !userData?.user?.email) continue;

    push({
      source: "payment_missing_sub",
      userId,
      userEmail: userData.user.email,
      planId,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
    });
  }

  return jobs;
}

export async function countStalePendingPayments(
  admin: SupabaseClient
): Promise<number> {
  const cutoff = new Date(Date.now() - STALE_PENDING_MS).toISOString();
  const { count, error } = await admin
    .from("payments")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")
    .lt("created_at", cutoff);

  if (error) return 0;
  return count ?? 0;
}
