import type { Metadata } from "next";
import type { ReactNode } from "react";
import { META_DESC_LOGIN } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "Login",
  description: META_DESC_LOGIN,
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
