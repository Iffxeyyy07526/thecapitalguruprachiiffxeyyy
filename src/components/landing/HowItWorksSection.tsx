"use client";

import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion/SectionReveal";

const steps = [
  {
    title: "Create your account",
    description: "Sign up in under a minute and verify your email — no paperwork.",
  },
  {
    title: "Choose plan & pay",
    description: "Pick Starter, Pro, or Elite. Pay securely via Razorpay with GST invoice.",
  },
  {
    title: "Get Telegram access",
    description: "Receive your private invite and start getting structured signals instantly.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[min(70vw,420px)] w-[min(70vw,420px)] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-secondary md:text-base">
              Three steps from signup to live signals — built for speed and clarity.
            </p>
          </div>
        </SectionReveal>

        <StaggerGrid
          className="relative mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-10"
          stagger={0.12}
        >
          <div
            className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-0 border-t border-dashed border-primary/35 md:block"
            aria-hidden
          />

          {steps.map((step, idx) => (
            <StaggerItem key={step.title}>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-black shadow-[0_8px_28px_-6px_rgba(93,214,44,0.45)] ring-2 ring-primary/25 transition-transform duration-200 hover:scale-105">
                  {idx + 1}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-white">
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-secondary">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
