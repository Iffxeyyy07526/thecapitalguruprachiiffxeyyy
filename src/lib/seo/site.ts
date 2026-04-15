/** Canonical marketing site origin (no trailing slash). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://thecapitalguru.net";

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, "")}${p}`;
}
