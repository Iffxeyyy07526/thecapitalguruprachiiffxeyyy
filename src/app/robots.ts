import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

const DISALLOW = [
  "/dashboard/",
  "/api/",
  "/payment/",
  "/private/",
  "/admin/",
  "/forgot-password/",
  "/reset-password/",
  "/unverified/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
        crawlDelay: 10,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/payment/",
          "/private/",
          "/admin/",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
    host: SITE_URL.replace(/\/$/, ""),
  };
}
