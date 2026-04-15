export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center items-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-[1.5] animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full border-2 border-primary/40 scale-[1.2] animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center shadow-glow-green-sm">
          <div className="flex items-end gap-[3px]">
            <div className="w-[4px] h-[12px] bg-outline-variant rounded-[1px] animate-candlestick" />
            <div className="w-[4px] h-[20px] bg-primary rounded-[1px] animate-candlestick" style={{ animationDelay: '0.2s' }} />
            <div className="w-[4px] h-[16px] bg-primary rounded-[1px] animate-candlestick" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
      <p className="mt-8 font-label text-sm text-secondary tracking-widest uppercase animate-pulse">Loading Platform</p>
    </div>
  );
}
