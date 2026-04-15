import type { Metadata } from "next";
import { PricingSection } from "@/components/landing/PricingSection";
import { SeoBreadcrumbs } from "@/components/seo/SeoBreadcrumbs";
import { META_DESC_PRICING } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description: META_DESC_PRICING,
  alternates: { canonical: "/pricing" },
  robots: { index: true, follow: true },
};

export default function PricingPage() {
  return (
    <main className="pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <SeoBreadcrumbs items={[{ name: "Pricing", href: "/pricing" }]} />
      </div>
      <PricingSection isFullPage />
    </main>
  );
}
