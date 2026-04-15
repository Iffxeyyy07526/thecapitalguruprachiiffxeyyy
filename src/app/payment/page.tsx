import Logo from "@/components/ui/logo";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { planBaseInr, type PlanRow } from "@/lib/payment/fulfill-payment";
import { PaymentCheckout } from "./PaymentCheckout";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseFeatures(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter((f): f is string => typeof f === "string");
  }
  return [];
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = searchParams.plan;
  const planId = Array.isArray(raw) ? raw[0] : raw;

  if (!planId || !UUID_RE.test(planId)) {
    redirect("/pricing");
  }

  const supabase = createServerSupabaseClient();
  const { data: row, error } = await supabase
    .from("subscription_plans")
    .select(
      "id, name, slug, price, price_inr, duration_months, features, is_active"
    )
    .eq("id", planId)
    .maybeSingle();

  if (error || !row) {
    redirect("/pricing");
  }

  const plan = row as PlanRow & {
    is_active?: boolean | null;
    features?: unknown;
  };
  if (plan.is_active === false) {
    redirect("/pricing");
  }

  const baseInr = planBaseInr(plan);
  const gstInr = Math.round(baseInr * 0.18);
  const totalInr = Math.round(baseInr + gstInr);
  const features = parseFeatures(plan.features);

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center lg:text-left">
          <Link href="/" className="mb-6 inline-block transition-opacity hover:opacity-90">
            <Logo
              className="mx-auto h-8 w-auto lg:mx-0"
              priority
            />
          </Link>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Complete your subscription securely with Razorpay.
          </p>
        </div>

        <PaymentCheckout
          plan={{
            id: plan.id,
            name: plan.name,
            durationMonths: plan.duration_months,
            features,
            planPriceInr: baseInr,
            gstInr,
            totalInr,
          }}
        />

        <p className="mt-8 text-center text-xs text-secondary">
          <Link href="/pricing" className="text-primary hover:underline">
            ← Back to plans
          </Link>
        </p>
      </div>
    </div>
  );
}
