import "server-only";

import { Resend } from "resend";
import {
  escapeHtml,
  generateEmailTemplate,
} from "@/lib/email/template";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://thecapitalguru.net";

function extractFromAddress(from: string): string {
  const m = from.match(/<([^>]+)>/);
  return (m ? m[1] : from).trim();
}

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  const rawFrom =
    process.env.RESEND_FROM_EMAIL || "mahir@thecapitalguru.net";
  const addr = extractFromAddress(rawFrom).toLowerCase();
  const domain = (
    process.env.RESEND_ALLOWED_SENDING_DOMAIN || "thecapitalguru.net"
  ).toLowerCase();
  if (!addr.endsWith(`@${domain}`)) {
    throw new Error(
      `RESEND_FROM_EMAIL must use an address @${domain} verified in Resend. Got: ${addr}`
    );
  }

  return new Resend(key);
}

async function safeSend({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const resend = getResend();
    const rawFrom =
      process.env.RESEND_FROM_EMAIL || "mahir@thecapitalguru.net";
    const cleanFrom = rawFrom.includes("<")
      ? rawFrom
      : `The Capital Guru <${rawFrom}>`;

    const result = await resend.emails.send({
      from: cleanFrom,
      to,
      subject,
      html,
    });

    if (result.error) {
      throw new Error(`Resend API Error: ${result.error.message}`);
    }

    return { success: true as const, data: result.data };
  } catch (error) {
    console.error(
      JSON.stringify({
        scope: "payments",
        subsystem: "email",
        level: "error",
        event: "external_dependency_resend_failed",
        dependency: "resend_api",
        operation: "emails.send",
        to,
        subjectPreview: subject.slice(0, 120),
        error: error instanceof Error ? error.message : String(error),
      })
    );
    return { success: false as const, error };
  }
}

/**
 * Telegram access after successful payment.
 * @example await sendTelegramAccessEmail({ email, first_name: "Asha", plan_name: "Elite", ... })
 */
export async function sendTelegramAccessEmail({
  email,
  first_name,
  plan_name,
  start_date,
  end_date,
  amount,
  telegram_link,
}: {
  email: string;
  first_name: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  amount: string;
  telegram_link: string;
}) {
  const html = generateEmailTemplate({
    title: "Your access is now active.",
    subtitle: `Hi ${first_name} —`,
    banner: { type: "success", text: "Payment confirmed · Telegram access ready" },
    content: `
      <p style="margin:0 0 12px;">You now have entry into our private signals channel.</p>
      <p style="margin:0;color:${"#888888"};">Use the button below. One channel. One standard.</p>
    `,
    ctaText: "Join Telegram",
    ctaLink: telegram_link,
    data: {
      Plan: plan_name,
      Start: start_date,
      End: end_date,
      Amount: amount,
    },
    footerNote:
      "Didn't request this? Ignore this email or contact support.",
  });

  return safeSend({
    to: email,
    subject: "Access active — The Capital Guru",
    html,
  });
}

/**
 * Subscription expiring soon.
 * @example await sendExpiryReminderEmail({ ..., days: 7 })
 */
export async function sendExpiryReminderEmail({
  email,
  first_name,
  plan_name,
  end_date,
  days,
}: {
  email: string;
  first_name: string;
  plan_name: string;
  end_date: string;
  days: 7 | 1;
}) {
  const isUrgent = days === 1;
  const html = generateEmailTemplate({
    title: isUrgent ? "Your plan ends tomorrow." : "Renewal window: 7 days.",
    subtitle: `${first_name},`,
    banner: isUrgent
      ? { type: "danger", text: "Last chance — uninterrupted access" }
      : { type: "warning", text: `Subscription expires in ${days} days` },
    content: `
      <p style="margin:0 0 12px;">${escapeHtml(plan_name)} is active until <strong style="color:#e2e2e2;">${escapeHtml(end_date)}</strong>.</p>
      <p style="margin:0;color:#888888;">Renew to keep Telegram access and signals without a gap.</p>
    `,
    ctaText: "View plans",
    ctaLink: `${APP_URL}/pricing`,
    data: {
      Plan: plan_name,
      "End date": end_date,
    },
  });

  const subject = isUrgent
    ? "Ends tomorrow — The Capital Guru"
    : "7 days left on your plan";

  return safeSend({ to: email, subject, html });
}

/**
 * Subscription already expired.
 * @example await sendExpiredEmail({ email, first_name, plan_name, end_date })
 */
export async function sendExpiredEmail({
  email,
  first_name,
  plan_name,
  end_date,
}: {
  email: string;
  first_name: string;
  plan_name: string;
  end_date: string;
}) {
  const html = generateEmailTemplate({
    title: "Your plan has ended.",
    subtitle: `${first_name},`,
    banner: { type: "neutral", text: "Access paused" },
    content: `
      <p style="margin:0 0 12px;"><strong style="color:#e2e2e2;">${escapeHtml(plan_name)}</strong> closed on ${escapeHtml(end_date)}.</p>
      <p style="margin:0;color:#888888;">Rejoin when you’re ready. Same discipline. Same edge.</p>
    `,
    ctaText: "Renew membership",
    ctaLink: `${APP_URL}/pricing`,
    data: {
      Plan: plan_name,
      Ended: end_date,
    },
  });

  return safeSend({
    to: email,
    subject: "Plan ended — The Capital Guru",
    html,
  });
}

/**
 * Password reset (no data panel — clean layout).
 * @example await sendPasswordResetEmail({ email, first_name, reset_link: "https://..." })
 */
export async function sendPasswordResetEmail({
  email,
  first_name,
  reset_link,
}: {
  email: string;
  first_name: string;
  reset_link: string;
}) {
  const html = generateEmailTemplate({
    title: "Reset your password.",
    subtitle: `${first_name},`,
    content: `
      <p style="margin:0 0 12px;">We received a request to reset your Capital Guru password.</p>
      <p style="margin:0;color:#888888;">Link expires shortly. If this wasn’t you, delete this email.</p>
    `,
    ctaText: "Set new password",
    ctaLink: reset_link,
  });

  return safeSend({
    to: email,
    subject: "Password reset — The Capital Guru",
    html,
  });
}

/**
 * Post-signup welcome.
 * @example await sendWelcomeEmail({ email, first_name: "Rahul" })
 */
export async function sendWelcomeEmail({
  email,
  first_name,
}: {
  email: string;
  first_name: string;
}) {
  const html = generateEmailTemplate({
    title: "You’re in.",
    subtitle: `${first_name},`,
    banner: { type: "success", text: "Account live" },
    content: `
      <p style="margin:0 0 12px;">Welcome to The Capital Guru.</p>
      <p style="margin:0;color:#888888;">Next: choose a plan, complete payment, and enter the Telegram signals desk.</p>
    `,
    ctaText: "View plans",
    ctaLink: `${APP_URL}/pricing`,
  });

  return safeSend({
    to: email,
    subject: "Welcome — The Capital Guru",
    html,
  });
}

/**
 * Email confirmation (magic link / verify signup).
 * @example await sendEmailConfirmationEmail({ email, first_name, confirm_link: `${APP_URL}/api/auth/callback?...` })
 */
export async function sendEmailConfirmationEmail({
  email,
  first_name,
  confirm_link,
}: {
  email: string;
  first_name: string;
  confirm_link: string;
}) {
  const html = generateEmailTemplate({
    title: "Confirm your email.",
    subtitle: `${first_name},`,
    banner: { type: "neutral", text: "One step left" },
    content: `
      <p style="margin:0 0 12px;">Verify this address to activate your account.</p>
      <p style="margin:0;color:#888888;">Single use. No attachments.</p>
    `,
    ctaText: "Confirm email",
    ctaLink: confirm_link,
  });

  return safeSend({
    to: email,
    subject: "Confirm your email — The Capital Guru",
    html,
  });
}

/**
 * Internal support inbox (operator-facing).
 * @example await sendSupportEmail({ name, email, subject, message })
 */
export async function sendSupportEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const html = generateEmailTemplate({
    title: "Support request",
    subtitle: "Inbound",
    banner: { type: "neutral", text: "Operator channel" },
    content: `
      <p style="margin:0 0 8px;"><strong style="color:#e2e2e2;">From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p style="margin:0 0 16px;"><strong style="color:#e2e2e2;">Subject:</strong> ${escapeHtml(subject)}</p>
      <div style="padding:16px;border-radius:12px;border:1px solid rgba(75,226,119,0.15);background:rgba(0,0,0,0.25);white-space:pre-wrap;font-size:13px;color:#e2e2e2;">${escapeHtml(message)}</div>
    `,
  });

  return safeSend({
    to: "mahir@thecapitalguru.net",
    subject: `[Support] ${subject}`,
    html,
  });
}
