import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

const baseUrl = SITE_URL.replace(/\/$/, "");

type SitemapEntry = {
  path: string;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
  priority: number;
};

/** Public indexable routes only (no dashboard, auth recovery, or app shells). */
const PUBLIC_ROUTES: SitemapEntry[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/register", changeFrequency: "weekly", priority: 0.85 },
  { path: "/login", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.65 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.35 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.35 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.35 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.35 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? baseUrl : `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
