-- Idempotent "access email" send: only one worker wins the claim per Razorpay payment.
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS telegram_access_email_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN payments.telegram_access_email_sent_at IS
  'First-claim timestamp for Telegram access email; cleared on Resend failure so a retry can reclaim.';
