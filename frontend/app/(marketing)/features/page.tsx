"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Zap,
  Bot,
  Kanban,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Send,
  Newspaper,
  Palette,
  ShieldAlert,
  Globe,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-24">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          <Sparkles className="h-3.5 w-3.5" />
          <span>WhatsApp Superpowers Unlocked</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950">
          Your WhatsApp can do more than you think.
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">
          From single-tap newsletter bridges to 7:00 AM portfolio drops and 24/7 group spam sentinels—explore the full spectrum of automations provisioned on your dedicated <code className="font-mono font-bold text-zinc-900">*.jidosaap.xyz</code> subdomain.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link href="/request-integration">
            <Button className="bg-rose-600 hover:bg-rose-500 text-white font-semibold gap-2">
              <span>Request Dedicated Integration</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/#use-cases">
            <Button variant="outline">Explore Live Demos</Button>
          </Link>
        </div>
      </div>

      {/* Featured Star Capabilities */}
      <div className="space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Star Workflows</span>
          <h2 className="text-2xl font-bold text-zinc-900">Proven Real-World Implementations</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Precious */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white p-7 space-y-4 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Newspaper className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Precious @ penna.dev: 1-Tap Status Bridge</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Connects directly to penna.dev webhooks. When a newsletter post is ready, a single tap pushes the issue summary, preview image, and read link directly to your WhatsApp Status and reader broadcast lists without manual tab switching.
            </p>
            <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-1 rounded w-fit">
              Isolated at precious.jidosaap.xyz
            </div>
          </div>

          {/* Shola */}
          <div className="rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white p-7 space-y-4 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <Palette className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Shola The Designer: Daily 7:00 AM Drop</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Queue your visual portfolios in our Content Studio. JidoSapp executes a high-precision 7:00 AM daily cron broadcast to WhatsApp Status and VIP client lists. Build consistent authority that pulls inbound client DMs effortlessly.
            </p>
            <div className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded w-fit">
              Isolated at shola.jidosaap.xyz
            </div>
          </div>

          {/* Michael */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white p-7 space-y-4 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Michael's Community: Group Spam Sentinel</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Monitors high-traffic community groups around the clock. Automatically detects spam links, scam invites, and unauthorized solicitations. Issues automated strike warnings and kicks offenders out without human moderator intervention.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded w-fit">
              Isolated at michael.jidosaap.xyz
            </div>
          </div>
        </div>
      </div>

      {/* Platform Architecture & Tools */}
      <div className="space-y-8 pt-8 border-t border-zinc-100">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Infrastructure</span>
          <h2 className="text-2xl font-bold text-zinc-900">The Core Engine Under The Hood</h2>
        </div>

        <section id="features-grid" className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Content Scheduling */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Content Studio &amp; Calendar</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Compose rich WhatsApp updates, apply approved Meta templates, and schedule recurring broadcasts respecting your workspace timezone.
            </p>
          </div>

          {/* Card 2: AI Agents */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Autonomous AI Agents</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Train AI agents on your business knowledge base with vector embeddings, execute explicit tools, and seamlessly escalate to human teammates.
            </p>
          </div>

          {/* Card 3: API Automations */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">API Integration &amp; Transformers</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Connect external REST APIs with encrypted secrets. Extract JSON fields and let AI generate dynamic, personalized WhatsApp notifications.
            </p>
          </div>

          {/* Card 4: Visual Workflows */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Visual Flow Builder</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Construct multi-branch automation trees with triggers, filters, delays, and WhatsApp actions without writing a single line of code.
            </p>
          </div>

          {/* Card 5: CRM Pipeline */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Kanban className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Embedded CRM &amp; Leads</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Automatically capture contacts from incoming messages, qualify leads into a Kanban pipeline, and track conversions.
            </p>
          </div>

          {/* Card 6: Analytics */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Unified Analytics &amp; Audit</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Monitor messages sent, AI resolution rate, lead velocity, and complete immutable security audit trails.
            </p>
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="bg-zinc-950 rounded-2xl p-8 sm:p-12 text-center text-white space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Ready to setup your dedicated WhatsApp instance?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Claim your subdomain on <code className="text-rose-400 font-mono">*.jidosaap.xyz</code> and start automating your WhatsApp today.
        </p>
        <Link href="/request-integration">
          <Button size="lg" className="h-11 px-8 bg-rose-600 hover:bg-rose-500 text-white font-semibold">
            Claim Subdomain &amp; Setup Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
