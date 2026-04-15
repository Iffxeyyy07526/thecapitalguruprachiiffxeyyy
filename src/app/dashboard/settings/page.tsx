"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  settingsSchema,
  changePasswordSchema,
  type SettingsFormData,
  type ChangePasswordFormData,
} from "@/lib/validations";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { fullName: "", phone: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        resetProfile({
          fullName: data.profile?.full_name || "",
          phone: data.profile?.phone || "",
        });
      } catch (e) {
        console.error(e);
        toast.error("Could not load profile.");
      }
    }
    void fetchProfile();
  }, [user, resetProfile]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onBlur",
  });

  const onProfileSubmit = async (data: SettingsFormData) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.fullName,
          phone: data.phone || "",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update profile");
      }
      toast.success("Profile updated.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Update failed.";
      toast.error(message);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    const supabase = createClient();
    const email = user?.email;
    if (!email) {
      toast.error("Not signed in.");
      return;
    }

    const { error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password: data.currentPassword,
    });

    if (authErr) {
      toast.error("Current password is incorrect.");
      return;
    }

    const { error: updateErr } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (updateErr) {
      console.error("Password update error:", updateErr);
      toast.error(updateErr.message || "Could not update password.");
      return;
    }

    toast.success("Password updated.");
    resetPassword();
  };

  const confirmDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Could not delete account.");
      }
      toast.success("Account deleted.");
      setShowDeleteModal(false);
      await signOut();
      router.push("/");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Deletion failed.";
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-display text-2xl font-bold text-white">Settings</h1>

      <Card padding="lg" className="border-white/10">
        <h2 className="mb-6 font-display text-lg font-semibold text-white">
          Profile information
        </h2>
        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="space-y-4"
        >
          <Input
            label="Full name"
            {...registerProfile("fullName")}
            error={profileErrors.fullName?.message}
            disabled={isProfileSubmitting}
            autoComplete="name"
          />
          <div>
            <Input
              label="Email"
              type="email"
              value={user?.email || ""}
              disabled
              readOnly
              className="cursor-not-allowed opacity-80"
            />
            <p className="mt-1.5 text-xs text-secondary">
              Email cannot be changed here.
            </p>
          </div>
          <Input
            label="Phone"
            {...registerProfile("phone")}
            disabled={isProfileSubmitting}
            placeholder="10-digit mobile"
            autoComplete="tel"
          />
          <Button type="submit" disabled={isProfileSubmitting} loading={isProfileSubmitting}>
            Save profile
          </Button>
        </form>
      </Card>

      <Card padding="lg" className="border-white/10">
        <h2 className="mb-6 font-display text-lg font-semibold text-white">
          Change password
        </h2>
        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            {...registerPassword("currentPassword")}
            error={passwordErrors.currentPassword?.message}
            disabled={isPasswordSubmitting}
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            {...registerPassword("newPassword")}
            error={passwordErrors.newPassword?.message}
            disabled={isPasswordSubmitting}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            {...registerPassword("confirmNewPassword")}
            error={passwordErrors.confirmNewPassword?.message}
            disabled={isPasswordSubmitting}
          />
          <Button
            type="submit"
            disabled={isPasswordSubmitting}
            loading={isPasswordSubmitting}
          >
            Update password
          </Button>
        </form>
      </Card>

      <Card padding="lg" className="border border-red-500/25 bg-red-500/[0.03]">
        <h2 className="mb-2 font-display text-lg font-semibold text-red-400">
          Danger zone
        </h2>
        <p className="mb-4 text-sm text-secondary">
          Permanently delete your account and associated access. This cannot be
          undone.
        </p>
        <Button
          type="button"
          variant="danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete account
        </Button>
      </Card>

      {showDeleteModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <Card padding="lg" className="max-w-md border-white/15 shadow-glow-md">
            <h3
              id="delete-account-title"
              className="mb-2 font-display text-lg font-bold text-white"
            >
              Delete account?
            </h3>
            <p className="mb-6 text-sm text-secondary">
              Your profile, subscriptions, and session will be removed. You will
              lose dashboard access immediately.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="danger"
                onClick={() => void confirmDeleteAccount()}
                loading={deleteLoading}
                disabled={deleteLoading}
              >
                Yes, delete
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
