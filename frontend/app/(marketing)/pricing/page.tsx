"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Zap, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto space-y-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-2xs text-xs font-semibold text-zinc-700">
          Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Simple pricing plans
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">
          Every plan includes your dedicated <code className="font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">*.jidosaap.xyz</code> subdomain, verified Meta WhatsApp Cloud API instance, and isolated database.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-zinc-900" : "text-zinc-400"}`}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="w-12 h-6 rounded-full bg-zinc-200 p-1 relative transition-colors focus:outline-none"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                billingCycle === "yearly" ? "translate-x-6 bg-[#2563eb]" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-zinc-900" : "text-zinc-400"}`}>
            <span>Annual</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* 3 Pricing Columns matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
        {/* Card 1: Basic Plan */}
        <div className="rounded-[30px] border border-zinc-200/80 bg-white p-8 sm:p-10 space-y-8 shadow-xs text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-950">Basic plan</h3>
            <p className="text-xs text-zinc-400">Perfect for individuals &amp; creators.</p>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
              ${billingCycle === "monthly" ? "15" : "12"}
              <span className="text-base font-normal text-zinc-400">/mo</span>
            </div>
          </div>

          <Link href="/request-integration" className="block">
            <button className="w-full h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold transition-all">
              Request Demo
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
              <span>1-Tap Newsletter Status Bridge</span>
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
            <p className="text-xs text-blue-100">Ideal for growing teams &amp; communities.</p>
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              ${billingCycle === "monthly" ? "39" : "31"}
              <span className="text-base font-normal text-blue-200">/mo</span>
            </div>
            <div className="text-[11px] font-semibold text-blue-200">Best choice for growing businesses</div>
          </div>

          <Link href="/request-integration" className="block">
            <button className="w-full h-11 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold transition-all shadow-md">
              Request Demo
            </button>
          </Link>

          <div className="space-y-3 pt-2 text-xs text-blue-50">
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-white shrink-0" />
              <span>All product features</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-white shrink-0" />
              <span>Group Buddy: Anti-Spam Shield &amp; Strikes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-white shrink-0" />
              <span>24/7 Smart AI Auto-Responder</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-white shrink-0" />
              <span>7:00 AM Daily Broadcast Engine</span>
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
              ${billingCycle === "monthly" ? "99" : "79"}
              <span className="text-base font-normal text-zinc-400">/mo</span>
            </div>
          </div>

          <Link href="/request-integration" className="block">
            <button className="w-full h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold transition-all">
              Request Demo
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

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto pt-10 space-y-6">
        <h2 className="text-2xl font-bold text-center text-zinc-900">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl border border-zinc-200/80 bg-white space-y-1 shadow-2xs">
            <h4 className="font-bold text-zinc-900 text-sm">Do you support unofficial WhatsApp web sessions?</h4>
            <p className="text-zinc-600 leading-relaxed">
              No. JidoSapp strictly uses the official Meta WhatsApp Business Platform / Cloud API. This ensures guaranteed uptime, prevents account bans, and provides real message delivery receipts.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200/80 bg-white space-y-1 shadow-2xs">
            <h4 className="font-bold text-zinc-900 text-sm">How do dedicated subdomains work?</h4>
            <p className="text-zinc-600 leading-relaxed">
              Every client gets their own isolated subdomain on jidosaap.xyz (e.g. yourbrand.jidosaap.xyz). This ensures your webhooks, rate limits, and database records are completely separate from any other client.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200/80 bg-white space-y-1 shadow-2xs">
            <h4 className="font-bold text-zinc-900 text-sm">Can I self-host JidoSapp on my own server?</h4>
            <p className="text-zinc-600 leading-relaxed">
              Yes. JidoSapp is 100% self-hostable via Docker on any VPS (DigitalOcean, Hetzner, AWS) for full data ownership and private SQLite or PostgreSQL databases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
