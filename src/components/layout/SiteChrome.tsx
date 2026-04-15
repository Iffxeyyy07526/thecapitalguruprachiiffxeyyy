"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingTelegramButton } from "@/components/layout/FloatingTelegramButton";
import { PageTransition } from "@/components/layout/PageTransition";
import type { ReactNode } from "react";

const HIDDEN_CHROME_PATHS = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/unverified",
]);

export function SiteChrome({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const hideChrome = HIDDEN_CHROME_PATHS.has(pathname);

  if (hideChrome) {
    return (
      <>
        <PageTransition>{children}</PageTransition>
        <FloatingTelegramButton />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <FloatingTelegramButton />
    </>
  );
}
