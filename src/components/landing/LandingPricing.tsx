"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion/SectionReveal";

export interface SubscriptionPlanRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  duration_months: number;
  features: unknown;
  is_popular: boolean;
}

function parseFeatures(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter((f): f is string => typeof f === "string");
  }
  return [];
}

function formatInrFromPaise(paise: number): string {
  const rupee = String.fromCodePoint(0x20b9);
  return `${rupee}${(paise / 100).toLocaleString("en-IN")}`;
}

export function LandingPricing({
  plans,
}: Readonly<{ plans: SubscriptionPlanRow[] }>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (!plans.length) {
    return (
      <section id="pricing" className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center text-secondary sm:px-6 lg:px-8">
          Plans are temporarily unavailable. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section
      id="pricing"
      className="relative overflow-x-clip bg-background py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-24 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[280px] w-[280px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/[0.03] blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Choose Your Edge
          </h2>
        </SectionReveal>

        <StaggerGrid
          className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 md:grid-cols-3 md:gap-8"
          stagger={0.09}
        >
          {plans.map((plan) => {
            const featureList = parseFeatures(plan.features);
            const perMonthPaise = Math.round(plan.price / plan.duration_months);
            const perMonth = formatInrFromPaise(perMonthPaise);
            const approxDays = plan.duration_months * 30;
            const perDayPaise = Math.round(plan.price / approxDays);
            const perDay = formatInrFromPaise(perDayPaise);
            const ctaHref = user
              ? `/payment?plan=${plan.id}`
              : `/register?plan=${plan.slug}`;

            return (
              <StaggerItem key={plan.id}>
                <div
                  className={cn(
                    "glass-card card-tilt-hover glass-card-hover-glow flex flex-col rounded-xl border p-8 backdrop-blur-xl",
                    "transition-[transform,box-shadow,border-color] duration-200 ease-out will-change-transform",
                    plan.is_popular
                      ? "relative z-10 border-primary/50 shadow-glow-md md:-mt-2 md:mb-2 md:scale-[1.02]"
                      : "border-outline-variant/70 hover:border-primary/35"
                  )}
                >
                  {plan.is_popular ? (
                    <span className="mb-4 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-black">
                      MOST POPULAR
                    </span>
                  ) : null}

                  <h3 className="font-display text-xl font-bold text-white">
                    {plan.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-white">
                      {formatInrFromPaise(plan.price)}
                    </span>
                    {plan.original_price ? (
                      <span className="text-sm text-secondary line-through">
                        {formatInrFromPaise(plan.original_price)}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-sm text-secondary">
                    {perMonth}/mo · {plan.duration_months}{" "}
                    {plan.duration_months === 1 ? "month" : "months"}
                  </p>
                  <p className="mt-1.5 font-medium text-on-surface/95">
                    <span className="text-primary">≈ {perDay}</span>
                    <span className="text-sm font-normal text-secondary"> / day avg</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-on-surface-muted">
                    Based on {approxDays}-day billing period
                  </p>

                  <ul className="mt-8 flex-1 space-y-3">
                    {featureList.map((line) => (
                      <li
                        key={line}
                        className="flex gap-3 text-sm text-secondary"
                      >
                        <span className="mt-0.5 shrink-0 text-primary" aria-hidden>
                          {String.fromCodePoint(0x2714)}
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={ctaHref} className="mt-8 block">
                    <Button fullWidth size="lg" variant={plan.is_popular ? "primary" : "ghost"}>
                      {user ? "Subscribe now" : "Get instant access"}
                    </Button>
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
