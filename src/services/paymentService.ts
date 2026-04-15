import { createClient } from "@/lib/supabase/client";
import { PaymentRecord } from "@/types";

export const paymentService = {
  async getRecentPayments(userId: string, limit: number = 5): Promise<PaymentRecord[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch payments:", error);
      throw new Error(error.message);
    }

    return data || [];
  },

  async getAllPayments(userId: string): Promise<PaymentRecord[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
};
