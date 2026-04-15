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
    favicon: "/logo-mark.jpg",
    appleTouch: "/logo-mark.jpg",
    appIcon: "/logo-mark.jpg",
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
