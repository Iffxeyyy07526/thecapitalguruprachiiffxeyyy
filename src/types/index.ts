export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  updated_at: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration_months: number;
  features: string[];
  is_popular: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  telegram_link: string | null;
  telegram_link_sent: boolean;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  subscription_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  created_at: string;
}

export interface TradingSignal {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  status: 'active' | 'closed';
  pnl_points?: number;
  created_at: string;
  closed_at?: string;
}

export interface TradePerformance {
  total_trades: number;
  win_rate: number;
  total_pnl: number;
  max_drawdown: number;
}
