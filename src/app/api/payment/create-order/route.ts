import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  planBaseInr,
  totalAmountPaiseWithGst,
  type PlanRow,
} from "@/lib/payment/fulfill-payment";
import { logPaymentError } from "@/lib/payment/payment-log";

const bodySchema = z.object({
  planId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      logPaymentError("create_order_config_missing", { userId: user.id });
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

    const json = await request.json();
    const { planId } = bodySchema.parse(json);

    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("id, name, slug, price, price_inr, duration_months, is_active")
      .eq("id", planId)
      .eq("is_active", true)
      .maybeSingle();

    if (planError || !plan) {
      logPaymentError("create_order_plan_query_failed", {
        userId: user.id,
        planId,
        message: planError?.message,
      });
      return NextResponse.json(
        { ok: false, error: { code: "NOT_FOUND", message: "Plan not found" } },
        { status: 404 }
      );
    }

    const planRow = plan as PlanRow;
    const amountInPaise = totalAmountPaiseWithGst(planRow);

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${user.id}_${Date.now()}`.slice(0, 40),
      notes: {
        userId: user.id,
        planId: planRow.id,
        baseInr: String(planBaseInr(planRow)),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: "INR",
      razorpayKeyId: keyId,
      planId: planRow.id,
      planName: planRow.name,
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
    logPaymentError("create_order_unhandled_error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to create order" } },
      { status: 500 }
    );
  }
}
