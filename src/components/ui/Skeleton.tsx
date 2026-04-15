import { cn } from "@/lib/utils/cn";

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "skeleton-shimmer rounded-xl bg-surface-container-highest/55",
        className
      )}
      {...props}
    />
  );
};

export const DashboardSkeleton = () => (
  <div className="max-w-5xl space-y-6">
    <Skeleton className="h-48 rounded-2xl" />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
    </div>
    <Skeleton className="h-48 rounded-2xl" />
  </div>
);

export const PricingCardSkeleton = () => (
  <Skeleton className="h-96 rounded-2xl" />
);

export const TableSkeleton = () => (
  <div className="glass-card p-6">
    <Skeleton className="mb-6 h-6 w-1/4" />
    <div className="space-y-4">
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
    </div>
  </div>
);
