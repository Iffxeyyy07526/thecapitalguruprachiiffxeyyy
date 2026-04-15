"use client";

import Link from "next/link";
import { Link2, ClipboardCopy, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type {
  DashboardPaymentSummary,
  UserSubscriptionRow,
} from "@/lib/dashboard/types";
import { SOCIAL_TELEGRAM_URL } from "@/lib/social";

type Props = {
  activeSubscription: UserSubscriptionRow | null;
  recentPayments: DashboardPaymentSummary[];
  memberSinceLabel: string;
  currentPlanLabel: string;
  daysRemainingLabel: string;
  renewalDays: number | null;
  progressPercent: number;
  barTotalDays: number;
  barDaysRemaining: number;
};

function statusBadgeVariant(
  status: string
): "success" | "danger" | "warning" {
  const s = status.toLowerCase();
  if (s === "success") return "success";
  if (s === "pending") return "warning";
  return "danger";
}

function statusLabel(status: string) {
  const s = status.toLowerCase();
  if (s === "success") return "Success";
  if (s === "pending") return "Pending";
  if (s === "failed") return "Failed";
  return status;
}

export function DashboardHomeClient({
  activeSubscription,
  recentPayments,
  memberSinceLabel,
  currentPlanLabel,
  daysRemainingLabel,
  renewalDays,
  progressPercent,
  barTotalDays,
  barDaysRemaining,
}: Props) {
  const plan = activeSubscription?.subscription_plans;
  const telegramUrl =
    activeSubscription?.telegram_link ||
    process.env.NEXT_PUBLIC_TELEGRAM_GROUP ||
    SOCIAL_TELEGRAM_URL;

  const planTitle = plan
    ? `${plan.name} Plan — ${plan.duration_months} Months`
    : "";

  const copyTelegram = async () => {
    try {
      await navigator.clipboard.writeText(telegramUrl);
      toast.success("Telegram link copied to clipboard");
    } catch {
      toast.error("Could not copy link. Try again.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Card padding="lg" className="border-white/10">
        {activeSubscription && plan ? (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="success" dot className="text-sm">
                ACTIVE
              </Badge>
            </div>
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-white">
              {planTitle}
            </h2>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-surface-container/80 px-4 py-3">
                <p className="font-label text-xs uppercase tracking-wider text-secondary">
                  Start date
                </p>
                <p className="mt-1 font-semibold text-white">
                  {new Date(activeSubscription.start_date).toLocaleDateString(
                    "en-IN",
                    { dateStyle: "medium" }
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-surface-container/80 px-4 py-3">
                <p className="font-label text-xs uppercase tracking-wider text-secondary">
                  End date
                </p>
                <p className="mt-1 font-semibold text-white">
                  {new Date(activeSubscription.end_date).toLocaleDateString(
                    "en-IN",
                    { dateStyle: "medium" }
                  )}
                </p>
              </div>
            </div>
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-secondary">
                  {barDaysRemaining} days remaining
                </span>
                <span className="font-mono text-xs text-secondary">
                  {barTotalDays} days total
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={() =>
                  window.open(telegramUrl, "_blank", "noopener,noreferrer")
                }
                leftIcon={<Link2 className="h-4 w-4" aria-hidden />}
              >
                Join Telegram Group
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => void copyTelegram()}
                leftIcon={<ClipboardCopy className="h-4 w-4" aria-hidden />}
              >
                Copy Link
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <Badge variant="warning" dot className="text-sm">
                NO ACTIVE PLAN
              </Badge>
            </div>
            <p className="mb-6 text-secondary">
              You don&apos;t have an active subscription yet.
            </p>
            <Link
              href="/pricing"
              className={buttonVariants({ size: "lg" })}
            >
              View Plans →
            </Link>
          </>
        )}
      </Card>

      {renewalDays !== null && renewalDays <= 7 && activeSubscription && (
        <div className="flex flex-col gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm text-amber-100">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
              aria-hidden
            />
            <span>
              Your subscription expires in {renewalDays} days! Renew now to
              maintain Telegram access.
            </span>
          </p>
          <Link
            href="/pricing"
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "whitespace-nowrap",
            })}
          >
            Renew Now →
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Member Since", value: memberSinceLabel },
          { label: "Current Plan", value: currentPlanLabel },
          { label: "Days Remaining", value: daysRemainingLabel },
        ].map((s) => (
          <Card key={s.label} padding="md" className="border-white/10">
            <p className="font-label text-xs uppercase tracking-wider text-secondary">
              {s.label}
            </p>
            <p className="mt-2 font-display text-lg font-semibold text-white">
              {s.value}
            </p>
          </Card>
        ))}
      </div>

      <Card padding="lg" className="border-white/10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="font-display text-lg font-bold text-white">
            Recent payments
          </h3>
          <Link
            href="/dashboard/billing"
            className="font-label text-xs font-semibold uppercase tracking-wider text-primary hover:brightness-110"
          >
            View All →
          </Link>
        </div>
        {recentPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/40">
                  <th className="py-3 pr-4 text-left font-label text-xs uppercase tracking-wider text-secondary">
                    Date
                  </th>
                  <th className="py-3 pr-4 text-left font-label text-xs uppercase tracking-wider text-secondary">
                    Plan
                  </th>
                  <th className="py-3 pr-4 text-left font-label text-xs uppercase tracking-wider text-secondary">
                    Amount
                  </th>
                  <th className="py-3 text-left font-label text-xs uppercase tracking-wider text-secondary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/[0.06] last:border-0"
                  >
                    <td className="py-3 pr-4 text-secondary">
                      {new Date(p.created_at).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className="py-3 pr-4 font-medium text-white">
                      {p.plan_name}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-white">
                      ₹{(p.amount / 100).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3">
                      <Badge variant={statusBadgeVariant(p.status)}>
                        {statusLabel(p.status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-secondary">No payments yet.</p>
        )}
      </Card>

      {activeSubscription && plan && (
        <Card padding="lg" className="border-white/10 bg-surface-container/30">
          <h3 className="mb-6 font-display text-lg font-bold text-white">
            How to use
          </h3>
          <ol className="space-y-4">
            {[
              "Click Join Telegram Group",
              "Request to join",
              "Start receiving signals",
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-label text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-secondary">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
