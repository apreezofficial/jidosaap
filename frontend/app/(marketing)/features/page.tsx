"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Zap,
  Bot,
  Kanban,
  BarChart3,
  ShieldCheck,
  Send,
  Newspaper,
  Palette,
  ShieldAlert,
  Globe,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/90 text-xs font-semibold text-zinc-700 shadow-2xs">
          <span>Enterprise Platform Capabilities</span>
        </div>
        <h1
          className="text-3xl sm:text-5xl lg:text-[56px] font-normal leading-[1.05] max-w-4xl mx-auto font-outfit"
          style={{ letterSpacing: "-2px", fontWeight: 400 }}
        >
          <span className="block text-zinc-950 font-normal">
            Autonomous features engineered
          </span>
          <span className="block text-[#9ca3af] mt-1 sm:mt-1.5 font-normal">
            to scale your audience.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto">
          From 24/7 group spam moderation and zero-latency auto-responders to 7:00 AM portfolio broadcasts—explore the full spectrum of tools provisioned on your dedicated <code className="font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">*.jidosaap.xyz</code> subdomain.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/request-integration">
            <button className="h-11 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs transition-all">
              Request Demo
            </button>
          </Link>
          <Link href="/solutions">
            <button className="h-11 px-6 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-medium shadow-2xs transition-all">
              Explore Solutions
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Flagship Engines</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950">Proven Real-World Implementations</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Group Buddy */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Group Buddy: Anti-Spam Sentinel</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Monitors high-traffic community groups around the clock. Automatically detects scam links, issues strike warnings, and kicks repeat offenders without human moderator delay.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded w-fit">
              Sub-second link deletion
            </div>
          </div>

          {/* 24/7 Auto-Responder */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563eb] border border-blue-200/60 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">24/7 Smart AI Auto-Responder</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Never miss high-intent clients at 2:00 AM. Answers FAQs, qualifies prospective clients, delivers service rate cards, and shares live calendar booking links automatically.
            </p>
            <div className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded w-fit">
              0s human response latency
            </div>
          </div>

          {/* Scheduled Drops */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">7:00 AM Daily Broadcast Engine</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Queue your visual portfolios, graphics, or articles once a week. JidoSapp executes sharp daily morning broadcasts to WhatsApp Status and VIP client lists while you sleep.
            </p>
            <div className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded w-fit">
              100% on-time cron delivery
            </div>
          </div>

          {/* 1-Tap Status Bridge */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
              <Newspaper className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">1-Tap Article &amp; Status Bridge</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Bridge content straight from your CMS, blog, or webhook events. Auto-formats rich media status cards and tracking shortlinks with zero manual copying and pasting.
            </p>
            <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-1 rounded w-fit">
              Instant mobile distribution
            </div>
          </div>
        </div>
      </div>

      {/* Platform Architecture & Tools */}
      <div className="space-y-8 pt-8 border-t border-zinc-100">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Infrastructure</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950">The Core Engine Under The Hood</h2>
        </div>

        <section id="features-grid" className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3 shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-zinc-900">Content Studio &amp; Calendar</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Compose rich WhatsApp updates, apply approved Meta templates, and schedule recurring broadcasts respecting your workspace timezone.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3 shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-zinc-900">Autonomous AI Agents</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Train AI agents on your business knowledge base, execute explicit tool calling, and seamlessly escalate to human teammates.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3 shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-zinc-900">API Integration &amp; Transformers</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Connect external REST APIs with encrypted secrets. Extract JSON fields and let AI generate dynamic, personalized WhatsApp notifications.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3 shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-zinc-900">Dedicated Tenant Subdomains</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Run on your own *.jidosaap.xyz domain with isolated database records, private webhooks, and zero shared rate limits.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3 shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Kanban className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-zinc-900">Embedded CRM &amp; Pipeline</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Automatically capture contacts from incoming messages, qualify leads into a Kanban pipeline, and track conversions.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3 shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-zinc-900">Unified Analytics &amp; Audit</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Monitor messages sent, AI resolution rate, lead velocity, and complete immutable security audit trails.
            </p>
          </div>
        </section>
      </div>

      {/* Bottom CTA */}
      <div className="bg-zinc-950 rounded-[32px] p-8 sm:p-14 text-center text-white space-y-6 border border-zinc-800">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to setup your dedicated WhatsApp instance?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Claim your subdomain on <code className="text-white font-mono font-bold">*.jidosaap.xyz</code> and start automating your WhatsApp today.
        </p>
        <Link href="/request-integration">
          <button className="h-11 px-8 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs transition-all shadow-md">
            Request Demo &amp; Subdomain
          </button>
        </Link>
      </div>
    </div>
  );
}
