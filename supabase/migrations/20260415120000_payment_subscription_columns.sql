-- Plan visibility + pricing helper + subscription payment references
ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS price_inr INTEGER;

-- Backfill whole rupees from existing base amount stored in paise (e.g. 249900 -> 2499 INR)
UPDATE subscription_plans
SET price_inr = ROUND(price::numeric / 100)::integer
WHERE price_inr IS NULL;

ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);
