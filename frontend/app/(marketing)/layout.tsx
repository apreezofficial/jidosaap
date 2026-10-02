import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Globe, ArrowRight } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-rose-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-4 text-center border-b border-zinc-800 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Sparkles className="h-3 w-3 text-rose-400" />
          <span>New: Dedicated subdomains for every client on <span className="text-white font-mono font-semibold">*.jidosaap.xyz</span></span>
        </span>
        <span className="hidden sm:inline text-zinc-600">|</span>
        <Link href="/request-integration" className="hidden sm:inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2">
          Claim yours now <ArrowRight className="h-3 w-3 inline" />
        </Link>
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100 px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white font-bold text-sm relative shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-serif text-base">自</span>
            <span className="absolute bottom-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-zinc-950 leading-tight">
              JidoSapp
            </span>
            <span className="text-[10px] text-zinc-400 font-mono -mt-0.5">jidosaap.xyz</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600">
          <Link href="/#use-cases" className="hover:text-zinc-950 transition-colors">
            Top Use Cases
          </Link>
          <Link href="/#subdomains" className="hover:text-zinc-950 transition-colors flex items-center gap-1">
            <Globe className="h-3.5 w-3.5 text-zinc-400" />
            <span>Subdomain Setup</span>
          </Link>
          <Link href="/features" className="hover:text-zinc-950 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-zinc-950 transition-colors">
            Pricing
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-950 transition-colors">
            Console
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-950">
              Sign In
            </Button>
          </Link>
          <Link href="/request-integration">
            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm font-semibold">
              Request Integration
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-zinc-950 text-zinc-400 py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-zinc-950 text-sm font-serif font-bold">
                自
              </div>
              <div>
                <span className="font-bold text-base text-white block">
                  JidoSapp
                </span>
                <span className="text-xs text-rose-400 font-medium">
                  Your WhatsApp can do more than you think.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-zinc-400">
              <Link href="/#use-cases" className="hover:text-white transition-colors">penna.dev Bridge</Link>
              <Link href="/#use-cases" className="hover:text-white transition-colors">7 AM Designer Drops</Link>
              <Link href="/#use-cases" className="hover:text-white transition-colors">Group Spam Guardian</Link>
              <Link href="/request-integration" className="hover:text-white transition-colors">Claim Subdomain</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div>
              Built for high-performance creators, brands, and communities. Powered by official Meta WhatsApp Cloud API.
            </div>
            <div>
              © {new Date().getFullYear()} JidoSapp (jidosaap.xyz). All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
