"use client";

import { cn } from "@/lib/utils/cn";

export function HeroSignalCard({
  type,
  stock,
  entry,
  target,
  sl,
  change,
  compact,
  className,
}: Readonly<{
  type: "BUY" | "SELL";
  stock: string;
  entry: string;
  target: string;
  sl: string;
  change?: string;
  compact?: boolean;
  className?: string;
}>) {
  const isBuy = type === "BUY";
  return (
    <div
      className={cn(
        "glass-card rounded-xl border backdrop-blur-[18px] transition-[box-shadow,transform,border-color] duration-200 ease-out will-change-transform",
        compact ? "p-4 shadow-depth-sm" : "p-6 shadow-depth-sm md:p-6",
        isBuy
          ? "border-primary/22 shadow-[0_0_0_1px_rgba(93,214,44,0.08),0_12px_40px_-12px_rgba(0,0,0,0.55)] hover:border-primary/35 hover:shadow-[0_0_32px_-8px_rgba(93,214,44,0.18),0_20px_48px_-16px_rgba(0,0,0,0.5)]"
          : "border-white/[0.08] hover:border-white/[0.14] hover:shadow-depth",
        className
      )}
    >
      <div
        className={cn(
          "mb-3 flex flex-wrap items-center justify-between gap-2",
          compact && "mb-2"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-bold tracking-wide",
              compact ? "text-[10px]" : "text-[11px]",
              isBuy
                ? "bg-primary/12 text-primary ring-1 ring-primary/25"
                : "bg-red-500/10 text-red-200/95 ring-1 ring-red-500/15"
            )}
          >
            {type}
          </span>
          <span
            className={cn(
              "font-display font-semibold text-white",
              compact ? "text-sm" : "text-base md:text-lg"
            )}
          >
            {stock}
          </span>
          <span className={cn("text-secondary", compact ? "text-xs" : "text-sm")}>
            @ ₹{entry}
          </span>
        </div>
        {change ? (
          <span
            className={cn(
              "font-medium tabular-nums text-on-surface",
              compact && "text-xs"
            )}
          >
            {change} <span className="text-secondary">↑</span>
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          "grid grid-cols-3 gap-3",
          compact ? "gap-2 text-[10px] md:text-xs" : "text-xs md:text-sm"
        )}
      >
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-secondary">
            Target
          </p>
          <p
            className={cn(
              "font-semibold tabular-nums",
              isBuy ? "text-on-surface" : "text-red-200/90"
            )}
          >
            ₹{target}
          </p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-secondary">
            SL
          </p>
          <p
            className={cn(
              "font-semibold tabular-nums",
              isBuy ? "text-red-300/95" : "text-red-200/85"
            )}
          >
            ₹{sl}
          </p>
        </div>
        <div className="flex items-end justify-end text-secondary">
          <span className="text-[10px] font-medium uppercase tracking-wide text-on-surface-muted">
            Live
          </span>
        </div>
      </div>
    </div>
  );
}
