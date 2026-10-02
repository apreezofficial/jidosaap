import React from "react";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f7] selection:bg-[#2563eb] selection:text-white antialiased font-sans">
      {/* Top Fixed Main Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#f4f4f7]/85 backdrop-blur-md border-b border-zinc-200/70 shadow-2xs transition-all">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Brand Logo with 4-dot Grid in Royal Blue */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="grid grid-cols-2 gap-1 w-5 h-5 items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
              <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
              <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
              <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-950 font-sans">
              JidoSapp
            </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs lg:text-sm font-medium text-zinc-600">
            <Link href="/solutions" className="hover:text-[#2563eb] transition-colors">
              Solutions
            </Link>
            <Link href="/features" className="hover:text-[#2563eb] transition-colors">
              Features
            </Link>
            <Link href="/solutions/subdomains" className="hover:text-[#2563eb] transition-colors">
              Subdomains
            </Link>
            <Link href="/pricing" className="hover:text-[#2563eb] transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Right CTA Links */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs lg:text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors">
              Sign in
            </Link>
            <Link href="/request-integration">
              <button className="h-9 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]">
                Request Demo
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white text-zinc-500 py-16 px-6 lg:px-12 mt-20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="grid grid-cols-2 gap-1 w-5 h-5">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
                <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
                <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
                <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
              </div>
              <div>
                <span className="font-bold text-sm text-zinc-900 block">
                  JidoSapp
                </span>
                <span className="text-xs text-zinc-500">
                  Your WhatsApp can do more than you think.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-zinc-600 font-medium">
              <Link href="/solutions/group-shield" className="hover:text-[#2563eb] transition-colors">
                Group Buddy
              </Link>
              <Link href="/solutions/auto-responder" className="hover:text-[#2563eb] transition-colors">
                24/7 Auto-Responder
              </Link>
              <Link href="/solutions/newsletter-bridge" className="hover:text-[#2563eb] transition-colors">
                Status Bridge
              </Link>
              <Link href="/solutions/scheduled-drops" className="hover:text-[#2563eb] transition-colors">
                Scheduled Drops
              </Link>
              <Link href="/solutions/subdomains" className="hover:text-[#2563eb] transition-colors">
                Claim Subdomain
              </Link>
              <Link href="/pricing" className="hover:text-[#2563eb] transition-colors">
                Pricing
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <div>
              Built for high-velocity teams, creators, freelance designers, and communities. Powered by Meta WhatsApp Cloud API.
            </div>
            <div>
              &copy; {new Date().getFullYear()} JidoSapp (jidosaap.xyz). All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
