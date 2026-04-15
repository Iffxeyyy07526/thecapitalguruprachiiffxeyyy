"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion/SectionReveal";

const inr = String.fromCodePoint(0x20b9);

const programs = [
  {
    name: "Starter Plan",
    slug: "starter",
    price: 2499,
    originalPrice: null,
    duration: "1 Month Access",
    isPopular: false,
    features: [
      "Daily trading signals",
      "Intraday trading strategies",
      "Clear Stop Loss & Targets",
      "Private Telegram access",
      "Daily market updates",
    ],
  },
  {
    name: "Professional Plan",
    slug: "pro",
    price: 11999,
    originalPrice: 14994,
    duration: "6 Months Access",
    isPopular: true,
    features: [
      "Everything in Starter",
      "High-accuracy swing signals",
      "Advanced option strategies",
      "Detailed market analysis",
      "Priority chat support",
      "Weekly portfolio reviews",
    ],
  },
  {
    name: "Elite Plan",
    slug: "elite",
    price: 19999,
    originalPrice: 29988,
    duration: "1 Year Access",
    isPopular: false,
    features: [
      "Everything in Professional",
      "Direct calls with analysts",
      "Personalized trading plan",
      "Premium hedging strategies",
      "Early access to new features",
      "Private VIP trading group",
    ],
  },
];

export function PricingSection({ isFullPage = false }: { isFullPage?: boolean }) {
  return (
    <section
      id="pricing"
      className={`relative ${isFullPage ? "py-32 lg:py-48" : "py-24 lg:py-32"} scroll-mt-24 overflow-x-clip overflow-y-visible bg-background md:scroll-mt-28`}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.02] blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <SectionReveal>
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Membership Plans
              </span>
              <div className="h-px w-8 bg-primary/30" />
            </div>
            <h2 className="mb-6 font-display text-4xl font-bold text-white md:text-6xl">
              Choose the <span className="text-gradient">right plan for you.</span>
            </h2>
            <p className="text-lg font-medium leading-relaxed text-on-surface-muted">
              Join thousands of traders and start receiving high-accuracy signals today. Simple,
              secure, and professional.
            </p>
          </div>
        </SectionReveal>

        <StaggerGrid
          className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 md:grid-cols-3"
          stagger={0.1}
        >
          {programs.map((plan) => (
            <StaggerItem key={plan.slug}>
              <Card
                featured={plan.isPopular}
                interactive
                className={`relative flex flex-col !p-10 !pt-12 ${
                  plan.isPopular
                    ? "z-20 md:scale-[1.08]"
                    : "bg-white/[0.01] opacity-90 hover:opacity-100"
                }`}
              >
                {plan.isPopular ? (
                  <div className="absolute left-0 right-0 top-0 h-[3px] bg-primary-gradient" />
                ) : null}

                <div className="mb-10">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-muted">
                      {plan.name}
                    </h3>
                    {plan.isPopular ? (
                      <span className="rounded border border-primary/40 px-2 py-0.5 text-[9px] font-bold leading-none text-primary">
                        MOST POPULAR
                      </span>
                    ) : null}
                  </div>
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-bold tracking-tighter text-white">
                      {inr}
                      {plan.price.toLocaleString("en-IN")}
                    </span>
                    {plan.originalPrice ? (
                      <span className="text-sm text-on-surface-muted line-through">
                        {inr}
                        {plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/80">
                    {plan.duration}
                  </p>
                </div>

                <div className="mb-10 h-px bg-white/[0.05]" />

                <ul className="mb-12 flex-1 space-y-5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="group flex items-start gap-4 text-xs font-medium text-on-surface-muted"
                    >
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                        <div className="h-1 w-1 rounded-full bg-primary shadow-glow-primary" />
                      </div>
                      <span className="leading-tight transition-colors group-hover:text-white">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={`/register?plan=${plan.slug}`} className="block">
                  <Button
                    variant={plan.isPopular ? "primary" : "ghost"}
                    fullWidth
                    size="lg"
                    className="rounded-lg py-4 font-bold"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <SectionReveal delay={0.08}>
          <p className="mt-16 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-muted">
            <span className="mr-0.5" aria-hidden>
              {String.fromCodePoint(0x1f512)}
            </span>
            256-Bit SSL Encrypted Payments &middot; GST Invoicing Included
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
