"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";

export default function ScheduledDropsPage() {
  const [scheduled, setScheduled] = useState(false);
  const [inquiries, setInquiries] = useState(14);

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-24">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-semibold text-amber-700">
          <Calendar className="h-3.5 w-3.5" />
          <span>Consistency Engine for Creators &amp; Designers</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          7:00 AM Daily Scheduled Portfolio Drops.
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          Consistency is what convinces high-ticket clients to hire you. Queue your graphics, case studies, or design tips once a week—and let JidoSapp broadcast them at 7:00 AM sharp every morning while you sleep.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/request-integration">
            <button className="h-11 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
              Start Scheduled Drops
            </button>
          </Link>
          <Link href="/pricing">
            <button className="h-11 px-5 rounded-xl bg-white border border-zinc-200/80 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-xs transition-all">
              View Pricing ($15/mo)
            </button>
          </Link>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="rounded-[32px] border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-xs max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider font-mono">
              Simulator
            </span>
            <h3 className="text-xl font-bold text-zinc-900 mt-1">
              Shola's 7:00 AM Consistency Engine
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
            <Clock3 className="h-3.5 w-3.5" />
            <span>07:00:00 AM Trigger</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Creator Queue Card */}
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Weekly Queue</span>
              <span className="text-amber-600 font-bold">5 Drops Queued</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-900">Mon 7:00 AM • Minimalist Logo Case Study</div>
                  <div className="text-[11px] text-zinc-400">Attached: 3 high-res PNG slides</div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded">Ready</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-900">Tue 7:00 AM • Fintech Mobile App UI Concept</div>
                  <div className="text-[11px] text-zinc-400">Attached: 1 video walkthrough</div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded">Ready</span>
              </div>
            </div>

            <button
              onClick={() => {
                setScheduled(true);
                setInquiries((prev) => prev + 2);
              }}
              className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{scheduled ? "Drop Triggered! (Simulate Again)" : "Simulate 7:00 AM Auto-Drop"}</span>
            </button>
          </div>

          {/* Outcome & Results */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
              <span>Client Inquiries &amp; Pipeline</span>
              <span className="font-mono text-emerald-600 font-bold">+{inquiries} Retainer Leads</span>
            </div>

            {scheduled ? (
              <div className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-zinc-800">Broadcast Dispatched to 1,240 Contacts</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  "Hey Shola, love the Fintech mobile UI you posted this morning! Are you available for a 2-month brand revamp starting next week?"
                </p>
                <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Consistency rate: 100% on schedule</span>
                </div>
              </div>
            ) : (
              <div className="h-36 rounded-xl border-2 border-dashed border-amber-200 flex flex-col items-center justify-center text-center p-4 text-amber-700/70 text-xs">
                <span>Click "Simulate 7:00 AM Auto-Drop" to see how scheduled consistency pulls clients to you</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-xs">
            01
          </div>
          <h4 className="text-base font-bold text-zinc-950">Set &amp; Forget Cron</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Schedule recurring daily or weekly drops at custom local timezones (07:00 AM, 12:00 PM, etc.).
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-xs">
            02
          </div>
          <h4 className="text-base font-bold text-zinc-950">High-Resolution Media</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Supports uncompressed graphics, carousel slides, video teasers, and markdown captions.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-xs">
            03
          </div>
          <h4 className="text-base font-bold text-zinc-950">Client Response Tracking</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Anyone replying to your drop gets automatically routed into your CRM pipeline or auto-responder.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-[32px] bg-zinc-950 p-10 sm:p-14 text-center text-white space-y-6 max-w-5xl mx-auto border border-zinc-800">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Never miss a morning portfolio drop again
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Get your own dedicated subdomain on <code className="text-white font-mono">jidosaap.xyz</code> and start scheduling.
        </p>
        <Link href="/request-integration">
          <button className="h-11 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
            Request Designer Integration
          </button>
        </Link>
      </div>
    </div>
  );
}
