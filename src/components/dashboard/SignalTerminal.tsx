"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { signalService } from "@/services/signalService";
import { TradingSignal } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export function SignalTerminal() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSignals() {
      try {
        const data = await signalService.getActiveSignals();
        setSignals(data || []);
      } catch (error) {
        console.error("Signal Terminal Uplink Failure:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSignals();
  }, []);

  if (loading) {
    return <Skeleton className="h-[500px] w-full rounded-lg" />;
  }

  return (
    <Card className="p-6 sm:p-8 bg-black/[0.02] border-white/[0.05] overflow-hidden relative rounded-lg">
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden
      >
        <Image
          src="/logo-watermark.png"
          alt=""
          width={420}
          height={420}
          className="max-h-[min(70%,380px)] w-auto opacity-100"
        />
      </div>
      <div className="relative z-[1] flex items-center justify-between mb-10">
        <div>
          <h3 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-primary shadow-glow-primary-sm animate-pulse" />
            Live Trading Signals
          </h3>
          <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-[0.3em] mt-2 font-mono">
            Direct NSE Market Feed // Real-Time Data
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-lg">
           <div className="flex flex-col">
              <span className="text-[8px] font-bold text-on-surface-muted uppercase tracking-widest leading-none mb-1">Feed Status</span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest leading-none">Active</span>
           </div>
        </div>
      </div>

      <div className="relative z-[1] space-y-4">
        {signals.length > 0 ? (
          signals.map((signal) => (
            <div key={signal.id} className="group relative p-6 bg-white/[0.01] border border-white/[0.03] hover:border-primary/20 transition-all rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={signal.type === 'buy' ? 'success' : 'danger'} className="rounded-sm px-2 font-mono text-[10px]">
                      {signal.type.toUpperCase()}
                    </Badge>
                    <span className="text-lg font-display font-bold text-white tracking-tight">{signal.symbol}</span>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-on-surface-muted uppercase tracking-widest mb-1">Entry Price</span>
                        <span className="text-sm font-bold text-white font-mono">₹{signal.entry_price}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-on-surface-muted uppercase tracking-widest mb-1">Target</span>
                        <span className="text-sm font-bold text-primary font-mono">₹{signal.target_price}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-on-surface-muted uppercase tracking-widest mb-1">Stop Loss</span>
                        <span className="text-sm font-bold text-danger font-mono">₹{signal.stop_loss}</span>
                     </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-widest">
                    Verified Signal
                  </p>
                  <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-widest">
                    {new Date(signal.created_at).toLocaleTimeString()} IST
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center border border-dashed border-white/[0.05] rounded-lg">
            <span className="text-[10px] font-bold text-on-surface-muted uppercase tracking-[0.2em]">Searching for active signals...</span>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute top-0 right-0 z-[1] h-64 w-64 bg-primary/[0.02] blur-[100px]" />
    </Card>
  );
}
