"use client";

import { useEffect } from "react";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { SOCIAL_TELEGRAM_URL } from "@/lib/social";

const TELEGRAM_SUPPORT =
  process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || SOCIAL_TELEGRAM_URL;

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-16">
      <div className="legal-glass-card max-w-md px-8 py-10 text-center">
        <div className="flex justify-center">
          <Logo variant="symbol" className="h-11 w-11" />
        </div>
        <p className="mt-5 font-label text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          The Capital Guru
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">
          Something went wrong
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-secondary">
          A temporary fault interrupted this request. You can retry, or reach us on Telegram.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" variant="primary" size="lg" onClick={() => reset()}>
            Try Again
          </Button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "border border-outline-variant/60"
            )}
          >
            Go to Homepage
          </Link>
          <Link
            href={TELEGRAM_SUPPORT}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "border border-primary/30"
            )}
          >
            Telegram support
          </Link>
        </div>
      </div>
    </main>
  );
}
