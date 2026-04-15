"use client";

import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SOCIAL_INSTAGRAM_URL, SOCIAL_TELEGRAM_URL } from "@/lib/social";

function TelegramGlyph({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21.5 3L2.5 10.6L8.9 13.2M21.5 3L12.3 21L8.9 13.2M21.5 3L8.9 13.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface NavbarSocialLinksProps {
  readonly className?: string;
  readonly iconClassName?: string;
}

export function NavbarSocialLinks({
  className,
  iconClassName,
}: NavbarSocialLinksProps) {
  const link =
    "flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:text-primary";

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <a
        href={SOCIAL_TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={link}
        aria-label="The Capital Guru on Telegram"
      >
        <TelegramGlyph className={cn("h-[18px] w-[18px]", iconClassName)} />
      </a>
      <a
        href={SOCIAL_INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={link}
        aria-label="The Capital Guru on Instagram"
      >
        <Instagram className={cn("h-[18px] w-[18px]", iconClassName)} strokeWidth={1.75} />
      </a>
    </div>
  );
}
