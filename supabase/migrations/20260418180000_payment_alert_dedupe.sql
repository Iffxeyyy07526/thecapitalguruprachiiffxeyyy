-- Dedupe keys for critical payment SRE alerts (one notification per event+payment per window).
CREATE TABLE IF NOT EXISTS payment_alert_dedupe (
  dedupe_key TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_alert_dedupe_created_at
  ON payment_alert_dedupe (created_at);

COMMENT ON TABLE payment_alert_dedupe IS
  'Prevents duplicate Telegram/Slack alerts for the same payment incident within a time bucket.';
