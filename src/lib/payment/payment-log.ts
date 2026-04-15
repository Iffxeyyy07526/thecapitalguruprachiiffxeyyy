/**
 * Structured payment logs for Vercel / log drains.
 * Always include paymentId and userId when available.
 */

export type PaymentLogContext = {
  paymentId?: string | null;
  userId?: string | null;
  orderId?: string | null;
  [key: string]: unknown;
};

/** SRE: outbound alerts (Telegram/Slack) — deduped in DB; see queuePaymentCriticalAlert. */
const PAYMENT_CRITICAL_ALERT_EVENTS = new Set([
  "webhook_fulfill_failed",
  "fulfill_razorpay_validation_failed",
  "access_email_send_failed",
  "reconcile_poll_budget_exhausted",
]);

function emit(
  level: "error" | "warn" | "info",
  event: string,
  ctx: PaymentLogContext
): void {
  const payload = {
    scope: "payments",
    subsystem: "payment_core",
    level,
    event,
    ...ctx,
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);

  if (PAYMENT_CRITICAL_ALERT_EVENTS.has(event)) {
    void import("@/lib/alerts/payment-critical-alert").then((m) =>
      m.queuePaymentCriticalAlert(event, level, ctx)
    );
  }
}
export function logPaymentError(event: string, ctx: PaymentLogContext = {}): void {
  emit("error", event, ctx);
}

export function logPaymentWarn(event: string, ctx: PaymentLogContext = {}): void {
  emit("warn", event, ctx);
}

export function logPaymentInfo(event: string, ctx: PaymentLogContext = {}): void {
  emit("info", event, ctx);
}
