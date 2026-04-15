export type SubscriptionPlanRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration_months: number;
  features: unknown;
};

export type UserSubscriptionRow = {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  telegram_link: string | null;
  created_at: string;
  subscription_plans: SubscriptionPlanRow | null;
};

export type DashboardPaymentSummary = {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  razorpay_payment_id: string | null;
  plan_name: string;
};

export type BillingPaymentRow = DashboardPaymentSummary;
