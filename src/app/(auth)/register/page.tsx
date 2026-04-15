"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Min 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[A-Z]/, "Must include uppercase")
      .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((value) => value, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type Alert = {
  type: "error" | "success";
  message: string;
  showLoginLink?: boolean;
};

function PasswordStrength({ password }: Readonly<{ password: string }>) {
  if (!password) return null;

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const strength: "weak" | "medium" | "strong" =
    hasMinLength && hasUpper && hasNumber
      ? "strong"
      : hasMinLength
        ? "medium"
        : "weak";

  const label =
    strength === "strong" ? "Strong password" : strength === "medium" ? "Medium password" : "Weak password";
  const colorClass =
    strength === "strong"
      ? "bg-emerald-500 text-emerald-300"
      : strength === "medium"
        ? "bg-yellow-500 text-yellow-300"
        : "bg-red-500 text-red-300";

  const progressWidth =
    strength === "strong" ? "w-full" : strength === "medium" ? "w-2/3" : "w-1/3";

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full rounded-full bg-surface-container-high">
        <div className={cn("h-1.5 rounded-full transition-all duration-300", colorClass, progressWidth)} />
      </div>
      <span className="mt-1 block text-xs text-secondary">
        Strength: <span className="font-semibold">{label}</span>
      </span>
    </div>
  );
}

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeToTerms: false },
    mode: "onBlur",
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    setAlert(null);

    try {
      const supabase = createClient();
      const appBase =
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
        (typeof window !== "undefined" ? window.location.origin : "");
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            ...(data.phone?.trim() ? { phone: data.phone.trim() } : {}),
          },
          emailRedirectTo: appBase ? `${appBase}/api/auth/callback` : undefined,
        },
      });

      if (error) {
        const message = error.message.toLowerCase();
        if (
          message.includes("user already registered") ||
          message.includes("already been registered") ||
          message.includes("already exists")
        ) {
          setAlert({
            type: "error",
            message: "An account with this email already exists.",
            showLoginLink: true,
          });
          return;
        }
        setAlert({ type: "error", message: error.message });
        return;
      }

      if (data.phone?.trim() && signUpData.user?.id) {
        const { error: phoneError } = await supabase
          .from("profiles")
          .update({ phone: data.phone.trim() })
          .eq("id", signUpData.user.id);

        if (phoneError) {
          setAlert({
            type: "error",
            message: "Account created, but we could not save phone number.",
          });
          return;
        }
      }

      setAlert({
        type: "success",
        message: "Account created! Check your email to verify.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setAlert({ type: "error", message: error.message });
      } else {
        setAlert({
          type: "error",
          message: "Unable to register right now. Please try again.",
        });
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
        <p className="mt-2 text-sm text-secondary">
          Start receiving live trading signals in minutes.
        </p>
      </div>

      {alert ? (
        <div
          className={cn(
            "mb-5 rounded-xl border px-4 py-3 text-sm",
            alert.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          )}
          role="alert"
        >
          {alert.message}{" "}
          {alert.showLoginLink ? (
            <Link href="/login" className="font-semibold text-primary underline">
              Login →
            </Link>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Rahul Sharma"
          {...register("fullName")}
          error={errors.fullName?.message}
          disabled={isSubmitting}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
          disabled={isSubmitting}
        />

        <Input
          label="Phone Number (Optional)"
          type="tel"
          placeholder="+91 98765 43210"
          {...register("phone")}
          error={errors.phone?.message}
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
          <PasswordStrength password={passwordValue} />
        </div>

        <Input
          label="Confirm Password"
          placeholder="••••••••"
          type={showConfirmPassword ? "text" : "password"}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-xs font-semibold text-secondary transition-colors hover:text-primary"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          }
        />

        <div className="flex items-start gap-3 py-2">
          <input
            type="checkbox"
            {...register("agreeToTerms")}
            id="terms"
            className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 accent-primary cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs font-medium text-secondary leading-relaxed cursor-pointer">
            I agree to the{" "}
            <Link href="/terms-of-service" className="text-primary hover:underline" target="_blank">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-xs font-medium text-red-400">{errors.agreeToTerms.message}</p>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating account...
            </span>
          ) : (
            "Create My Account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Login →
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

export default function RegisterPage() {
  return (
    <AuthLayout breadcrumbItems={[{ name: "Register", href: "/register" }]}>
      <RegisterForm />
    </AuthLayout>
  );
}
