import "server-only";

import { ASSETS } from "@/lib/assets/paths";
import {
  SOCIAL_INSTAGRAM_HANDLE,
  SOCIAL_INSTAGRAM_URL,
  SOCIAL_TELEGRAM_HANDLE,
  SOCIAL_TELEGRAM_URL,
} from "@/lib/social";

/** Precision Noir — elite fintech email tokens */
const COLORS = {
  bg: "#0b0b0b",
  card: "#141414",
  border: "rgba(93,214,44,0.18)",
  accent: "#5DD62C",
  text: "#e2e2e2",
  secondary: "#888888",
} as const;

export type EmailBannerType = "success" | "warning" | "danger" | "neutral";

export interface GenerateEmailTemplateParams {
  readonly title: string;
  readonly subtitle?: string;
  readonly banner?: { readonly type: EmailBannerType; readonly text: string };
  /** Trusted HTML fragment (build from server-side strings only). */
  readonly content: string;
  readonly ctaText?: string;
  readonly ctaLink?: string;
  readonly data?: Readonly<Record<string, string>>;
  /** Plain text only (escaped in the layout). */
  readonly footerNote?: string;
}

/** Detects leftover `{{var}}` placeholders (e.g. file-based templates) after substitution. */
export function warnIfUnfilledMustache(html: string, context: string): void {
  const re = /\{\{([^}]+)\}\}/g;
  const found: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    found.push(m[1].trim());
  }
  if (found.length && process.env.NODE_ENV !== "production") {
    const unique = Array.from(new Set(found));
    console.warn(
      `[email] Unfilled template variables in ${context}:`,
      unique.join(", ")
    );
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function bannerSkin(type: EmailBannerType): {
  bg: string;
  border: string;
  color: string;
} {
  switch (type) {
    case "success":
      return {
        bg: "rgba(93,214,44,0.12)",
        border: "#5DD62C",
        color: "#5DD62C",
      };
    case "warning":
      return {
        bg: "rgba(245,158,11,0.12)",
        border: "#f59e0b",
        color: "#fbbf24",
      };
    case "danger":
      return {
        bg: "rgba(239,68,68,0.12)",
        border: "#ef4444",
        color: "#fca5a5",
      };
    case "neutral":
    default:
      return {
        bg: "rgba(136,136,136,0.12)",
        border: "rgba(136,136,136,0.45)",
        color: "#a3a3a3",
      };
  }
}

function renderDataPanel(data: Readonly<Record<string, string>>): string {
  const rows = Object.entries(data)
    .map(
      ([key, value]) => `
    <tr>
      <td style="padding:10px 12px;font-family:Inter,system-ui,sans-serif;font-size:13px;color:${COLORS.secondary};border-bottom:1px solid rgba(255,255,255,0.06);width:38%;vertical-align:top;">
        ${escapeHtml(key)}
      </td>
      <td style="padding:10px 12px;font-family:Inter,system-ui,sans-serif;font-size:13px;color:${COLORS.text};font-weight:600;border-bottom:1px solid rgba(255,255,255,0.06);vertical-align:top;">
        ${escapeHtml(value == null ? "" : String(value))}
      </td>
    </tr>`
    )
    .join("");

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid ${COLORS.border};background:rgba(0,0,0,0.25);">
    <tbody>${rows}</tbody>
  </table>`;
}

/**
 * Master luxury email layout — single source of truth for transactional sends.
 */
export function generateEmailTemplate({
  title,
  subtitle,
  banner,
  content,
  ctaText,
  ctaLink,
  data,
  footerNote,
}: GenerateEmailTemplateParams): string {
  const divider = `
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 24px;">
    <tr>
      <td style="height:2px;background:linear-gradient(90deg,transparent,#5DD62C,transparent);border-radius:2px;font-size:0;line-height:0;">&nbsp;</td>
    </tr>
  </table>`;

  const bannerBlock = banner
    ? (() => {
        const s = bannerSkin(banner.type);
        return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-collapse:collapse;">
    <tr>
      <td style="padding:14px 18px;border-radius:12px;border:1px solid ${s.border};background:${s.bg};font-family:Inter,system-ui,sans-serif;font-size:13px;font-weight:600;color:${s.color};text-align:center;letter-spacing:0.02em;">
        ${escapeHtml(banner.text)}
      </td>
    </tr>
  </table>`;
      })()
    : "";

  const subtitleBlock = subtitle
    ? `<p style="margin:0 0 20px;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:${COLORS.secondary};">${escapeHtml(subtitle)}</p>`
    : "";

  const ctaBlock =
    ctaText && ctaLink
      ? `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0;">
    <tr>
      <td align="center" style="padding:0;">
        <a href="${escapeHtml(ctaLink)}" target="_blank" rel="noopener noreferrer"
 style="display:inline-block;padding:14px 36px;background:${COLORS.accent};color:#0b0b0b;font-family:Manrope,Inter,system-ui,sans-serif;font-size:14px;font-weight:700;text-decoration:none;border-radius:9999px;box-shadow:0 0 28px rgba(93,214,44,0.35);letter-spacing:0.03em;">
          ${escapeHtml(ctaText)}
        </a>
      </td>
    </tr>
  </table>`
      : "";

  const dataBlock = data && Object.keys(data).length > 0 ? renderDataPanel(data) : "";

  const footerNoteBlock = footerNote
    ? `<p style="margin:24px 0 0;font-family:Inter,system-ui,sans-serif;font-size:12px;line-height:1.5;color:${COLORS.secondary};">${escapeHtml(footerNote)}</p>`
    : "";

  const appDomain = process.env.NEXT_PUBLIC_APP_URL || "https://thecapitalguru.net";
  const logoUrl = `${appDomain.replace(/\/$/, "")}${ASSETS.logos.monoWhite}`;

  const socialFollowBlock = `
 <p style="margin:16px 0 0;font-family:Inter,system-ui,sans-serif;font-size:11px;line-height:1.65;color:${COLORS.secondary};text-align:center;">
                <span style="display:block;margin-bottom:6px;font-weight:600;color:${COLORS.text};letter-spacing:0.06em;text-transform:uppercase;font-size:10px;">Follow us</span>
                <a href="${escapeHtml(SOCIAL_INSTAGRAM_URL)}" target="_blank" rel="noopener noreferrer" style="color:${COLORS.accent};text-decoration:none;">Instagram: ${escapeHtml(SOCIAL_INSTAGRAM_HANDLE)}</a>
                <span style="color:#444;"> &nbsp;·&nbsp; </span>
                <a href="${escapeHtml(SOCIAL_TELEGRAM_URL)}" target="_blank" rel="noopener noreferrer" style="color:${COLORS.accent};text-decoration:none;">Telegram: ${escapeHtml(SOCIAL_TELEGRAM_HANDLE)}</a>
              </p>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 28px 28px;">
              <div style="margin:0;text-align:center;">
                <img src="${escapeHtml(logoUrl)}" width="260" height="42" alt="The Capital Guru" style="display:inline-block;max-width:260px;height:auto;border:0;outline:none;text-decoration:none;" />
              </div>
              <p style="margin:8px 0 0;font-family:Inter,system-ui,sans-serif;font-size:12px;color:${COLORS.secondary};text-align:center;letter-spacing:0.12em;text-transform:uppercase;">
                Precision. Discipline. Edge.
              </p>
              ${divider}
              ${bannerBlock}
              <h1 style="margin:0 0 12px;font-family:'Space Grotesk',Manrope,Inter,system-ui,sans-serif;font-size:22px;font-weight:700;line-height:1.25;color:${COLORS.text};letter-spacing:-0.02em;">
                ${escapeHtml(title)}
              </h1>
              ${subtitleBlock}
              <div style="font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.65;color:${COLORS.text};">
                ${content}
              </div>
              ${ctaBlock}
              ${dataBlock}
              ${footerNoteBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 28px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.2);">
              <p style="margin:0;font-family:Inter,system-ui,sans-serif;font-size:10px;line-height:1.6;color:${COLORS.secondary};text-align:center;">
                The Capital Guru is not SEBI-registered. All signals are for educational purposes only. Trade at your own risk.
              </p>
              <p style="margin:12px 0 0;font-family:Inter,system-ui,sans-serif;font-size:11px;color:${COLORS.secondary};text-align:center;">
                <a href="${escapeHtml(appDomain)}" style="color:${COLORS.accent};text-decoration:none;">${escapeHtml(appDomain.replace(/^https?:\/\//, ""))}</a>
              </p>
              ${socialFollowBlock}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  warnIfUnfilledMustache(html, `generateEmailTemplate:${title.slice(0, 40)}`);
  return html;
}

/**
 * @example
 * generateEmailTemplate({
 *   title: "Your access is now active.",
 *   subtitle: "Private signals channel",
 *   banner: { type: "success", text: "Payment confirmed" },
 *   content: `<p style="margin:0;">You now have entry into our private signals channel.</p>`,
 *   ctaText: "Join Telegram",
 *   ctaLink: "https://t.me/...",
 *   data: { Plan: "Elite", Start: "12 Mar 2026", End: "12 Apr 2026", Amount: "\u20B92,999" },
 * });
 */
