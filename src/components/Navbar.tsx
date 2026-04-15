"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { SystemStatus } from "@/components/dashboard/SystemStatus";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <div className={`rounded-xl transition-all duration-700 ${isScrolled ? 'nav-blur shadow-glow-primary-sm py-2 bg-black/70' : 'bg-white/[0.01] border border-white/[0.04] backdrop-blur-xl py-3'}`}>
        <div className="px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95 group">
               <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Logo
                    priority
                    className="relative z-10 brightness-[1.1]"
                  />
               </div>
            </Link>

            <div className="hidden xl:block">
              <SystemStatus />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[12px] font-bold uppercase tracking-[0.15em] transition-all relative py-1 hover:text-white ${isActive ? 'text-primary' : 'text-on-surface-muted'}`}
                >
                  {link.label}
                  {isActive && <div className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-glow-primary" />}
                </Link>
              );
            })}
          </div>

          {/* Auth Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm" className="font-bold">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-[13px] font-bold uppercase tracking-[0.08em] text-on-surface-muted hover:text-white transition-colors px-4">
                  Log In
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="font-bold">
                    Start Trading
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.1] active:scale-90 transition-transform"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-[1.5px] bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[4.5px] w-5' : 'w-5'}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-3 ml-auto'}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[4.5px] w-5' : 'w-5'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`lg:hidden absolute top-full left-0 right-0 mt-3 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-surface-dim/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-6 border-t border-white/[0.05] flex flex-col gap-3">
              {user ? (
                <Link href="/dashboard">
                  <Button fullWidth>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" fullWidth>Log In</Button>
                  </Link>
                  <Link href="/register">
                    <Button fullWidth>Start Trading</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
