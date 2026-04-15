"use client";

import { useEffect, useRef, useState } from "react";

const rupee = String.fromCodePoint(0x20b9);

const stats = [
  { value: "87.3%", label: "Win Rate" },
  { value: `${rupee}4.2Cr+`, label: "Profits Generated" },
  { value: "2,400+", label: "Members" },
  { value: "1,200+", label: "Signals Delivered" },
];

function StatItem({
  value,
  label,
  index,
  showDivider,
}: Readonly<{
  value: string;
  label: string;
  index: number;
  showDivider: boolean;
}>) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`relative flex flex-1 flex-col items-center justify-center px-4 py-6 text-center transition-[opacity,transform] duration-700 ease-out md:py-8 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {showDivider ? (
        <div
          className="absolute left-0 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-outline-variant md:block"
          aria-hidden
        />
      ) : null}
      <p className="font-display text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-5xl">
        {value}
      </p>
      <p className="mt-2 text-sm text-secondary">{label}</p>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="w-full border-y border-white/[0.06] bg-surface/90 backdrop-blur-[12px]">
      <div className="mx-auto flex max-w-7xl flex-col divide-y divide-outline-variant md:flex-row md:divide-x md:divide-y-0">
        {stats.map((stat, idx) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            label={stat.label}
            index={idx}
            showDivider={idx > 0}
          />
        ))}
      </div>
    </section>
  );
}
