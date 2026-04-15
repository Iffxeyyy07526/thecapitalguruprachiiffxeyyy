import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Instagram } from "lucide-react";
import {
  SOCIAL_INSTAGRAM_URL,
  SOCIAL_TELEGRAM_URL,
} from "@/lib/social";

const platformLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

const legalLinks = [
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Contact", href: "/contact" },
];

function TelegramIcon({ className }: Readonly<{ className?: string }>) {
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

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.06] bg-surface/80">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:gap-16 lg:px-8 lg:py-20">
        <div className="space-y-5 lg:col-span-1">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Logo className="h-8 w-auto" />
          </Link>
          <p className="text-sm leading-relaxed text-on-surface-muted">
            Trade Smarter. Profit Faster.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
            Platform
          </h3>
          <ul className="space-y-3">
            {platformLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="link-premium text-sm text-secondary transition-colors duration-200 hover:text-on-surface"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
            Connect
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href={SOCIAL_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-premium inline-flex items-center gap-2 text-sm text-secondary transition-colors duration-200 hover:text-on-surface"
              >
                <TelegramIcon className="h-4 w-4 shrink-0 opacity-90" />
                Telegram
              </a>
            </li>
            <li>
              <a
                href={SOCIAL_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-premium inline-flex items-center gap-2 text-sm text-secondary transition-colors duration-200 hover:text-on-surface"
              >
                <Instagram className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
            Legal
          </h3>
          <nav aria-label="Legal">
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="link-premium text-sm text-secondary transition-colors duration-200 hover:text-on-surface"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
            Contact
          </h3>
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:mahir@thecapitalguru.net"
                className="link-premium text-sm text-secondary transition-colors duration-200 hover:text-on-surface"
              >
                mahir@thecapitalguru.net
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
          <p className="text-xs leading-relaxed text-on-surface-muted">
            The Capital Guru is not SEBI-registered. All signals are for educational purposes only.
            Trade at your own risk.
          </p>
          <p className="text-xs text-on-surface-muted">© 2026 The Capital Guru. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
