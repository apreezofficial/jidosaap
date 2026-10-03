import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "ai";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-blue-50 text-[#2563eb] border-blue-200",
    secondary: "bg-zinc-100 text-zinc-800 border-zinc-200",
    outline: "text-zinc-950 border-zinc-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
    ai: "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-[#2563eb] border-blue-200 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb]",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
