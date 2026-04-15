"use client";

import { cn } from "@/lib/utils/cn";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion/SectionReveal";

const features = [
  {
    emoji: String.fromCodePoint(0x1f4e1),
    title: "Real-Time Signals",
    description: "NSE & BSE stocks with entry, target, stop-loss",
  },
  {
    emoji: String.fromCodePoint(0x26a1),
    title: "Instant Telegram Delivery",
    description: "Get signals before the market moves",
  },
  {
    emoji: String.fromCodePoint(0x1f4c8),
    title: "Intraday + Positional",
    description: "Calls for all trading styles",
  },
  {
    emoji: String.fromCodePoint(0x1f6e1),
    title: "Risk Management",
    description: "Every call comes with SL and risk-reward ratio",
  },
  {
    emoji: String.fromCodePoint(0x1f4ca),
    title: "Option Chain Analysis",
    description: "Advanced derivatives signals",
  },
  {
    emoji: String.fromCodePoint(0x1f91d),
    title: "Expert Community",
    description: "Learn alongside 2,400+ profitable traders",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-24 relative bg-background py-20 lg:py-28 md:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Why Traders Choose Us
          </h2>
        </SectionReveal>

        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" stagger={0.08}>
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div
                className={cn(
                  "glass-card card-tilt-hover glass-card-hover-glow rounded-xl border border-outline-variant/60 p-6 backdrop-blur-xl",
                  "transition-[transform,box-shadow,border-color] duration-200 ease-out will-change-transform"
                )}
              >
                <div className="mb-4 text-[40px] leading-none" aria-hidden>
                  {f.emoji}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-white">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-secondary">
                  {f.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
