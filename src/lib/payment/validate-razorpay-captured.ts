import "server-only";

import Razorpay from "razorpay";
import { logPaymentError } from "@/lib/payment/payment-log";

export type ValidateCapturedResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

/**
 * Fetches the payment from Razorpay and ensures it matches the order and expected amount (paise).
 */
export async function validateRazorpayCapturedPayment(params: {
  paymentId: string;
  orderId: string;
  expectedPaise: number;
  userId: string;
}): Promise<ValidateCapturedResult> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    logPaymentError("external_dependency_unconfigured", {
      dependency: "razorpay_api",
      operation: "payments.fetch",
      paymentId: params.paymentId,
      userId: params.userId,
      orderId: params.orderId,
      message: "Missing NEXT_PUBLIC_RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET",
    });
    return { ok: false, code: "CONFIG", message: "Payment not configured" };
  }

  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const p = (await rzp.payments.fetch(params.paymentId)) as {
      status?: string;
      amount?: number | string;
      order_id?: string | null;
    };

    const status = (p.status || "").toLowerCase();
    if (status !== "captured" && status !== "authorized") {
      return {
        ok: false,
        code: "PAYMENT_NOT_CAPTURED",
        message: `Payment status must be captured or authorized (got ${p.status ?? "unknown"})`,
      };
    }

    const amount =
      typeof p.amount === "string" ? parseInt(p.amount, 10) : Number(p.amount);
    if (!Number.isFinite(amount) || amount !== params.expectedPaise) {
      logPaymentError("razorpay_amount_mismatch", {
        dependency: "razorpay_api",
        operation: "payments.fetch",
        paymentId: params.paymentId,
        userId: params.userId,
        orderId: params.orderId,
        expectedPaise: params.expectedPaise,
        razorpayAmount: amount,
      });
      return {
        ok: false,
        code: "AMOUNT_MISMATCH",
        message: `Expected ${params.expectedPaise} paise; Razorpay reports ${amount}`,
      };
    }

    const oid = p.order_id ?? null;
    if (oid && oid !== params.orderId) {
      logPaymentError("razorpay_order_mismatch", {
        dependency: "razorpay_api",
        operation: "payments.fetch",
        paymentId: params.paymentId,
        userId: params.userId,
        orderId: params.orderId,
        razorpayOrderId: oid,
      });
      return {
        ok: false,
        code: "ORDER_MISMATCH",
        message: "Payment is not linked to this order",
      };
    }

    return { ok: true };
  } catch (e) {
    logPaymentError("external_dependency_razorpay_failed", {
      dependency: "razorpay_api",
      operation: "payments.fetch",
      paymentId: params.paymentId,
      userId: params.userId,
      orderId: params.orderId,
      error: e instanceof Error ? e.name + ": " + e.message : String(e),
    });
    return {
      ok: false,
      code: "RAZORPAY_FETCH_FAILED",
      message: "Could not verify payment with Razorpay",
    };
  }
}
