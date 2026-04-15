"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, Smartphone, Landmark, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";
import { SOCIAL_TELEGRAM_URL } from "@/lib/social";

export interface PaymentCheckoutProps {
  readonly plan: {
    readonly id: string;
    readonly name: string;
    readonly durationMonths: number;
    readonly features: readonly string[];
    readonly planPriceInr: number;
    readonly gstInr: number;
    readonly totalInr: number;
  };
}

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PaymentCheckout({ plan }: PaymentCheckoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    full_name: string;
    phone: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const planId = plan.id;
  const fmt = (n: number) =>
    `${String.fromCodePoint(0x20b9)}${n.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (id?.startsWith("rzp_live_")) {
        console.warn(
          "WARNING: Using LIVE Razorpay keys in development!"
        );
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.profile) {
          setProfile({
            full_name: data.profile.full_name ?? "",
            phone: data.profile.phone ?? null,
          });
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handlePay = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await orderRes.json();
      if (!orderRes.ok) {
        toast.error("Could not create payment. Try again.");
        setLoading(false);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast.error(
          "Payment gateway unavailable. Please try again or contact support."
        );
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        order_id: data.orderId,
        amount: data.amount,
        currency: "INR",
        name: "The Capital Guru",
        description: `${data.planName} Subscription`,
        theme: { color: "#5DD62C" },
        prefill: {
          name: profile?.full_name || "",
          email: user?.email || "",
          contact: profile?.phone || "",
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          const paymentId = response.razorpay_payment_id;
          try {
            const res = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: paymentId,
                razorpay_signature: response.razorpay_signature,
                planId,
              }),
            });
            if (res.ok) {
              toast.success(
                "Payment successful! Your Telegram link is ready."
              );
              router.push("/dashboard");
              router.refresh();
            } else {
              const body = (await res.json().catch(() => null)) as {
                error?: { message?: string };
              } | null;
              const detail = body?.error?.message;
              toast.error(
                detail
                  ? `Payment verification failed: ${detail} (payment ID: ${paymentId})`
                  : `Payment verification failed. Please contact support with payment ID: ${paymentId}`
              );
            }
          } catch {
            toast.error(
              `Payment verification failed. Please contact support with payment ID: ${paymentId}`
            );
          }
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled");
            setLoading(false);
          },
        },
      });
      rzp.open();
    } catch {
      toast.error("Could not create payment. Try again.");
      setLoading(false);
    }
  }, [loading, planId, profile, user, router]);

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      {/* LEFT — Order summary */}
      <div className="glass-card flex flex-col rounded-2xl border border-white/[0.08] p-6 sm:p-8">
        <h2 className="mb-6 font-display text-xl font-bold text-white sm:text-2xl">
          Order Summary
        </h2>

        <span className="mb-4 inline-flex w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary ring-1 ring-primary/30">
          {plan.name}
        </span>

        <ul className="mb-6 space-y-2.5">
          {plan.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-sm text-secondary"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden
              />
              {f}
            </li>
          ))}
        </ul>

        <p className="mb-4 font-label text-sm text-secondary">
          <span className="text-white/80">Duration:</span>{" "}
          <span className="font-semibold text-white">
            {plan.durationMonths}{" "}
            {plan.durationMonths === 1 ? "month" : "months"}
          </span>
        </p>

        <div className="space-y-3 rounded-xl bg-surface-container/60 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">Plan Price</span>
            <span className="font-medium text-white">{fmt(plan.planPriceInr)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">GST (18%)</span>
            <span className="font-medium text-white">{fmt(plan.gstInr)}</span>
          </div>
          <div className="border-t border-white/10 pt-3">
            <div className="flex justify-between items-baseline">
              <span className="font-label font-semibold text-white">Total</span>
              <span className="font-display text-2xl font-bold text-primary sm:text-3xl">
                {fmt(plan.totalInr)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-6">
          <p className="text-xs font-label text-secondary">Secured by Razorpay</p>
          <Image
            src="https://razorpay.com/assets/razorpay-glyph.svg"
            alt="Razorpay"
            width={28}
            height={28}
            className="h-7 w-7 opacity-90"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-4 text-[11px] font-label text-outline-variant sm:justify-start">
          <span>
            {String.fromCodePoint(0x1f512)} 256-bit SSL
          </span>
          <span className="hidden sm:inline" aria-hidden>
            |
          </span>
          <span>
            {String.fromCodePoint(0x2705)} Razorpay Secured
          </span>
          <span className="hidden sm:inline" aria-hidden>
            |
          </span>
          <span>
            {String.fromCodePoint(0x1f4cb)} GST Invoice
          </span>
        </div>
      </div>

      {/* RIGHT — Payment action */}
      <div className="glass-card flex flex-col rounded-2xl border border-white/[0.08] p-6 sm:p-8">
        <h2 className="mb-6 font-display text-xl font-bold text-white sm:text-2xl">
          Complete Payment
        </h2>

        <p className="mb-3 font-label text-xs uppercase tracking-wider text-secondary">
          We accept
        </p>
        <div className="mb-8 flex flex-wrap items-center gap-4 text-secondary">
          <span
            className="flex items-center gap-1.5 rounded-lg bg-surface-container/80 px-3 py-2 text-xs font-semibold text-white"
            title="UPI"
          >
            <Smartphone className="h-4 w-4 text-primary" aria-hidden />
            UPI
          </span>
          <span
            className="flex items-center gap-1.5 rounded-lg bg-surface-container/80 px-3 py-2 text-xs font-semibold text-white"
            title="Visa"
          >
            <CreditCard className="h-4 w-4 text-primary" aria-hidden />
            Visa
          </span>
          <span
            className="flex items-center gap-1.5 rounded-lg bg-surface-container/80 px-3 py-2 text-xs font-semibold text-white"
            title="Mastercard"
          >
            <CreditCard className="h-4 w-4 text-primary" aria-hidden />
            Mastercard
          </span>
          <span
            className="flex items-center gap-1.5 rounded-lg bg-surface-container/80 px-3 py-2 text-xs font-semibold text-white"
            title="RuPay"
          >
            <CreditCard className="h-4 w-4 text-primary" aria-hidden />
            RuPay
          </span>
          <span
            className="flex items-center gap-1.5 rounded-lg bg-surface-container/80 px-3 py-2 text-xs font-semibold text-white"
            title="Net Banking"
          >
            <Landmark className="h-4 w-4 text-primary" aria-hidden />
            Net Banking
          </span>
        </div>

        <button
          type="button"
          onClick={() => void handlePay()}
          disabled={loading}
          className={cn(
            "btn-primary w-full !py-4 !text-base font-semibold transition-opacity",
            loading && "pointer-events-none opacity-70"
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Processing…
            </span>
          ) : (
            `Pay ${fmt(plan.totalInr)} Now →`
          )}
        </button>

        <p className="mt-6 text-center text-xs leading-relaxed text-secondary">
          By paying you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="text-primary underline-offset-2 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/refund-policy"
            className="text-primary underline-offset-2 hover:underline"
          >
            Refund Policy
          </Link>
          .
        </p>

        <div className="mt-6 border-t border-white/[0.06] pt-6 text-center lg:text-left">
          <a
            href={SOCIAL_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-medium text-primary hover:underline"
          >
            Having trouble? Chat on Telegram →
          </a>
        </div>
      </div>
    </div>
  );
}
