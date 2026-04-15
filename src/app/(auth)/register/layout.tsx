import type { Metadata } from "next";
import type { ReactNode } from "react";
import { META_DESC_REGISTER } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "Join Stock Market Signals India — Free Telegram Trial",
  description: META_DESC_REGISTER,
  alternates: { canonical: "/register" },
  robots: { index: true, follow: true },
};

export default function RegisterLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
