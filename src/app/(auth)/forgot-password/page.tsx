"use client";

import { useState } from "react";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${appUrl}/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setIsSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Unable to send reset link right now.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant/70 bg-white/[0.03] p-7 backdrop-blur-md sm:p-8">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>

        {isSuccess ? (
          <div className="space-y-4 text-center">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              Reset link sent! Check your inbox.
            </div>
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Reset Password</h1>
            <p className="mt-2 text-sm text-secondary">
              Enter your email and we&apos;ll send a reset link.
            </p>

            {errorMessage ? (
              <div
                className={cn(
                  "mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                )}
                role="alert"
              >
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email?.message}
                disabled={isSubmitting}
              />

              <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
