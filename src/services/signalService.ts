import { createClient } from "@/lib/supabase/client";
import { TradingSignal } from "@/types";

export const signalService = {
  async getActiveSignals(): Promise<TradingSignal[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("trading_signals")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch signals:", error);
      throw new Error(error.message);
    }

    return (data || []) as TradingSignal[];
  },

  async getSignalHistory(limit: number = 20): Promise<TradingSignal[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("trading_signals")
      .select("*")
      .eq("status", "closed")
      .order("closed_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch signal history:", error);
      throw new Error(error.message);
    }

    return (data || []) as TradingSignal[];
  }
};
