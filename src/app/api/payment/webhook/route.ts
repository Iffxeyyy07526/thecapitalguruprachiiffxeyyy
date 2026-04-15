import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createServiceClient } from "@/lib/supabase/server";
import { fulfillPaidSubscription } from "@/lib/payment/fulfill-payment";
import {
  logPaymentError,
  logPaymentInfo,
  logPaymentWarn,
} from "@/lib/payment/payment-log";

export const runtime = "nodejs";

/**
 * Razorpay expects a timely 2xx. We return 200 for most outcomes to limit retries.
 * Invalid signatures are logged; check Razorpay dashboard if replay is suspected.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const rawBody = await request.text();
  const signature =
    request.headers.get("x-razorpay-signature") ||
    request.headers.get("X-Razorpay-Signature");

  if (!webhookSecret) {
    logPaymentError("webhook_config_missing", { field: "RAZORPAY_WEBHOOK_SECRET" });
    return NextResponse.json({ received: true, ok: false, error: "config" }, { status: 200 });
  }

  if (!signature) {
    logPaymentError("webhook_signature_header_missing", {});
    return NextResponse.json({ received: true, ok: false, error: "no_signature" }, { status: 200 });
  }

  const expectedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (expectedSig !== signature) {
    logPaymentError("webhook_signature_invalid", {});
    return NextResponse.json({ received: true, ok: false, error: "invalid_signature" }, { status: 200 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: { entity?: Record<string, unknown> };
    };
  };

  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch (e) {
    logPaymentError("webhook_json_invalid", {
      error: e instanceof Error ? e.message : String(e),
    });
    return NextResponse.json({ received: true, ok: false, error: "bad_json" }, { status: 200 });
  }

  const admin = createServiceClient();

  try {
    switch (event.event) {
      case "payment.captured": {
        const paymentEntity = event.payload?.payment?.entity;
        if (!paymentEntity || typeof paymentEntity !== "object") {
          logPaymentError("webhook_payment_captured_missing_entity", {});
          break;
        }

        const orderId = paymentEntity.order_id as string | undefined;
        const paymentId = paymentEntity.id as string | undefined;

        if (!orderId || !paymentId) {
          logPaymentError("webhook_payment_captured_missing_ids", {
            orderId: orderId ?? undefined,
            paymentId: paymentId ?? undefined,
          });
          break;
        }

        const { data: existing } = await admin
          .from("payments")
          .select("id, status")
          .eq("razorpay_payment_id", paymentId)
          .maybeSingle();

        if (existing?.status === "success") {
          logPaymentInfo("webhook_payment_captured_already_fulfilled", {
            paymentId,
            orderId,
          });
          break;
        }

        if (!keyId || !keySecret) {
          logPaymentError("webhook_razorpay_keys_missing", { paymentId, orderId });
          break;
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const order = (await razorpay.orders.fetch(orderId)) as {
          notes?: Record<string, string>;
        };

        const userId = order.notes?.userId;
        const planId = order.notes?.planId;

        if (!userId || !planId) {
          logPaymentError("webhook_order_notes_incomplete", {
            paymentId,
            orderId,
            hasUserId: Boolean(userId),
            hasPlanId: Boolean(planId),
          });
          break;
        }

        const { data: userData, error: userErr } = await admin.auth.admin.getUserById(userId);
        const email = userData?.user?.email;
        if (userErr || !email) {
          logPaymentError("webhook_user_email_unavailable", {
            paymentId,
            orderId,
            userId,
            message: userErr?.message,
          });
          break;
        }

        const result = await fulfillPaidSubscription(admin, {
          userId,
          userEmail: email,
          planId,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: null,
        });

        if (!result.ok) {
          logPaymentError("webhook_fulfill_failed", {
            paymentId,
            orderId,
            userId,
            code: result.code,
            message: result.message,
          });
        } else {
          logPaymentInfo("webhook_fulfill_ok", {
            paymentId,
            orderId,
            userId,
            duplicate: Boolean(result.duplicate),
          });
        }
        break;
      }

      case "payment.failed": {
        const paymentEntity = event.payload?.payment?.entity;
        const orderId = paymentEntity?.order_id as string | undefined;
        const paymentId = paymentEntity?.id as string | undefined;
        if (!orderId) {
          logPaymentWarn("webhook_payment_failed_missing_order_id", { paymentId: paymentId ?? null });
          break;
        }

        const { data: updated, error: upErr } = await admin
          .from("payments")
          .update({ status: "failed" })
          .eq("razorpay_order_id", orderId)
          .eq("status", "pending")
          .select("id");

        if (upErr) {
          logPaymentError("webhook_payment_failed_update_error", {
            orderId,
            paymentId: paymentId ?? null,
            message: upErr.message,
          });
        } else if (!updated?.length) {
          logPaymentInfo("webhook_payment_failed_no_pending_rows", {
            orderId,
            paymentId: paymentId ?? null,
          });
        } else {
          logPaymentInfo("webhook_payment_failed_marked", {
            orderId,
            paymentId: paymentId ?? null,
            rowsUpdated: updated.length,
          });
        }
        break;
      }

      default: {
        const ev = event.event;
        if (ev) {
          logPaymentWarn("webhook_unhandled_event", { event: ev });
        }
        break;
      }
    }
  } catch (e) {
    logPaymentError("webhook_handler_exception", {
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return NextResponse.json({ received: true, ok: true }, { status: 200 });
}
