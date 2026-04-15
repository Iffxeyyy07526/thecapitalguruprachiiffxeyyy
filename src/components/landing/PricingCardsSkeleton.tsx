import { PricingCardSkeleton } from "@/components/ui/Skeleton";

export function PricingCardsSkeleton() {
  return (
    <section id="pricing" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 h-10 max-w-md animate-pulse rounded-lg bg-surface-container-high" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <PricingCardSkeleton />
          <PricingCardSkeleton />
          <PricingCardSkeleton />
        </div>
      </div>
    </section>
  );
}
