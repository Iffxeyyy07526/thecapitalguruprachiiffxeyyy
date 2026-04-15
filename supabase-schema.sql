-- Supabase Database Schema for The Capital Guru
-- Run this in Supabase SQL Editor

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  duration_months INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  price_inr INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed plans
INSERT INTO subscription_plans (name, slug, price, original_price, duration_months, features, is_popular) VALUES
  ('Starter', 'starter', 249900, NULL, 1, '["Real-time NSE/BSE signals","Intraday calls","Entry, target & SL on every call","Telegram group access","Basic market commentary"]'::jsonb, false),
  ('Pro', 'pro', 1199900, 1499400, 6, '["Everything in Starter","Positional swing calls","Option chain signals","Risk-reward analysis","Priority support","Weekly market outlook"]'::jsonb, true),
  ('Elite', 'elite', 1999900, 2998800, 12, '["Everything in Pro","1-on-1 mentorship calls","Portfolio review sessions","Advanced options strategies","Early access to new features","Exclusive Elite community"]'::jsonb, false)
ON CONFLICT (slug) DO NOTHING;

UPDATE subscription_plans
SET price_inr = ROUND(price::numeric / 100)::integer
WHERE price_inr IS NULL;

-- User Subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  telegram_link TEXT,
  telegram_link_sent BOOLEAN DEFAULT FALSE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subscription Plans: anyone can read
CREATE POLICY "Anyone can view plans" ON subscription_plans FOR SELECT TO authenticated, anon USING (true);

-- User Subscriptions: users can view their own
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payments: users can view their own
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- Trading Signals (The "Signal Factory")
CREATE TABLE IF NOT EXISTS trading_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  symbol TEXT NOT NULL,
  entry_price DECIMAL NOT NULL,
  target_price DECIMAL NOT NULL,
  stop_loss DECIMAL NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  pnl_points DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Seed some demo signals
INSERT INTO trading_signals (type, symbol, entry_price, target_price, stop_loss, status, pnl_points) VALUES
  ('buy', 'NIFTY', 22450.50, 22600.00, 22350.00, 'closed', 149.50),
  ('sell', 'BANKNIFTY', 47800.00, 47400.00, 48100.00, 'active', NULL),
  ('buy', 'RELIANCE', 2950.00, 3100.00, 2880.00, 'active', NULL);

-- RLS for signals
ALTER TABLE trading_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active signals" ON trading_signals FOR SELECT TO authenticated USING (true);

-- System Notifications / Operational Logs
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Service role bypasses RLS when using the service_role JWT (server-side admin client).

-- Additional policies (see supabase/migrations/20260416120000_rls_reminders.sql):
-- - profiles: INSERT for authenticated where auth.uid() = id
-- - subscription_plans: SELECT for anon/authenticated only when is_active = true
-- - user_subscriptions: reminder_7d_sent_at, reminder_1d_sent_at for cron idempotency
-- - partial UNIQUE index on razorpay_payment_id (non-null)
