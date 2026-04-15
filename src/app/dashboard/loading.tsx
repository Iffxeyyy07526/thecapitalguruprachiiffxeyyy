import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <DashboardSkeleton />
    </div>
  );
}
