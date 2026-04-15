import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function SubscriptionLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pt-2">
      <DashboardSkeleton />
    </div>
  );
}
