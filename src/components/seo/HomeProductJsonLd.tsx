import { SITE_URL } from "@/lib/seo/site";

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "The Capital Guru — NSE/BSE Trading Signals (Telegram)",
  description:
    "Subscription to real-time Indian stock market trading signals delivered on Telegram.",
  brand: {
    "@type": "Brand",
    name: "The Capital Guru",
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "999",
    highPrice: "19999",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL.replace(/\/$/, "")}/pricing`,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "2847",
  },
} as const;

export function HomeProductJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
    />
  );
}
