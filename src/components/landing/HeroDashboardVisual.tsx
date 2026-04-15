"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useCallback, useRef } from "react";
import { ASSETS } from "@/lib/assets/paths";
import { cn } from "@/lib/utils/cn";
import { HeroSignalCard } from "@/components/landing/HeroSignalCard";

export function HeroDashboardVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.4 });
  const springY = useSpring(my, { stiffness: 90, damping: 18, mass: 0.4 });
  const rotateX = useTransform(springY, [-0.5, 0.5], reduceMotion ? [0, 0] : [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-5.5, 5.5]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [reduceMotion, mx, my]
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[min(100%,560px)] lg:max-w-none [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute -inset-[min(18%,120px)] -z-10 rounded-[2rem]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(93,214,44,0.16) 0%, transparent 62%), radial-gradient(ellipse 50% 45% at 80% 20%, rgba(93,214,44,0.08) 0%, transparent 50%)",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -10, 0],
                scale: [1, 1.015, 1],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 11, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl ring-1 ring-white/[0.12]",
            !reduceMotion && "animate-hero-chart-drift"
          )}
          style={{
            boxShadow:
              "0 0 0 1px rgba(93,214,44,0.14), 0 36px 88px -22px rgba(0,0,0,0.68), 0 0 72px -28px rgba(93,214,44,0.16), inset 0 1px 0 rgba(255,255,255,0.09)",
          }}
        >
          <Image
            src={ASSETS.images.heroFallbackPng}
            alt="Stock market signals dashboard with live NSE BSE trading data"
            width={1376}
            height={768}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, min(52vw, 720px)"
            priority
            className="h-auto w-full border border-white/[0.06]"
          />

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.03]"
            aria-hidden
          />
        </div>

        <div
          className="absolute -right-1 top-[8%] z-10 w-[min(86%,248px)] translate-z-12 sm:-right-3 sm:top-[10%] sm:w-[260px] md:top-[12%]"
          style={{ transform: "translateZ(24px)" }}
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
            }
          >
            <HeroSignalCard
              compact
              type="BUY"
              stock="RELIANCE"
              entry="2,450"
              target="2,520"
              sl="2,410"
              change="+2.86%"
            />
          </motion.div>
        </div>

        <div
          className="absolute -bottom-1 -left-1 z-10 w-[min(86%,248px)] sm:-bottom-3 sm:-left-3 sm:w-[260px]"
          style={{ transform: "translateZ(32px)" }}
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
            }
          >
            <HeroSignalCard
              compact
              type="SELL"
              stock="HDFCBANK"
              entry="1,680"
              target="1,630"
              sl="1,700"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
