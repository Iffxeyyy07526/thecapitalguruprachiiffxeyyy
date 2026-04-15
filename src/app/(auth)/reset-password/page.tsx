"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

const resetSchema = z.object({
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[0-9]/, "Must include a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;
type Alert = { type: "error" | "success"; message: string };

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
        Strength:{" "}
        <span className="font-semibold">
          {strength === "strong"
            ? "Strong password"
            : strength === "medium"
              ? "Medium password"
              : "Weak password"}
        </span>
      </span>
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isRecoveryValid, setIsRecoveryValid] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      setIsRecoveryValid(false);
      return;
    }

    setIsRecoveryValid(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });
  const passwordValue = watch("password", "");

  const onSubmit = async (data: ResetForm) => {
    setAlert(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setAlert({ type: "error", message: error.message });
        return;
      }

      setAlert({ type: "success", message: "Password updated! Redirecting..." });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setAlert({ type: "error", message: error.message });
      } else {
        setAlert({
          type: "error",
          message: "Unable to update password right now.",
        });
      }
    }
  };

  if (!isRecoveryValid) {
    return (
      <div className="text-center">
        <h1 className="mb-3 font-display text-2xl font-bold text-white">Link Expired</h1>
        <p className="mb-6 text-sm text-secondary">
          Invalid or expired reset link. Please request a new one.
        </p>
        <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-white">Set New Password</h1>
      <p className="mb-6 text-sm text-secondary">
        Choose a strong password to secure your account.
      </p>

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
          {alert.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
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
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
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

        <Button type="submit" className="mt-2 w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Updating...
            </span>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
