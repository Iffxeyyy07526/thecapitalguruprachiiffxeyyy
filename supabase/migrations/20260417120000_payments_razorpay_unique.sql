-- Prevent duplicate payment rows for the same Razorpay payment id (idempotency).
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id_unique
  ON payments (razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;
