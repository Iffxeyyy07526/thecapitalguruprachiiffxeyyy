import { SITE_URL } from "@/lib/seo/site";

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact The Capital Guru",
  url: `${SITE_URL.replace(/\/$/, "")}/contact`,
  description:
    "Contact India's NSE/BSE Telegram trading signal provider for support and sales.",
  mainEntity: {
    "@type": "Organization",
    name: "The Capital Guru",
    url: SITE_URL,
    email: "support@thecapitalguru.net",
  },
} as const;

export function ContactPageJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(contactPageJsonLd),
      }}
    />
  );
}
