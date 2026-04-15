"use client";

import Logo from "@/components/ui/logo";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "tcg.termsConsent.v1";

export function ConsentGate({ children }: Readonly<{ children: React.ReactNode }>) {
  const [hydrated, setHydrated] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      setAccepted(v === "true");
    } catch {
      setAccepted(false);
    }
    setHydrated(true);
  }, []);

  const blockInteraction = !hydrated || !accepted;

  useEffect(() => {
    if (!hydrated) return;
    if (blockInteraction) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [hydrated, blockInteraction]);

  const onAccept = useCallback(() => {
    if (!agreed) return;
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* private mode — still allow session */
    }
    setAccepted(true);
  }, [agreed]);

  return (
    <>
      {children}
      {blockInteraction ? (
        <div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#0a0a0a]/97 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
          aria-describedby="consent-desc"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 55% at 50% 35%, rgba(93,214,44,0.12) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(93,214,44,0.06) 0%, transparent 45%)",
            }}
          />

          {!hydrated ? (
            <div className="relative flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Loading
              </p>
            </div>
          ) : (
            <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[22px] sm:p-8">
              <div className="mb-6 flex justify-center">
                <Logo
                  variant="symbol"
                  alt=""
                  className="h-12 w-12 drop-shadow-[0_0_20px_rgba(93,214,44,0.35)]"
                  priority
                />
              </div>
              <h1
                id="consent-title"
                className="text-center font-display text-xl font-bold tracking-tight text-white sm:text-2xl"
              >
                Terms &amp; privacy
              </h1>
              <p
                id="consent-desc"
                className="mt-3 text-center text-sm leading-relaxed text-secondary"
              >
                Before you continue, confirm you&apos;ve read our legal terms. This site offers
                market education and signals — not personalized investment advice.
              </p>

              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-4 transition-colors duration-200 hover:border-white/[0.12]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#131313]"
                />
                <span className="text-left text-sm leading-relaxed text-on-surface">
                  I agree to the{" "}
                  <Link
                    href="/terms-of-service"
                    className="font-semibold text-primary underline-offset-2 transition-colors duration-200 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-primary underline-offset-2 transition-colors duration-200 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>
                  , and I understand trading involves risk.
                </span>
              </label>

              <Button
                type="button"
                size="lg"
                fullWidth
                className="mt-6"
                disabled={!agreed}
                onClick={onAccept}
              >
                Continue to site
              </Button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-on-surface-muted">
                You must accept to use The Capital Guru. There is no guest or skip option.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
