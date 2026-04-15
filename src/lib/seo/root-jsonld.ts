import { ASSETS } from "@/lib/assets/paths";
import { SITE_URL } from "@/lib/seo/site";
import { SOCIAL_INSTAGRAM_URL } from "@/lib/social";

/** Logo served from production CDN path (use PNG when available; SVG is valid for schema). */
export const SCHEMA_LOGO_URL = `${SITE_URL.replace(/\/$/, "")}${ASSETS.logos.symbol}`;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Capital Guru",
  url: SITE_URL,
  logo: SCHEMA_LOGO_URL,
  description:
    "India's top NSE/BSE stock market signal provider on Telegram",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@thecapitalguru.net",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [
    "https://t.me/thecapitalguru",
    SOCIAL_INSTAGRAM_URL,
    "https://twitter.com/thecapitalguru",
  ],
} as const;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Capital Guru",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL.replace(/\/$/, "")}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
} as const;

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "The Capital Guru Trading Signals",
  operatingSystem: "Web, Android, iOS",
  applicationCategory: "FinanceApplication",
  offers: {
    "@type": "Offer",
    price: "999",
    priceCurrency: "INR",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "2847",
  },
} as const;
