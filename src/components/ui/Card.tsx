import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
  featured?: boolean;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      padding = "md",
      featured = false,
      interactive = false,
      children,
      ...props
    },
    ref
  ) => {
    const paddingClass =
      padding === "sm" ? "p-6" : padding === "lg" ? "p-8 sm:p-11" : "p-7 sm:p-8";

    return (
      <div
        ref={ref}
        className={cn(
          "glass-card rounded-xl",
          paddingClass,
          featured &&
            "border-primary/24 bg-white/[0.042] shadow-glow-primary ring-1 ring-white/[0.05]",
          interactive &&
            "group card-tilt-hover glass-card-hover-glow transition-[transform,box-shadow,border-color] duration-300 ease-out",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";
