"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function Modal({
  isOpen,
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  className,
}: ModalProps) {
  const visible = open !== undefined ? open : isOpen;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (visible) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 animate-in fade-in duration-150 select-none font-sans">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full rounded-2xl bg-white shadow-2xl border border-zinc-200 z-10 overflow-hidden transform transition-all max-h-[90vh] flex flex-col",
          maxWidths[maxWidth],
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 sm:px-6 py-4 shrink-0">
          <div className="min-w-0 pr-2">
            {typeof title === "string" ? (
              <h3 className="text-base font-bold text-zinc-950 truncate">{title}</h3>
            ) : (
              title
            )}
            {description && (
              <p className="mt-0.5 text-xs text-zinc-500 leading-normal">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors shrink-0"
            title="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
