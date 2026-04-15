"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/Button";
import { HeroDashboardVisual } from "@/components/landing/HeroDashboardVisual";
import { HeroLiveActivity } from "@/components/landing/HeroLiveActivity";
import { HeroPerformanceCards } from "@/components/landing/HeroPerformanceCards";
import { HeroSignalCard } from "@/components/landing/HeroSignalCard";

const trustItems = [
  { icon: String.fromCodePoint(0x1f512), label: "256-bit SSL checkout" },
  { icon: String.fromCodePoint(0x2713), label: "2,400+ active traders" },
  { icon: String.fromCodePoint(0x26a1), label: "Signals in real time" },
] as const;

export function HeroSection() {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="landing-ambient relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-glow-center absolute left-1/2 top-[42%] h-[min(95vw,820px)] w-[min(95vw,820px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]" />
        <div className="ambient-glow-tr absolute -right-[20%] -top-[25%] h-[min(85vw,620px)] w-[min(85vw,620px)] rounded-full blur-[100px]" />
        <div className="ambient-glow-bl absolute -bottom-[30%] -left-[15%] h-[min(90vw,560px)] w-[min(90vw,560px)] rounded-full blur-[110px]" />
      </div>

      <div className="relative z-[1] mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pb-32 lg:pt-36">
        <div className="mx-auto max-w-xl flex-1 text-center lg:mx-0 lg:max-w-[38rem] lg:text-left">
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.62, ease }}
            className="mb-8 flex justify-center lg:mb-10 lg:justify-start"
          >
            <Logo
              className="h-auto w-[min(320px,88vw)] max-w-[360px] opacity-[0.96] sm:max-w-[400px]"
              priority
            />
          </motion.div>

          <div className="mx-auto mb-6 max-w-md space-y-3 lg:mx-0 lg:max-w-lg">
            <motion.div
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.52, delay: reduce ? 0 : 0.04, ease }}
              className="inline-flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-3"
            >
              <div className="inline-flex items-center justify-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)] backdrop-blur-[20px] sm:inline-flex sm:w-auto">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-40 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-glow-primary-sm" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-muted">
                  Live signals active
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.22, delay: reduce ? 0 : 0.1, ease }}
            >
              <HeroLiveActivity />
            </motion.div>
          </div>

          <motion.h1
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.64, delay: reduce ? 0 : 0.12, ease }}
            className="font-display text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[4.75rem] lg:leading-[1.02] xl:text-[5rem]"
          >
            Institutional-Grade Signals for NSE &amp; BSE
          </motion.h1>

          <motion.p
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.56, delay: reduce ? 0 : 0.2, ease }}
            className="mt-7 max-w-lg font-body text-lg leading-[1.62] tracking-[-0.015em] text-secondary md:mx-0 md:text-xl md:leading-[1.62] lg:mx-0"
          >
            Research-backed entries, targets, and stop-losses — delivered on Telegram when
            the setup is live. Built for traders who want clarity, not noise.
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, delay: reduce ? 0 : 0.26, ease }}
            className="mt-8"
          >
            <HeroPerformanceCards />
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, delay: reduce ? 0 : 0.32, ease }}
            className="mt-8 flex justify-center lg:justify-start"
          >
            <div className="w-full max-w-md lg:max-w-none">
              <p className="mb-3 text-left font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-muted">
                Sample signal preview
              </p>
              <HeroSignalCard
                compact
                type="BUY"
                stock="RELIANCE"
                entry="2,450"
                target="2,520"
                sl="2,410"
                change="+2.1%"
                className="text-left transition-[box-shadow,transform,border-color] duration-200"
              />
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, delay: reduce ? 0 : 0.38, ease }}
            className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-start sm:gap-4"
          >
            <Link href="/register" className="sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Get instant access
              </Button>
            </Link>
            <Link href="/pricing" className="sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Compare plans
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, delay: reduce ? 0 : 0.42, ease }}
            className="mt-5 max-w-lg text-left text-[11px] leading-relaxed text-on-surface-muted sm:text-xs"
          >
            <strong className="font-semibold text-secondary">Risk disclosure:</strong> Trading
            involves substantial risk of loss. Past performance does not guarantee future
            results. Read our{" "}
            <Link href="/disclaimer" className="text-primary underline-offset-2 transition-colors duration-200 hover:text-primary/90 hover:underline">
              disclaimer
            </Link>{" "}
            before subscribing.
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, delay: reduce ? 0 : 0.46, ease }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            aria-label="Trust and security"
          >
            {trustItems.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3.5 py-2 text-[11px] font-medium tracking-[0.02em] text-on-surface-muted shadow-[0_4px_24px_-8px_rgba(0,0,0,0.4)] backdrop-blur-[14px] transition-[border-color,transform] duration-200 sm:px-4 sm:text-xs"
              >
                <span className="text-[13px] opacity-90" aria-hidden>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.68, delay: reduce ? 0 : 0.18, ease }}
          className="relative z-[2] mt-16 w-full flex-1 lg:mt-0 lg:min-w-0 lg:max-w-[52%]"
        >
          <HeroDashboardVisual />
        </motion.div>
      </div>
    </section>
  );
}
