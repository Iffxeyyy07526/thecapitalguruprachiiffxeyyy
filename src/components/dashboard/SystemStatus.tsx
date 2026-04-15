'use client';

import { useEffect, useState } from "react";

export function SystemStatus() {
  const [latency, setLatency] = useState(14);
  const [uptime, setUptime] = useState(99.98);

  useEffect(() => {
    const interval = setInterval(() => {
        setLatency(Math.floor(Math.random() * (18 - 12 + 1) + 12));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-md backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow-primary animate-pulse" />
        <span className="text-[9px] font-bold text-on-surface uppercase tracking-[0.2em] font-mono">Core: Nominal</span>
      </div>
      
      <div className="hidden sm:flex items-center gap-4">
        <div className="w-px h-3 bg-white/[0.1]" />
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold text-on-surface-muted uppercase tracking-widest font-mono">Latency</span>
          <span className="text-[10px] font-bold text-white font-mono">{latency}ms</span>
        </div>
        <div className="w-px h-3 bg-white/[0.1]" />
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold text-on-surface-muted uppercase tracking-widest font-mono">Uptime</span>
          <span className="text-[10px] font-bold text-white font-mono">{uptime}%</span>
        </div>
      </div>
    </div>
  );
}
