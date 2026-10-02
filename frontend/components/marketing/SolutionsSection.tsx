"use client";

import React from "react";
import Link from "next/link";
import { Zap, Clock, ShieldAlert, Check, ArrowRight, Bot } from "lucide-react";

export function SolutionsSection() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
          Solutions
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Solve your team's biggest challenges
        </h2>
      </div>

      {/* Value Pillars with Direct Links to Dedicated Pages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto text-left relative pt-4">
        {/* Solution 1 */}
        <Link
          href="/solutions/newsletter-bridge"
          className="group p-5 rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              <strong className="text-zinc-900 block group-hover:text-[#2563eb] transition-colors">1-Tap Status Bridge</strong>
              Post penna.dev &amp; newsletter articles straight to WhatsApp Status with zero manual reformatting.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#2563eb] flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
            View solution <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        {/* Solution 2 */}
        <Link
          href="/solutions/scheduled-drops"
          className="group p-5 rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              <strong className="text-zinc-900 block group-hover:text-[#2563eb] transition-colors">7:00 AM Daily Drops</strong>
              Queue graphics once a week and let JidoSapp broadcast your portfolio every morning on schedule.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#2563eb] flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
            View solution <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        {/* Solution 3 */}
        <Link
          href="/solutions/group-shield"
          className="group p-5 rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              <strong className="text-zinc-900 block group-hover:text-[#2563eb] transition-colors">Group Spam Shield</strong>
              Delete phishing links in milliseconds, issue warning strikes, and auto-kick malicious bots 24/7.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#2563eb] flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
            View solution <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        {/* Solution 4 */}
        <Link
          href="/solutions/auto-responder"
          className="group p-5 rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              <strong className="text-zinc-900 block group-hover:text-[#2563eb] transition-colors">24/7 Auto-Responder</strong>
              Deliver instant rate cards, answer customer questions, and book Calendly calls without human delay.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#2563eb] flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
            View solution <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </div>

      {/* Big Radiant Dashboard Frame with Floating Badges */}
      <div className="relative max-w-6xl mx-auto pt-6">
        {/* Floating '20' Squircle */}
        <div className="hidden sm:flex absolute -top-2 left-6 z-20 w-16 h-16 rounded-2xl bg-white shadow-xl border border-zinc-100 items-center justify-center text-xl font-bold text-zinc-900 -rotate-12">
          20
        </div>
        {/* Floating Teal Checkmark Squircle */}
        <div className="hidden sm:flex absolute top-16 right-4 z-20 w-16 h-16 rounded-2xl bg-white shadow-xl border border-zinc-100 items-center justify-center rotate-12">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
            <Check className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Cyan Glow Frame */}
        <div className="rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#00b4d8] to-[#0284c7] p-3 sm:p-5 shadow-2xl">
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 text-left space-y-8 shadow-inner overflow-hidden">
            {/* Internal Dashboard Mockup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-2 gap-1 w-5 h-5">
                  <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
                  <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
                  <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
                  <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
                </div>
                <span className="font-bold text-base text-zinc-900">JidoSapp Engine</span>
                <span className="text-xs font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                  tenant://pipeline.live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-emerald-600">Meta Cloud API Connected</span>
              </div>
            </div>

            {/* Console Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#fafafa] border border-zinc-200/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                  <span>1-Tap Status Pipeline</span>
                  <span className="text-[10px] text-indigo-600 font-mono">penna.dev</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200/60 shadow-xs text-xs space-y-1">
                  <div className="text-[10px] text-zinc-400">Latest Synced Issue</div>
                  <div className="font-bold text-zinc-800">User Experience: the gateway to the users heart</div>
                  <div className="text-[10px] text-emerald-600 font-mono">Status Posted · 384 views</div>
                </div>
              </div>

              <div className="bg-[#fafafa] border border-zinc-200/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                  <span>Cron Scheduler</span>
                  <span className="text-[10px] text-amber-600 font-mono">07:00 AM</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200/60 shadow-xs text-xs space-y-1">
                  <div className="text-[10px] text-zinc-400">Daily Drop Status</div>
                  <div className="font-bold text-zinc-800">Shola's Brand Identity Showcase</div>
                  <div className="text-[10px] text-[#0284c7] font-mono">Broadcast delivered to 1,240 leads</div>
                </div>
              </div>

              <div className="bg-[#fafafa] border border-zinc-200/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                  <span>Group Guardian</span>
                  <span className="text-[10px] text-emerald-600 font-mono">24/7 Shield</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-zinc-200/60 shadow-xs text-xs space-y-1">
                  <div className="text-[10px] text-zinc-400">Scam Shield Activity</div>
                  <div className="font-bold text-zinc-800">Michael's Community Hub</div>
                  <div className="text-[10px] text-rose-600 font-mono">3 spam links deleted · 1 user exited</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
