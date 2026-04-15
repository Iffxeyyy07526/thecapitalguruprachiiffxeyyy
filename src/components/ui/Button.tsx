import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-[#0a0a0a] rounded-full shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_10px_32px_-6px_rgba(93,214,44,0.42),0_0_40px_-12px_rgba(93,214,44,0.22)] hover:shadow-[0_1px_0_rgba(255,255,255,0.28)_inset,0_18px_48px_-4px_rgba(93,214,44,0.55),0_0_56px_-8px_rgba(93,214,44,0.35)] hover:brightness-[1.04] hover:scale-[1.03] active:scale-[0.97] active:brightness-[0.98] will-change-transform motion-reduce:transition-none motion-reduce:hover:scale-100",
  secondary:
    "rounded-full border border-white/[0.12] bg-white/[0.03] text-on-surface shadow-depth-sm hover:scale-[1.01] hover:border-white/[0.18] hover:bg-white/[0.055] hover:shadow-depth active:scale-[0.98] will-change-transform",
  ghost:
    "rounded-full border border-white/[0.1] bg-transparent text-on-surface hover:scale-[1.01] hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white active:scale-[0.98] will-change-transform",
  danger:
    "bg-red-600 text-white rounded-full hover:bg-red-500 hover:scale-[1.01] active:scale-[0.97] active:bg-red-700 will-change-transform",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const buttonVariants = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) =>
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[transform,box-shadow,background-color,border-color,filter,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const showLoading = loading || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || showLoading}
        className={buttonVariants({ variant, size, fullWidth, className })}
        {...props}
      >
        {showLoading ? (
          <>
            <span className="sr-only">Loading</span>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
          </>
        ) : (
          <>
            {leftIcon ? <span className="inline-flex items-center">{leftIcon}</span> : null}
            {children}
            {rightIcon ? <span className="inline-flex items-center">{rightIcon}</span> : null}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
