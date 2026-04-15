import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "neutral" | "primary";
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", dot = false, children, ...props }, ref) => {
    const variantClass =
      variant === "success"
        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30"
        : variant === "warning"
          ? "bg-yellow-500/15 text-yellow-300 border border-yellow-400/30"
          : variant === "danger"
            ? "bg-red-500/15 text-red-300 border border-red-400/30"
            : variant === "primary"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-zinc-500/15 text-zinc-300 border border-zinc-400/30";

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
          variantClass,
          className
        )}
        {...props}
      >
        {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" /> : null}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";
