import "server-only";

import type { PaymentLogContext } from "@/lib/payment/payment-log";
import { createServiceClient } from "@/lib/supabase/server";

/** One alert per event + paymentId per window (reduces webhook retry spam). */
const DEDUPE_WINDOW_MS = 60 * 60 * 1000;

const MAX_SEND_ATTEMPTS = 3;
const RETRY_BASE_MS = 400;

/** In-process fallback when `payment_alert_dedupe` insert fails (Supabase outage). */
const memoryDedupeUntil = new Map<string, number>();

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function logAlert(
  level: "error" | "warn",
  event: string,
  ctx: Record<string, unknown>
): void {
  const line = JSON.stringify({
    scope: "payments",
    subsystem: "alerting",
    level,
    event,
    ...ctx,
  });
  if (level === "error") console.error(line);
  else console.warn(line);
}

function escapeTelegramHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function extractErrorMessage(ctx: PaymentLogContext): string {
  const c = ctx as Record<string, unknown>;
  const candidates = [
    c.message,
    c.error,
    c.msg,
    c.code,
  ].filter((v) => v != null && String(v).length > 0);
  return candidates.length ? String(candidates[0]) : "no details";
}

function buildDedupeKey(event: string, ctx: PaymentLogContext): string {
  const paymentId = ctx.paymentId ? String(ctx.paymentId) : "unknown";
  const bucket = Math.floor(Date.now() / DEDUPE_WINDOW_MS);
  return `${event}:${paymentId}:${bucket}`;
}

function pruneMemoryDedupe(): void {
  const now = Date.now();
  memoryDedupeUntil.forEach((exp, k) => {
    if (exp <= now) memoryDedupeUntil.delete(k);
  });
}

/**
 * Returns true if this process has not sent this key in the current window (fallback path).
 */
function tryMemoryDedupeClaim(dedupeKey: string): boolean {
  pruneMemoryDedupe();
  if (memoryDedupeUntil.has(dedupeKey)) return false;
  memoryDedupeUntil.set(dedupeKey, Date.now() + DEDUPE_WINDOW_MS);
  return true;
}

type ClaimResult =
  | { readonly send: true; readonly dedupeSource: "db" | "memory" }
  | { readonly send: false; readonly dedupeSource: "duplicate" | "memory_duplicate" };

async function tryClaimDedupeWithFallback(dedupeKey: string): Promise<ClaimResult> {
  try {
    const admin = createServiceClient();
    const { error } = await admin.from("payment_alert_dedupe").insert({
      dedupe_key: dedupeKey,
    });
    if (!error) {
      return { send: true, dedupeSource: "db" };
    }
    if (error.code === "23505") {
      return { send: false, dedupeSource: "duplicate" };
    }

    logAlert("warn", "payment_alert_dedupe_db_unavailable", {
      dependency: "supabase",
      operation: "payment_alert_dedupe.insert",
      code: error.code,
      message: error.message,
      fallback: "memory_dedupe",
    });

    if (!tryMemoryDedupeClaim(dedupeKey)) {
      return { send: false, dedupeSource: "memory_duplicate" };
    }
    logAlert("warn", "payment_alert_dispatch_memory_dedupe_claimed", {
      dependency: "memory",
      message:
        "DB dedupe failed; using in-process fallback (may duplicate across instances)",
    });
    return { send: true, dedupeSource: "memory" };
  } catch (e) {
    logAlert("warn", "payment_alert_dedupe_db_exception", {
      dependency: "supabase",
      operation: "payment_alert_dedupe.insert",
      error: e instanceof Error ? e.message : String(e),
      fallback: "memory_dedupe",
    });

    if (!tryMemoryDedupeClaim(dedupeKey)) {
      return { send: false, dedupeSource: "memory_duplicate" };
    }
    logAlert("warn", "payment_alert_dispatch_memory_dedupe_claimed", {
      dependency: "memory",
      message: "DB dedupe threw; using in-process fallback",
    });
    return { send: true, dedupeSource: "memory" };
  }
}

async function sendWithRetry(
  channel: "telegram" | "slack",
  alertEvent: string,
  trace: { paymentId: string; userId: string; orderId?: string },
  fn: () => Promise<boolean>
): Promise<void> {
  const dependency =
    channel === "telegram" ? "telegram_bot_api" : "slack_incoming_webhook";

  for (let attempt = 1; attempt <= MAX_SEND_ATTEMPTS; attempt++) {
    try {
      const ok = await fn();
      if (ok) {
        if (attempt > 1) {
          logAlert("warn", "payment_alert_external_dependency_recovered", {
            dependency,
            channel,
            alertEvent,
            attempt,
            paymentId: trace.paymentId,
            userId: trace.userId,
            ...(trace.orderId ? { orderId: trace.orderId } : {}),
          });
        }
        return;
      }

      logAlert("warn", "payment_alert_retry_escalation", {
        dependency,
        channel,
        alertEvent,
        attempt,
        maxAttempts: MAX_SEND_ATTEMPTS,
        phase: "non_ok_response",
        paymentId: trace.paymentId,
        userId: trace.userId,
        ...(trace.orderId ? { orderId: trace.orderId } : {}),
        escalation:
          attempt >= MAX_SEND_ATTEMPTS ? "exhausted" : "retry_scheduled",
      });
    } catch (e) {
      logAlert("error", "payment_alert_external_dependency_error", {
        dependency,
        channel,
        alertEvent,
        attempt,
        maxAttempts: MAX_SEND_ATTEMPTS,
        phase: "request_exception",
        error: e instanceof Error ? e.name + ": " + e.message : String(e),
        paymentId: trace.paymentId,
        userId: trace.userId,
        ...(trace.orderId ? { orderId: trace.orderId } : {}),
        escalation:
          attempt >= MAX_SEND_ATTEMPTS ? "exhausted" : "retry_scheduled",
      });
    }

    if (attempt < MAX_SEND_ATTEMPTS) {
      await sleep(RETRY_BASE_MS * Math.pow(2, attempt - 1));
    }
  }

  logAlert("error", "payment_alert_escalation_exhausted", {
    dependency,
    channel,
    alertEvent,
    maxAttempts: MAX_SEND_ATTEMPTS,
    severity: "operator_action_required",
    paymentId: trace.paymentId,
    userId: trace.userId,
    ...(trace.orderId ? { orderId: trace.orderId } : {}),
    message: "All outbound alert attempts failed; check channel config and vendor status",
  });
}

async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.PAYMENT_ALERT_TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.PAYMENT_ALERT_TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return true;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(12_000),
      }
    );
    if (!res.ok) {
      logAlert("error", "payment_alert_external_dependency_http_error", {
        dependency: "telegram_bot_api",
        operation: "sendMessage",
        status: res.status,
        bodyPreview: (await res.text().catch(() => "")).slice(0, 500),
      });
      return false;
    }
    return true;
  } catch (e) {
    logAlert("error", "payment_alert_external_dependency_unreachable", {
      dependency: "telegram_bot_api",
      operation: "sendMessage",
      error: e instanceof Error ? e.name + ": " + e.message : String(e),
    });
    return false;
  }
}

async function sendSlack(text: string): Promise<boolean> {
  const url = process.env.PAYMENT_ALERT_SLACK_WEBHOOK_URL?.trim();
  if (!url) return true;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      logAlert("error", "payment_alert_external_dependency_http_error", {
        dependency: "slack_incoming_webhook",
        operation: "POST",
        status: res.status,
        bodyPreview: (await res.text().catch(() => "")).slice(0, 500),
      });
      return false;
    }
    return true;
  } catch (e) {
    logAlert("error", "payment_alert_external_dependency_unreachable", {
      dependency: "slack_incoming_webhook",
      operation: "POST",
      error: e instanceof Error ? e.name + ": " + e.message : String(e),
    });
    return false;
  }
}

/**
 * Non-blocking: schedules work on the microtask queue. Safe to call from API routes.
 */
export function queuePaymentCriticalAlert(
  event: string,
  level: "error" | "warn" | "info",
  ctx: PaymentLogContext
): void {
  void Promise.resolve()
    .then(() => dispatchPaymentCriticalAlert(event, level, ctx))
    .catch((e) => {
      logAlert("error", "payment_alert_dispatch_unhandled", {
        event,
        error: e instanceof Error ? e.message : String(e),
      });
    });
}

async function dispatchPaymentCriticalAlert(
  event: string,
  level: string,
  ctx: PaymentLogContext
): Promise<void> {
  const hasTelegram =
    Boolean(process.env.PAYMENT_ALERT_TELEGRAM_BOT_TOKEN?.trim()) &&
    Boolean(process.env.PAYMENT_ALERT_TELEGRAM_CHAT_ID?.trim());
  const hasSlack = Boolean(process.env.PAYMENT_ALERT_SLACK_WEBHOOK_URL?.trim());

  if (!hasTelegram && !hasSlack) {
    return;
  }

  const paymentId = ctx.paymentId != null ? String(ctx.paymentId) : "unknown";
  const userId = ctx.userId != null ? String(ctx.userId) : "unknown";
  const message = extractErrorMessage(ctx);
  const orderId =
    ctx.orderId != null && ctx.orderId !== ""
      ? String(ctx.orderId)
      : undefined;

  const dedupeKey = buildDedupeKey(event, ctx);
  const claim = await tryClaimDedupeWithFallback(dedupeKey);
  if (!claim.send) {
    return;
  }

  const trace = { paymentId, userId, ...(orderId ? { orderId } : {}) };

  const plainLines = [
    `[${level.toUpperCase()}] Payment critical: ${event}`,
    `paymentId: ${paymentId}`,
    `userId: ${userId}`,
    ...(orderId ? [`orderId: ${orderId}`] : []),
    `message: ${message}`,
    `dedupe: ${claim.dedupeSource}`,
  ];
  const plain = plainLines.join("\n");

  const tgLines = [
    `<b>Payment critical</b> <code>${escapeTelegramHtml(event)}</code> (${escapeTelegramHtml(level)})`,
    `<b>paymentId</b>: <code>${escapeTelegramHtml(paymentId)}</code>`,
    `<b>userId</b>: <code>${escapeTelegramHtml(userId)}</code>`,
    ...(orderId
      ? [`<b>orderId</b>: <code>${escapeTelegramHtml(orderId)}</code>`]
      : []),
    `<b>message</b>: ${escapeTelegramHtml(message)}`,
    `<b>dedupe</b>: <code>${escapeTelegramHtml(claim.dedupeSource)}</code>`,
  ];
  const telegramText = tgLines.join("\n");

  await Promise.all([
    hasTelegram
      ? sendWithRetry("telegram", event, trace, () => sendTelegram(telegramText))
      : Promise.resolve(),
    hasSlack
      ? sendWithRetry("slack", event, trace, () => sendSlack(plain))
      : Promise.resolve(),
  ]);
}
