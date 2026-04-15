"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const TICKS = [
  "Desk active · NSE cash & F&O",
  "Signal queue · 12 live today",
  "Member joined · Pro plan · Pune",
  "BUY alert queued · Large-cap",
  "Risk checks · SL attached to every call",
] as const;

export function HeroLiveActivity() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => {
      setI((n) => (n + 1) % TICKS.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [reduce]);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-black/25 px-3 py-2.5 backdrop-blur-md sm:px-4"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-primary/90">
          Live desk
        </span>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_rgba(93,214,44,0.7)] motion-reduce:animate-none" />
      </div>
      <div className="relative min-h-[2.5rem] sm:min-h-[1.75rem]">
        <AnimatePresence mode="wait">
          <motion.p
            key={reduce ? "static" : i}
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-left font-mono text-[11px] leading-snug text-on-surface-muted sm:text-xs"
          >
            {TICKS[reduce ? 0 : i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
