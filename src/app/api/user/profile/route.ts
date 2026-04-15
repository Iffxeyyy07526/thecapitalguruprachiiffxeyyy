import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { z } from 'zod';

const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  phone: z.string().regex(/^\d{10}$/, 'Must be a valid 10-digit phone number').optional().or(z.literal('')),
});

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(ip, 20, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const supabase = createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(ip, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const supabase = createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: validatedData.full_name,
        phone: validatedData.phone || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Profile update protocol error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
