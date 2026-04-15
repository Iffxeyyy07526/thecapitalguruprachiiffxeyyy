import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { fulfillPaidSubscription } from "@/lib/payment/fulfill-payment";
import { logPaymentError } from "@/lib/payment/payment-log";

export const runtime = "nodejs";

const verifySchema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  planId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      logPaymentError("verify_config_missing", { userId: user.id });
      return NextResponse.json(
        { ok: false, error: { code: "CONFIG", message: "Payment not configured" } },
        { status: 500 }
      );
    }

    const ip = getClientIp(request);
    if (!rateLimit(ip, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        { ok: false, error: { code: "RATE_LIMIT", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId } =
      verifySchema.parse(body);

    const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signatureBody)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      logPaymentError("verify_signature_invalid", {
        userId: user.id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      return NextResponse.json(
        { ok: false, error: { code: "INVALID_SIGNATURE", message: "Invalid signature" } },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    let order: { notes?: Record<string, string> };
    try {
      order = (await razorpay.orders.fetch(razorpay_order_id)) as {
        notes?: Record<string, string>;
      };
    } catch (e) {
      logPaymentError("verify_order_fetch_failed", {
        userId: user.id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        error: e instanceof Error ? e.message : String(e),
      });
      return NextResponse.json(
        {
          ok: false,
          error: { code: "ORDER_FETCH_FAILED", message: "Could not verify order with Razorpay" },
        },
        { status: 400 }
      );
    }

    if (order.notes?.userId !== user.id || order.notes?.planId !== planId) {
      logPaymentError("verify_order_notes_mismatch", {
        userId: user.id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        bodyPlanId: planId,
        noteUserId: order.notes?.userId,
        notePlanId: order.notes?.planId,
      });
      return NextResponse.json(
        {
          ok: false,
          error: { code: "ORDER_MISMATCH", message: "Order does not match this checkout session" },
        },
        { status: 400 }
      );
    }

    const admin = createServiceClient();

    const { data: existing } = await admin
      .from("payments")
      .select("id, status")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .maybeSingle();

    if (existing?.status === "success") {
      return NextResponse.json({
        ok: true,
        success: true,
        alreadyProcessed: true,
      });
    }

    const result = await fulfillPaidSubscription(admin, {
      userId: user.id,
      userEmail: user.email,
      planId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!result.ok) {
      logPaymentError("verify_fulfill_failed", {
        userId: user.id,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        code: result.code,
        message: result.message,
      });
      return NextResponse.json(
        { ok: false, error: { code: result.code, message: result.message } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      success: true,
      ...(result.duplicate ? { alreadyProcessed: true as const } : {}),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "INVALID_INPUT", message: error.issues[0]?.message ?? "Invalid body" },
        },
        { status: 400 }
      );
    }
    logPaymentError("verify_unhandled_error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Verification failed" } },
      { status: 500 }
    );
  }
}
