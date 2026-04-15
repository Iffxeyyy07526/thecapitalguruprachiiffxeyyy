"use client";

import Link from "next/link";
import Logo from "@/components/ui/logo";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils/cn";
import { NavbarSocialLinks } from "@/components/layout/NavbarSocialLinks";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

function isLinkActive(pathname: string, hash: string, href: string) {
  if (href === "/") return pathname === "/" && hash === "";
  if (href.startsWith("/#")) return pathname === "/" && hash === href.slice(1);
  return pathname === href;
}

export function Navbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hash, setHash] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    let isMounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setUser(data.session?.user ?? null);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const cta = useMemo(() => {
    if (user) {
      return (
        <Link href="/dashboard">
          <Button size="sm" variant="primary">
            Dashboard
          </Button>
        </Link>
      );
    }

    return (
      <>
        <Link href="/login">
          <Button size="sm" variant="ghost">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" variant="primary">
            Get Started
          </Button>
        </Link>
      </>
    );
  }, [user]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[rgba(19,19,19,0.72)] shadow-[0_1px_0_rgba(255,255,255,0.05),0_12px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur-[20px] backdrop-saturate-150">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 opacity-[0.96] transition-[opacity,transform] duration-300 ease-out hover:opacity-100"
        >
          <Logo
            className="h-7 w-auto transition-transform duration-300 ease-out group-hover:scale-[1.03] sm:h-8"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-premium text-[13px] text-secondary transition-colors duration-300 ease-out hover:text-white",
                isLinkActive(pathname, hash, link.href) && "font-medium text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <NavbarSocialLinks />
          {cta}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.02] text-on-surface transition-colors duration-200 hover:border-white/[0.14] hover:bg-white/[0.04] lg:hidden"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileOpen}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d={isMobileOpen ? "M6 6L18 18M18 6L6 18" : "M4 7H20M4 12H20M4 17H20"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/[0.06] bg-surface/95 px-4 backdrop-blur-lg transition-[max-height,padding] duration-300 ease-out lg:hidden",
          isMobileOpen ? "max-h-[min(85vh,520px)] py-5" : "max-h-0 py-0"
        )}
      >
        <div className="mb-5 flex justify-center border-b border-white/[0.06] pb-5">
          <NavbarSocialLinks iconClassName="h-5 w-5" />
        </div>
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-premium rounded-lg px-3 py-2 text-sm text-secondary transition-colors duration-200 hover:bg-white/[0.04] hover:text-on-surface",
                isLinkActive(pathname, hash, link.href) && "font-medium text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5 flex flex-col gap-2">
          {user ? (
            <Link href="/dashboard">
              <Button fullWidth size="sm" variant="primary">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button fullWidth size="sm" variant="ghost">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button fullWidth size="sm" variant="primary">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
