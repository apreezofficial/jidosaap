import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
}

export function JidoSappIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-label="JidoSapp Logo"
    >
      <defs>
        <linearGradient id="jido-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#00b4d8" />
        </linearGradient>
        <linearGradient id="jido-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>
      </defs>

      {/* Smooth Squircle Container */}
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#jido-bg-grad)" />

      {/* Subtle Inner Glass Ring */}
      <rect
        x="4.5"
        y="4.5"
        width="55"
        height="55"
        rx="15.5"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      {/* Ghost Chat Bubble Contour */}
      <path
        d="M20 28C20 22.4772 24.4772 18 30 18H34C39.5228 18 44 22.4772 44 28C44 33.5228 39.5228 38 34 38H24L18 44V28H20Z"
        fill="white"
        fillOpacity="0.2"
      />

      {/* Foreground Automation "J" Vector Stem */}
      <path
        d="M24 22C24 20.8954 24.8954 20 26 20H38C39.1046 20 40 20.8954 40 22C40 23.1046 39.1046 24 38 24H33V35C33 38.3137 30.3137 41 27 41C23.6863 41 21 38.3137 21 35C21 33.8954 21.8954 33 23 33C24.1046 33 25 33.8954 25 35C25 36.1046 25.8954 37 27 37C28.1046 37 29 36.1046 29 35V24H26C24.8954 24 24 23.1046 24 22Z"
        fill="url(#jido-spark-grad)"
      />

      {/* Synchronizer Orbit Node */}
      <circle cx="37" cy="33" r="4.5" fill="#38bdf8" stroke="white" strokeWidth="2" />
      <circle cx="37" cy="33" r="1.5" fill="white" />
    </svg>
  );
}

export function JidoSappLogo({
  className = "",
  iconOnly = false,
  size = "md",
  href,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: "w-5 h-5", text: "text-base", gap: "gap-2" },
    md: { icon: "w-7 h-7", text: "text-lg", gap: "gap-2.5" },
    lg: { icon: "w-9 h-9", text: "text-xl", gap: "gap-3" },
    xl: { icon: "w-12 h-12", text: "text-2xl", gap: "gap-3.5" },
  };

  const { icon, text, gap } = sizeMap[size];

  const content = (
    <div className={cn("inline-flex items-center", gap, className)}>
      <JidoSappIcon className={icon} />
      {!iconOnly && (
        <span
          className={cn(
            "font-extrabold tracking-tight font-sans text-zinc-950 flex items-center",
            text
          )}
        >
          <span>Jido</span>
          <span className="text-[#2563eb]">Sapp</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
