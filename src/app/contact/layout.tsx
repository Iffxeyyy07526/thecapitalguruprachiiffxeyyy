import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ContactPageJsonLd } from "@/components/seo/ContactPageJsonLd";
import { META_DESC_CONTACT } from "@/lib/seo/descriptions";

export const metadata: Metadata = {
  title: "Contact Trading Signal Provider India",
  description: META_DESC_CONTACT,
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <ContactPageJsonLd />
      {children}
    </>
  );
}
