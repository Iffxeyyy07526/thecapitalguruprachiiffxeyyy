import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { z } from 'zod';
import { sendSupportEmail } from '@/lib/resend';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(ip, 3, 60 * 60 * 1000)) { // 3 req per hour per IP
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const result = await sendSupportEmail(validatedData);

    if (!result.success) {
      throw new Error('Failed to transmit support protocol');
    }

    return NextResponse.json({ success: true, message: 'Message transmitted to support nodes.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Contact protocol failure:', error);
    return NextResponse.json({ error: 'Internal system error' }, { status: 500 });
  }
}
