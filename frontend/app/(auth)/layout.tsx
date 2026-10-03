import React from "react";
import Link from "next/link";
import { JidoSappLogo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#2563eb] selection:text-white">
      {/* Top Bar Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <JidoSappLogo href="/" size="md" />

        <Link
          href="/request-integration"
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
        >
          Request Demo &amp; Setup →
        </Link>
      </div>

      {/* Main Form Centerpiece */}
      <div className="w-full max-w-4xl mx-auto my-auto py-6">
        {children}
      </div>
    </div>
  );
}
