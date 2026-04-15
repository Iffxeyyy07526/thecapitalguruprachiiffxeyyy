"use client";

import { SOCIAL_TELEGRAM_URL } from "@/lib/social";

export const FloatingTelegramButton = () => {
  const telegramUrl =
    process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || SOCIAL_TELEGRAM_URL;

  return (
    <a
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="telegram-float"
      title="Chat with Support"
    >
      <div className="telegram-float-ring" />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#0a1f11] relative z-10 -ml-1 mt-1"
      >
        <path
          d="M21.5 2L2 10.5L9.5 13.5M21.5 2L13.5 22L9.5 13.5M21.5 2L9.5 13.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};
