"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, rightIcon, id, ...props }, ref) => {
    const uid = useId();
    const inputId = id ?? uid;

    return (
      <div className="group w-full">
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-secondary transition-colors duration-200 group-focus-within:text-primary"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-secondary/70",
              "focus:border-primary/50 focus:bg-surface-container/80 focus:shadow-[0_0_0_3px_rgba(93,214,44,0.14),0_10px_32px_-10px_rgba(93,214,44,0.18)]",
              error &&
                "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
              rightIcon && "pr-12",
              className
            )}
            {...props}
          />
          {rightIcon ? (
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-secondary transition-colors duration-200 group-focus-within:text-primary">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-400">
            <span className="h-1 w-1 rounded-full bg-red-400" />
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
