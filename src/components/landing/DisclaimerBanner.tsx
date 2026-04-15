"use client";

import { SectionReveal } from "@/components/motion/SectionReveal";

export function DisclaimerBanner() {
  return (
    <SectionReveal>
      <section
        className="border-y border-amber-900/40 py-6"
        style={{ backgroundColor: "#1a1400" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs leading-relaxed text-secondary md:text-sm">
            <span className="mr-1" aria-hidden>
              {String.fromCodePoint(0x26a0, 0xfe0f)}
            </span>
            The Capital Guru is not SEBI-registered. All signals are for educational
            purposes only. Trade at your own risk.
          </p>
        </div>
      </section>
    </SectionReveal>
  );
}
