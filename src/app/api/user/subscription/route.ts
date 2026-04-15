import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(request: Request) {
  // Rate limit: 20 requests per 15 minutes mapped per IP
  const ip = getClientIp(request);
  if (!rateLimit(ip, 20, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const supabase = createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // not found error is ok
      throw error;
    }

    if (!subscription) {
      return NextResponse.json({ subscription: null, isActive: false, daysRemaining: 0, telegramLink: null });
    }

    const endDate = new Date(subscription.end_date).getTime();
    const now = Date.now();
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    const isActive = daysRemaining > 0 && subscription.status === 'active';

    return NextResponse.json({
      subscription: { ...subscription, plan: subscription.subscription_plans },
      isActive,
      daysRemaining,
      telegramLink: subscription.telegram_link,
    });
  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
