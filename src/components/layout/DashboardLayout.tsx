"use client";

import { ReactNode, useCallback } from "react";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CreditCard,
  Home,
  LogOut,
  Receipt,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

import { FloatingTelegramButton } from "@/components/layout/FloatingTelegramButton";
import { SOCIAL_TELEGRAM_URL } from "@/lib/social";

const SUPPORT_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || SOCIAL_TELEGRAM_URL;

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  {
    label: "My Subscription",
    href: "/dashboard/subscription",
    icon: CreditCard,
  },
  { label: "Billing History", href: "/dashboard/billing", icon: Receipt },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function initialsFromName(firstName: string) {
  const t = firstName.trim();
  if (!t) return "?";
  return t.slice(0, 2).toUpperCase();
}

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-white/[0.06] bg-surface lg:flex">
      <div className="border-b border-white/[0.06] p-6">
        <Link href="/dashboard" className="block opacity-90 transition-opacity hover:opacity-100">
          <Logo className="brightness-110" />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-r-lg border-l-4 py-3 pl-4 pr-3 font-label text-sm font-semibold transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent text-secondary hover:bg-white/[0.04] hover:text-on-surface"
              )}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/[0.06] p-4">
        <a
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5 font-label text-[11px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10"
        >
          Telegram
        </a>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl border-l-4 border-transparent py-3 pl-4 pr-3 text-left font-label text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden />
          Logout
        </button>
      </div>
    </aside>
  );
}

function MobileNav({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/[0.08] bg-surface/95 px-1 py-2 backdrop-blur-lg lg:hidden">
      {navItems.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              "flex flex-1 flex-col items-center justify-center rounded-lg py-2 transition-colors",
              active ? "text-primary" : "text-secondary hover:text-on-surface"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onLogout}
        className="flex flex-1 flex-col items-center justify-center rounded-lg py-2 text-secondary hover:text-red-400"
        aria-label="Log out"
      >
        <LogOut className="h-6 w-6" aria-hidden />
      </button>
    </nav>
  );
}

function TopBar({ firstName }: { firstName: string }) {
  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/85 px-4 py-4 backdrop-blur-xl sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="mr-2 hidden shrink-0 opacity-90 transition-opacity hover:opacity-100 sm:block"
          aria-label="Dashboard home"
        >
          <Logo variant="symbol" alt="" className="h-9 w-9" />
        </Link>
        <h1 className="font-display text-base font-bold tracking-tight text-white sm:text-lg">
          {greeting}, {firstName}{" "}
          <span aria-hidden>{'\uD83D\uDC4B'}</span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-container text-secondary transition-colors hover:border-primary/40 hover:text-primary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" aria-hidden />
          </button>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/15 font-label text-sm font-bold text-primary"
            title={firstName}
          >
            {initialsFromName(firstName)}
          </div>
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout({
  children,
  firstName,
}: {
  children: ReactNode;
  firstName: string;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const onLogout = useCallback(async () => {
    await signOut();
    router.push("/");
    router.refresh();
  }, [router, signOut]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-5">
          <Logo variant="symbol" className="h-12 w-12 opacity-90" priority />
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent shadow-glow" />
          <span className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Loading dashboard…
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <Sidebar onLogout={onLogout} />
      <div className="flex min-h-0 flex-1 flex-col pb-20 lg:pb-0">
        <TopBar firstName={firstName} />
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
      <MobileNav onLogout={onLogout} />
      <FloatingTelegramButton />
    </div>
  );
}
