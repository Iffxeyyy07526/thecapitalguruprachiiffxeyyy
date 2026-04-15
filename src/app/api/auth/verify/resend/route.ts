import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const resendSchema = z.object({
  email: z.string().email("Valid email protocol required"),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(ip, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Rate limit exceeded. Protocol paused." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email } = resendSchema.parse(body);

    const supabase = createClient();
    
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error("Verification resend failure:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Verification protocol re-initialized." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal protocol failure" }, { status: 500 });
  }
}
