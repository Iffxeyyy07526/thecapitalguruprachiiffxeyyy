import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

const base = SITE_URL.replace(/\/$/, "");

/** Paths crawlers should not index (auth, app, APIs, tooling). */
const DISALLOW = [
  "/dashboard/",
  "/api/",
  "/payment/",
  "/private/",
  "/admin/",
  "/debug/",
  "/forgot-password/",
  "/reset-password/",
  "/unverified/",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...DISALLOW],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [...DISALLOW],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: [...DISALLOW],
      },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
