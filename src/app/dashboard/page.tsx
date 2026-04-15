import { redirect } from "next/navigation";
import { DashboardHomeClient } from "@/components/dashboard/DashboardHomeClient";
import { getDashboardHomeData } from "@/lib/dashboard/queries";
import { subscriptionDayMetrics } from "@/lib/dashboard/subscription-math";

export default async function DashboardPage() {
  const data = await getDashboardHomeData();
  if (!data) {
    redirect("/login");
  }

  const { profile, activeSubscription, recentPayments } = data;
  const plan = activeSubscription?.subscription_plans;

  const memberSinceLabel = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const currentPlanLabel =
    plan && activeSubscription
      ? `${plan.name} ${plan.duration_months} Months`
      : "No Plan";

  let daysRemainingLabel = "—";
  let renewalDays: number | null = null;
  let progressPercent = 0;
  let barTotalDays = 0;
  let barDaysRemaining = 0;

  if (activeSubscription && plan) {
    const m = subscriptionDayMetrics(
      activeSubscription.start_date,
      activeSubscription.end_date
    );
    barTotalDays = m.totalDays;
    barDaysRemaining = m.daysRemaining;
    progressPercent = Math.round(m.progressRatio * 100);
    daysRemainingLabel = String(m.daysRemaining);
    renewalDays = m.daysRemaining;
  }

  return (
    <DashboardHomeClient
      activeSubscription={activeSubscription}
      recentPayments={recentPayments}
      memberSinceLabel={memberSinceLabel}
      currentPlanLabel={currentPlanLabel}
      daysRemainingLabel={daysRemainingLabel}
      renewalDays={renewalDays}
      progressPercent={progressPercent}
      barTotalDays={barTotalDays}
      barDaysRemaining={barDaysRemaining}
    />
  );
}
