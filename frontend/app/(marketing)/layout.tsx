import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-sm relative">
            <span className="font-serif">自</span>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900">
            JidoSapp
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <Link href="/dashboard/overview" className="hover:text-zinc-900 transition-colors">
            Dashboard
          </Link>
          <Link href="/features" className="hover:text-zinc-900 transition-colors">
            Features
          </Link>
          <Link href="/architecture" className="hover:text-zinc-900 transition-colors">
            Architecture
          </Link>
          <Link href="/pricing" className="hover:text-zinc-900 transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Start Free Trial</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-zinc-50 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-serif">
              自
            </div>
            <span className="font-semibold text-sm text-zinc-800">
              JidoSapp — Put WhatsApp on Autopilot
            </span>
          </div>

          <div className="text-xs text-zinc-400">
            Built with official Meta WhatsApp Business Cloud API. © {new Date().getFullYear()} JidoSapp Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
