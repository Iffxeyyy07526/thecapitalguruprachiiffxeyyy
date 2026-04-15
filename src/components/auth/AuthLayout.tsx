"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import type { SeoBreadcrumbItem } from "@/components/seo/SeoBreadcrumbs";
import { SeoBreadcrumbs } from "@/components/seo/SeoBreadcrumbs";
import { cn } from "@/lib/utils/cn";

function SignalCard({
  type,
  symbol,
  entry,
  target,
  sl,
  className,
}: Readonly<{
  type: "BUY" | "SELL";
  symbol: string;
  entry: string;
  target: string;
  sl: string;
  className?: string;
}>) {
  const isBuy = type === "BUY";
  return (
    <div
      className={cn(
        "glass-card rounded-xl border px-4 py-3 text-xs backdrop-blur-md",
        isBuy ? "border-primary/40 text-primary" : "border-red-500/40 text-red-300",
        className
      )}
    >
      <p className="font-semibold">
        {type} {symbol} @ {entry}
      </p>
      <p className="mt-1 text-secondary">T: {target} · SL: {sl}</p>
    </div>
  );
}

function AuthBrandPane() {
  return (
    <div className="relative hidden basis-[55%] overflow-hidden border-r border-outline-variant/70 bg-gradient-to-br from-[#0f1f16] via-[#131313] to-[#131313] px-12 py-14 lg:flex">
      <div className="auth-backdrop absolute inset-0 opacity-90" />
      <div className="absolute -left-20 -top-24 h-[380px] w-[380px] rounded-full bg-primary/15 blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col justify-between">
        <div>
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Logo
              className="h-auto w-[min(240px,85%)] max-w-[280px] sm:max-w-[300px]"
              priority
            />
          </Link>

          <h2 className="mt-16 max-w-md font-display text-5xl font-bold leading-[1.1] text-white">
            Trade Smarter. Profit Faster.
          </h2>

          <div className="mt-10 space-y-4">
            <SignalCard
              type="BUY"
              symbol="RELIANCE"
              entry="₹2,450"
              target="₹2,520"
              sl="₹2,410"
              className="animate-landing-float"
            />
            <SignalCard
              type="SELL"
              symbol="HDFCBANK"
              entry="₹1,680"
              target="₹1,630"
              sl="₹1,700"
              className="animate-landing-float-delayed"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 border-t border-outline-variant/60 pt-6">
          <div>
            <p className="font-display text-2xl font-bold text-primary">87.3%</p>
            <p className="text-xs text-secondary">Win Rate</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-primary">2,400+</p>
            <p className="text-xs text-secondary">Active Traders</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-primary">1,200+</p>
            <p className="text-xs text-secondary">Signals</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthLayout({
  children,
  breadcrumbItems,
}: Readonly<{
  children: ReactNode;
  breadcrumbItems?: readonly SeoBreadcrumbItem[];
}>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <AuthBrandPane />

        <div className="flex basis-full items-center justify-center px-4 py-10 sm:px-6 lg:basis-[45%] lg:px-10">
          <div className="w-full max-w-[520px] rounded-2xl border border-outline-variant/70 bg-white/[0.03] p-6 backdrop-blur-md sm:p-8">
            {breadcrumbItems?.length ? (
              <div className="mb-5">
                <SeoBreadcrumbs items={breadcrumbItems} />
              </div>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
