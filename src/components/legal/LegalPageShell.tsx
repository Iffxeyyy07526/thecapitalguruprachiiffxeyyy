import type { ReactNode } from "react";
import type { SeoBreadcrumbItem } from "@/components/seo/SeoBreadcrumbs";
import { SeoBreadcrumbs } from "@/components/seo/SeoBreadcrumbs";

/** Aligned with Stitch design system "Capital Guru Signals" (Precision Noir). */
const LAST_UPDATED_LABEL = "Last Updated: April 2026";

export function LegalPageShell({
  title,
  breadcrumbItems,
  children,
}: Readonly<{
  title: string;
  breadcrumbItems?: readonly SeoBreadcrumbItem[];
  children: ReactNode;
}>) {
  return (
    <main className="pt-24 pb-16">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
        <article className="legal-glass-card p-8 sm:p-10 md:p-12">
          {breadcrumbItems?.length ? <SeoBreadcrumbs items={breadcrumbItems} /> : null}
          <p className="mb-6 font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-outline-variant">
            {LAST_UPDATED_LABEL}
          </p>
          <h1 className="mb-10 font-display text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
            {title}
          </h1>
          <div className="legal-prose">{children}</div>
        </article>
      </div>
    </main>
  );
}
