import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LandingPricingServer } from "@/components/landing/LandingPricingServer";
import { PricingCardsSkeleton } from "@/components/landing/PricingCardsSkeleton";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { DisclaimerBanner } from "@/components/landing/DisclaimerBanner";
import { HomeProductJsonLd } from "@/components/seo/HomeProductJsonLd";
import { META_DESC_HOME } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "The Capital Guru — India's #1 Stock Market Signals Platform",
  description: META_DESC_HOME,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background">
      <HomeProductJsonLd />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <Suspense fallback={<PricingCardsSkeleton />}>
        <LandingPricingServer />
      </Suspense>
      <HowItWorksSection />
      <TestimonialsSection />
      <DisclaimerBanner />
    </main>
  );
}
