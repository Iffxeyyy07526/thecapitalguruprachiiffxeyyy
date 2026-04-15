"use client";

import { motion, useReducedMotion } from "framer-motion";

const metrics = [
  { value: "87.3%", label: "Win rate", sub: "Track record" },
  { value: "1,200+", label: "Signals", sub: "Delivered YTD" },
  { value: "2,400+", label: "Traders", sub: "Active community" },
] as const;

export function HeroPerformanceCards() {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {metrics.map((m, idx) => (
        <motion.div
          key={m.label}
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.22,
            delay: reduce ? 0 : 0.08 + idx * 0.05,
            ease,
          }}
          className="rounded-xl border border-white/[0.09] bg-white/[0.035] px-2 py-3 text-center shadow-[0_8px_28px_-12px_rgba(0,0,0,0.45)] backdrop-blur-[14px] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-primary/25 sm:px-3 sm:py-3.5"
        >
          <p className="font-display text-lg font-bold tabular-nums tracking-tight text-primary sm:text-xl">
            {m.value}
          </p>
          <p className="mt-0.5 font-label text-[9px] font-semibold uppercase tracking-[0.14em] text-white/90 sm:text-[10px]">
            {m.label}
          </p>
          <p className="mt-1 hidden text-[10px] leading-tight text-on-surface-muted sm:block">
            {m.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
