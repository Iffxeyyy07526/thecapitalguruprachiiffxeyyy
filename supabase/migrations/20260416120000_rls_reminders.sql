-- Idempotency + cron reminder dedupe + RLS hardening
ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS reminder_7d_sent_at TIMESTAMPTZ;

ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS reminder_1d_sent_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_subscriptions_razorpay_payment_id_unique
  ON user_subscriptions (razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;

-- Profiles: allow authenticated users to insert their own row (e.g. if trigger not used).
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Subscription plans: public read only for active plans.
DROP POLICY IF EXISTS "Anyone can view plans" ON subscription_plans;
CREATE POLICY "Public can view active plans" ON subscription_plans
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Note: Supabase service_role key bypasses RLS for API routes using the admin client.
