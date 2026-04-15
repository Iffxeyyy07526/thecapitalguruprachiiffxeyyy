import { absoluteUrl } from "@/lib/seo/site";

/**
 * Brand assets in `/public`.
 * - `logo-main.png`: transparent horizontal wordmark (UI + email).
 * - `logo-icon.jpg`: square mark for symbol/watermark (UI only).
 * - `logo-mark.jpg`: square mark on black (favicon / PWA / apple-touch only).
 */
export const ASSETS = {
  logos: {
    /** Full horizontal wordmark (transparent). */
    main: "/logo-main.png",
    /** Square symbol (UI / watermark). */
    icon: "/logo-icon.jpg",
    /** Square mark (solid black background) — favicon & touch icons only. */
    mark: "/logo-mark.jpg",
    // Aliases for existing call sites
    horizontal: "/logo-main.png",
    horizontalBlack: "/logo-main.png",
    horizontalWhite: "/logo-main.png",
    symbol: "/logo-icon.jpg",
    favicon: "/favicon.ico",
    favicon16: "/favicon-16x16.png",
    favicon32: "/favicon-32x32.png",
    appleTouch: "/apple-touch-icon.png",
    appIcon: "/android-chrome-512x512.png",
    android192: "/android-chrome-192x192.png",
    android512: "/android-chrome-512x512.png",
    watermark: "/logo-icon.jpg",
    pill: "/logo-main.png",
    stacked: "/logo-main.png",
    monoBlack: "/logo-main.png",
    monoWhite: "/logo-main.png",
  },
  images: {
    hero: "/images/capital-guru-hero.png",
    heroFallbackPng: "/images/hero-fallback.png",
    heroFallbackSvg: "/images/hero-fallback.svg",
  },
} as const;

/**
 * Absolute URLs for logos (uses `NEXT_PUBLIC_APP_URL`, default https://thecapitalguru.net).
 * Use these in emails, OG tags, partner pages, or anywhere you need a shareable link.
 */
export const HOSTED_LOGOS = {
  wordmarkTransparent: absoluteUrl(ASSETS.logos.main),
  symbol: absoluteUrl(ASSETS.logos.icon),
  /** Black-tile mark — brand mark file. */
  markOnBlack: absoluteUrl(ASSETS.logos.mark),
  faviconIco: absoluteUrl(ASSETS.logos.favicon),
} as const;

export const IMAGES_DIR_FILES = [
  "capital-guru-hero.png",
  "hero-fallback.png",
  "hero-fallback.svg",
] as const;

/** Brand logos at `/public` root (for debug page). */
export const BRAND_LOGO_FILES = [
  "logo-main.png",
  "logo-icon.jpg",
  "logo-mark.jpg",
] as const;
