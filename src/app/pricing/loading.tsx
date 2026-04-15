import { PricingCardSkeleton } from "@/components/ui/Skeleton";

export default function PricingLoading() {
  return (
    <main className="pt-20">
      <section className="bg-background py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 h-10 max-w-md animate-pulse rounded-lg bg-surface-container-high" />
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            <PricingCardSkeleton />
            <PricingCardSkeleton />
            <PricingCardSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}
