/**
 * Brand assets: three PNGs in `/public` (provided art).
 * Paths are root-absolute (Vercel/Linux case-sensitive).
 */
export const ASSETS = {
  logos: {
    /** Full horizontal wordmark (transparent). */
    main: "/logo-main.png",
    /** Square symbol (transparent). */
    icon: "/logo-icon.png",
    /** Square mark (solid/black background). */
    mark: "/logo-mark.png",
    // Aliases for existing call sites
    horizontal: "/logo-main.png",
    horizontalBlack: "/logo-main.png",
    horizontalWhite: "/logo-main.png",
    symbol: "/logo-icon.png",
    favicon: "/logo-mark.png",
    appleTouch: "/logo-mark.png",
    appIcon: "/logo-mark.png",
    watermark: "/logo-icon.png",
    pill: "/logo-main.png",
    stacked: "/logo-icon.png",
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
  "logo-icon.png",
  "logo-mark.png",
] as const;
