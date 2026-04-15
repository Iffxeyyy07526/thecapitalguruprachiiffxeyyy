import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  LandingPricing,
  type SubscriptionPlanRow,
} from "@/components/landing/LandingPricing";

export async function LandingPricingServer() {
  const supabase = createServerSupabaseClient();
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select(
      "id,name,slug,price,original_price,duration_months,features,is_popular"
    )
    .order("duration_months", { ascending: true });

  return (
    <LandingPricing plans={(plans as SubscriptionPlanRow[] | null) ?? []} />
  );
}
