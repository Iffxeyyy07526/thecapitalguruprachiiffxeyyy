import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSubscriptionPageData } from "@/lib/dashboard/queries";
import { subscriptionDayMetrics } from "@/lib/dashboard/subscription-math";

function planFeatures(features: unknown): string[] {
  return Array.isArray(features)
    ? (features as string[]).filter((f) => typeof f === "string")
    : [];
}

export default async function SubscriptionPage() {
  const data = await getSubscriptionPageData();
  if (!data) redirect("/login");

  const { subscriptions } = data;
  const now = Date.now();
  const active =
    subscriptions.find(
      (s) => s.status === "active" && new Date(s.end_date).getTime() >= now
    ) ?? null;

  const plan = active?.subscription_plans;
  const upgradeable =
    plan?.slug === "starter" || plan?.slug === "pro";

  const expiryLine =
    active && plan
      ? (() => {
          const { daysRemaining, totalDays } = subscriptionDayMetrics(
            active.start_date,
            active.end_date
          );
          return `${daysRemaining} of ${totalDays} days remaining · ends ${new Date(active.end_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}`;
        })()
      : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="font-display text-2xl font-bold text-white">
        My subscription
      </h1>

      {active && plan ? (
        <Card padding="lg" className="border-white/10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant="success" dot className="text-sm">
              ACTIVE
            </Badge>
          </div>
          <h2 className="mb-2 font-display text-xl font-bold text-white">
            {plan.name} Plan — {plan.duration_months} Months
          </h2>
          {expiryLine ? (
            <p className="mb-6 text-sm text-secondary">{expiryLine}</p>
          ) : null}

          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-surface-container/80 px-4 py-3">
              <p className="font-label text-xs uppercase tracking-wider text-secondary">
                Start date
              </p>
              <p className="mt-1 font-semibold text-white">
                {new Date(active.start_date).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })}
              </p>
            </div>
            <div className="rounded-xl bg-surface-container/80 px-4 py-3">
              <p className="font-label text-xs uppercase tracking-wider text-secondary">
                End date
              </p>
              <p className="mt-1 font-semibold text-white">
                {new Date(active.end_date).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 font-label text-sm font-semibold uppercase tracking-wider text-secondary">
              Plan features
            </h3>
            <ul className="space-y-2">
              {planFeatures(plan.features).map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-secondary"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {upgradeable ? (
            <Link href="/pricing" className={buttonVariants({ size: "md" })}>
              Upgrade Plan
            </Link>
          ) : null}
        </Card>
      ) : (
        <Card padding="lg" className="border-white/10 text-center">
          <p className="mb-4 text-secondary">No active subscription</p>
          <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
            View Plans →
          </Link>
        </Card>
      )}

      {subscriptions.length > 0 ? (
        <Card padding="lg" className="border-white/10">
          <h3 className="mb-4 font-display text-lg font-bold text-white">
            Subscription history
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/40">
                  <th className="py-3 pr-4 text-left font-label text-xs uppercase tracking-wider text-secondary">
                    Plan
                  </th>
                  <th className="py-3 pr-4 text-left font-label text-xs uppercase tracking-wider text-secondary">
                    Start
                  </th>
                  <th className="py-3 pr-4 text-left font-label text-xs uppercase tracking-wider text-secondary">
                    End
                  </th>
                  <th className="py-3 text-left font-label text-xs uppercase tracking-wider text-secondary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-white/[0.06] last:border-0"
                  >
                    <td className="py-3 pr-4 font-semibold text-white">
                      {sub.subscription_plans?.name ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-secondary">
                      {new Date(sub.start_date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 pr-4 text-secondary">
                      {new Date(sub.end_date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          sub.status === "active" ? "success" : "neutral"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
