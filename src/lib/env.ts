import { z } from "zod";

/**
 * Validated at app boot (`src/app/layout.tsx` → `validateEnv()`). Build/runtime
 * fails fast if any required key is missing or invalid.
 *
 * Required:
 * - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY
 * - NEXT_PUBLIC_RAZORPAY_KEY_ID (publishable id for client checkout; not a secret)
 * - RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
 * - RESEND_API_KEY, RESEND_FROM_EMAIL
 * - NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_TELEGRAM_SUPPORT, NEXT_PUBLIC_TELEGRAM_GROUP
 * - CRON_SECRET (≥32 random chars for cron routes)
 *
 * Optional (SEO): GOOGLE_SITE_VERIFICATION, YANDEX_SITE_VERIFICATION
 *
 * Optional (SRE alerts): PAYMENT_ALERT_TELEGRAM_BOT_TOKEN, PAYMENT_ALERT_TELEGRAM_CHAT_ID,
 * PAYMENT_ALERT_SLACK_WEBHOOK_URL — see src/lib/alerts/payment-critical-alert.ts
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "must be non-empty"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "must be non-empty"),

  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1, "must be non-empty"),
  RAZORPAY_KEY_SECRET: z.string().min(1, "must be non-empty"),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1, "must be non-empty"),

  RESEND_API_KEY: z.string().min(1, "must be non-empty"),
  RESEND_FROM_EMAIL: z.string().min(1, "must be non-empty"),

  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_TELEGRAM_SUPPORT: z.string().url(),
  NEXT_PUBLIC_TELEGRAM_GROUP: z.string().url(),

  CRON_SECRET: z
    .string()
    .min(32, "must be at least 32 characters (use a strong random secret)"),

  PAYMENT_ALERT_TELEGRAM_BOT_TOKEN: z.string().optional(),
  PAYMENT_ALERT_TELEGRAM_CHAT_ID: z.string().optional(),
  PAYMENT_ALERT_SLACK_WEBHOOK_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates required env at boot. Throws with a list of missing/invalid keys
 * so misconfiguration is obvious in logs and Vercel runtime.
 */
export const validateEnv = (): Env => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map(
      (issue) => `  - ${issue.path.join(".")}: ${issue.message}`
    );
    const msg = `Environment validation failed — fix .env / Vercel env vars:\n${lines.join("\n")}`;
    console.error(msg);
    throw new Error(msg);
  }
  return parsed.data;
};
