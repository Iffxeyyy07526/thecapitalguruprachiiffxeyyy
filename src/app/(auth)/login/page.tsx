"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { SOCIAL_TELEGRAM_URL } from "@/lib/social";
import { safeAppPath } from "@/lib/security/safe-redirect";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[0-9]/, "Must include a number"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type LoginAlertType = "error" | "warning";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: LoginAlertType; message: string } | null>(
    null
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAfterLogin = safeAppPath(searchParams.get("next"), "/dashboard");

  useEffect(() => {
    if (searchParams.get("error") === "verification_failed") {
      setAlert({
        type: "error",
        message:
          "Email verification failed or the link expired. Try signing in, or request a new confirmation email.",
      });
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setAlert(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        const message = error.message.toLowerCase();
        if (
          message.includes("invalid login credentials") ||
          message.includes("invalid credentials")
        ) {
          setAlert({ type: "error", message: "Invalid email or password" });
          return;
        }
        if (
          message.includes("email not confirmed") ||
          message.includes("not confirmed")
        ) {
          setAlert({
            type: "warning",
            message: "Please verify your email. Check your inbox.",
          });
          return;
        }
        setAlert({ type: "error", message: error.message });
        return;
      }

      router.push(nextAfterLogin);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setAlert({ type: "error", message: error.message });
      } else {
        setAlert({
          type: "error",
          message: "Unable to login right now. Please try again.",
        });
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-secondary">
          Login to continue to your trading dashboard.
        </p>
      </div>

      {alert ? (
        <div
          className={cn(
            "mb-5 rounded-xl border px-4 py-3 text-sm",
            alert.type === "warning"
              ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          )}
          role="alert"
        >
          {alert.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
          disabled={isSubmitting}
        />

        <div>
          <Input
            label="Password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={errors.password?.message}
            disabled={isSubmitting}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold text-secondary transition-colors hover:text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            }
          />
          <Link
            href="/forgot-password"
            className="mt-2 inline-block w-full text-right text-sm font-medium text-primary transition-colors hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={isSubmitting}
          className="mt-2"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Logging in...
            </span>
          ) : (
            "Login to Dashboard →"
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-outline-variant/80" />
        <span className="text-xs text-secondary">or</span>
        <div className="h-px flex-1 bg-outline-variant/80" />
      </div>

      <p className="text-center text-sm text-secondary">
        New here?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create your free account →
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-secondary">
        <a
          href={SOCIAL_TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary transition-colors hover:text-primary hover:underline"
        >
          Join our Telegram for updates →
        </a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout breadcrumbItems={[{ name: "Login", href: "/login" }]}>
      <Suspense
        fallback={
          <div className="animate-pulse rounded-xl bg-surface-container/50 p-12" />
        }
      >
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
