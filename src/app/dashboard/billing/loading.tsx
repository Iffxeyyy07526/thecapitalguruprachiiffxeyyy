import { TableSkeleton } from "@/components/ui/Skeleton";

export default function BillingLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pt-2">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-container-high/70" />
      <TableSkeleton />
    </div>
  );
}
