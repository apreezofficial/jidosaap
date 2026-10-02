import React from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

export function PricingSection() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
          Pricing
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Simple pricing plans
        </h2>
      </div>

      {/* 3 Pricing Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
        {/* Card 1: Basic Plan */}
        <div className="rounded-[30px] border border-zinc-200/80 bg-white p-8 sm:p-10 space-y-8 shadow-xs text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-950">Basic plan</h3>
            <p className="text-xs text-zinc-400">Perfect for individuals.</p>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
              $15<span className="text-base font-normal text-zinc-400">/mo</span>
            </div>
          </div>

          <Link href="/request-integration" className="block">
            <button className="w-full h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold transition-all">
              Get started
            </button>
          </Link>

          <div className="space-y-3 pt-2 text-xs text-zinc-600">
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-zinc-800 shrink-0" />
              <span>Dedicated *.jidosaap.xyz subdomain</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-zinc-800 shrink-0" />
              <span>1 Official WhatsApp Connection</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-zinc-800 shrink-0" />
              <span>1-Tap Newsletter Bridge</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-zinc-800 shrink-0" />
              <span>Standard support</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pro Plan (HERO BLUE CARD WITH FLOATING 3D LIGHTNING BOLT) */}
        <div className="relative rounded-[32px] bg-[#2563eb] text-white p-8 sm:p-11 space-y-8 shadow-2xl text-left scale-100 md:scale-105 z-10">
          {/* Floating 3D Yellow Lightning Bolt Squircle */}
          <div className="absolute -top-5 right-6 w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center rotate-12 border border-blue-100">
            <Zap className="h-7 w-7 text-amber-500 fill-amber-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Pro plan</h3>
            <p className="text-xs text-blue-100">Ideal for creators &amp; small teams.</p>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              $39<span className="text-base font-normal text-blue-200">/mo</span>
            </div>
            <div className="text-[11px] font-semibold text-blue-200">Best choice for growing businesses</div>
          </div>

          <Link href="/request-integration" className="block">
            <button className="w-full h-11 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold transition-all shadow-md">
              Get started
            </button>
          </Link>

          <div className="space-y-3 pt-2 text-xs text-blue-50">
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-white shrink-0" />
              <span>All product features</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-white shrink-0" />
              <span>7:00 AM Daily Cron Drop Engine</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-white shrink-0" />
              <span>24/7 Smart Auto-Responder</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-white shrink-0" />
              <span>Group Spam Sentinel &amp; Strikes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-white shrink-0" />
              <span>Unlimited file storage &amp; CRM capture</span>
            </div>
          </div>
        </div>

        {/* Card 3: Advanced Plan */}
        <div className="rounded-[30px] border border-zinc-200/80 bg-white p-8 sm:p-10 space-y-8 shadow-xs text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-950">Advanced plan</h3>
            <p className="text-xs text-zinc-400">Best for agencies &amp; multi-community.</p>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
              $99<span className="text-base font-normal text-zinc-400">/mo</span>
            </div>
          </div>

          <Link href="/request-integration" className="block">
            <button className="w-full h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold transition-all">
              Get started
            </button>
          </Link>

          <div className="space-y-3 pt-2 text-xs text-zinc-600">
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-zinc-800 shrink-0" />
              <span>Unlimited official WhatsApp connections</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-zinc-800 shrink-0" />
              <span>Multi-community group sentinel &amp; auto-kick</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-zinc-800 shrink-0" />
              <span>Dedicated account manager &amp; custom webhooks</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-zinc-800 shrink-0" />
              <span>Priority 24/7 SLA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
