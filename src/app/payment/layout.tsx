import type { Metadata } from "next";
import type { ReactNode } from "react";
import { META_DESC_CHECKOUT } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "Checkout",
  description: META_DESC_CHECKOUT,
  robots: { index: false, follow: false },
};

export default function PaymentLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
