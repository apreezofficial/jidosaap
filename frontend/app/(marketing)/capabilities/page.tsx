"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Newspaper,
  Palette,
  ShieldAlert,
  ArrowRight,
  Zap,
  Globe,
  Bot,
  Calendar,
} from "lucide-react";

export default function CapabilitiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Core Capabilities &amp; Multi-Tenant Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950">
          Your WhatsApp can do more than you think.
        </h1>
        <p className="text-base text-zinc-600">
          Discover how JidoSapp empowers businesses, newsletter creators, graphic designers, and community leaders with isolated instances on <code className="font-mono font-bold text-zinc-900">*.jidosaap.xyz</code>.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Newspaper className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-zinc-900">1-Tap Newsletter Bridge</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Precious pushes directly from penna.dev to WhatsApp Status with a single tap. Zero context switching, zero manual copy-pasting.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Palette className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-zinc-900">7:00 AM Daily Designer Drops</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Shola schedules portfolio updates that broadcast daily at 7 AM sharp, building unshakeable consistency and driving client inquiries.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-zinc-900">Group Spam Sentinel &amp; Strikes</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Michael's communities are protected 24/7. Scam links are deleted instantly, warnings issued, and repeat spammers exited automatically.
          </p>
        </div>
      </div>

      <div className="text-center pt-8">
        <Link href="/request-integration">
          <Button size="lg" className="bg-rose-600 hover:bg-rose-500 text-white font-semibold">
            Claim Your Subdomain &amp; Setup Instance
          </Button>
        </Link>
      </div>
    </div>
  );
}
