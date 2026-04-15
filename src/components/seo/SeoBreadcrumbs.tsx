"use client";

import Link from "next/link";
import { absoluteUrl } from "@/lib/seo/site";

export interface SeoBreadcrumbItem {
  readonly name: string;
  readonly href: string;
}

export interface SeoBreadcrumbsProps {
  readonly items: readonly SeoBreadcrumbItem[];
}

export function SeoBreadcrumbs({ items }: SeoBreadcrumbsProps) {
  const trail: SeoBreadcrumbItem[] = [
    { name: "Home", href: "/" },
    ...items,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-secondary sm:text-sm">
          {trail.map((item, idx) => (
            <li key={`${item.href}-${idx}`} className="flex items-center gap-2">
              {idx > 0 ? (
                <span className="text-outline-variant" aria-hidden>
                  /
                </span>
              ) : null}
              {idx === trail.length - 1 ? (
                <span className="font-medium text-on-surface">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-primary transition-colors hover:text-primary hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
