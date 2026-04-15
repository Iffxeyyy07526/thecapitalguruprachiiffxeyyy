import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();

  try {
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('duration_months', { ascending: true });

    if (error) throw error;

    const visible = (plans ?? []).filter(
      (p: { is_active?: boolean }) => p.is_active !== false
    );

    return NextResponse.json({ plans: visible });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching plans:", error);
    }
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
