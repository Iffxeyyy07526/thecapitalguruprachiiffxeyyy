/* eslint-disable @next/next/no-before-interactive-script-outside-document --
   Crawler-facing JSON-LD: load before hydration; App Router has no pages/_document. */
import Script from "next/script";
import {
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/root-jsonld";

export function RootJsonLdScripts() {
  return (
    <>
      <Script
        id="jsonld-organization"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <Script
        id="jsonld-website"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />
      <Script
        id="jsonld-software-application"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
    </>
  );
}
