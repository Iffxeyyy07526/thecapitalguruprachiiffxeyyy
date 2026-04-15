"use client";

import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion/SectionReveal";

const testimonials = [
  {
    name: "Rahul S.",
    city: "Mumbai",
    initials: "RS",
    quote:
      "Joined the Pro plan 4 months ago. The intraday calls are incredibly accurate. Made back my subscription fee in the first week!",
  },
  {
    name: "Priya M.",
    city: "Bangalore",
    initials: "PM",
    quote:
      "Finally a signal service that actually works. The Telegram group is super active and the team responds quickly.",
  },
  {
    name: "Vikram T.",
    city: "Delhi",
    initials: "VT",
    quote:
      "The option chain signals alone are worth the Elite subscription. Up 34% in 3 months following their calls.",
  },
];

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-primary">
          {String.fromCodePoint(0x2605)}
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            What Our Members Say
          </h2>
        </SectionReveal>

        <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8" stagger={0.1}>
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div
                className="glass-card card-tilt-hover glass-card-hover-glow flex h-full flex-col rounded-xl border border-outline-variant/70 p-8 backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-200 ease-out will-change-transform"
              >
                <Stars />
                <p className="mt-6 flex-1 text-sm leading-relaxed text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-display text-sm font-bold text-primary"
                    aria-hidden
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-secondary">{t.city}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
