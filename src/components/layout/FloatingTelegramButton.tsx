"use client";

import { SOCIAL_TELEGRAM_URL } from "@/lib/social";

const supportUrl =
  process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || SOCIAL_TELEGRAM_URL;

export function FloatingTelegramButton() {
  const handleClick = () => {
    window.open(supportUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="group fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] right-4 z-[9999] sm:bottom-6 sm:right-6">
      <div className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 rounded-md border border-outline-variant bg-surface px-3 py-1 text-xs text-on-surface opacity-0 shadow-glow transition-opacity duration-200 group-hover:opacity-100 sm:block">
        Chat with Support
      </div>

      <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/40 opacity-60 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] motion-reduce:hidden" />

      <button
        type="button"
        onClick={handleClick}
        aria-label="Chat with Telegram support"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-glow-lg transition-all duration-200 hover:scale-110 hover:shadow-[0_0_55px_rgba(75,226,119,0.55)] sm:h-14 sm:w-14"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 sm:h-7 sm:w-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.5 3L2.5 10.6L8.9 13.2M21.5 3L12.3 21L8.9 13.2M21.5 3L8.9 13.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
