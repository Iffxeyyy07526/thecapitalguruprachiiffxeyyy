import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Private member area for The Capital Guru: NSE/BSE signal access, Telegram links, and billing. Sign-in required; not indexed.",
  robots: { index: false, follow: false },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let firstName = user.email?.split("@")[0] ?? "Trader";
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  const parts = profile?.full_name?.trim().split(/\s+/).filter(Boolean);
  if (parts?.length) firstName = parts[0];

  return (
    <DashboardLayout firstName={firstName}>{children}</DashboardLayout>
  );
}
