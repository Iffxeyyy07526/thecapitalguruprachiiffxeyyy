"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { twMerge } from "tailwind-merge";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    variant?: "primary" | "danger";
  };
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  primaryAction,
  className,
}: ModalProps) => {
  const titleId = useId();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className={twMerge("modal-card animate-slide-up", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-outline-variant transition-colors hover:text-white"
          aria-label="Close modal"
        >
          <span aria-hidden>×</span>
        </button>

        <h3 id={titleId} className="mb-2 font-display text-xl font-bold text-white">
          {title}
        </h3>
        {description ? <p className="mb-6 text-sm text-secondary">{description}</p> : null}

        {children ? <div className="mb-6">{children}</div> : null}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {primaryAction ? (
            <Button
              variant={primaryAction.variant || "primary"}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              isLoading={primaryAction.isLoading}
            >
              {primaryAction.label}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }
  return null;
};
