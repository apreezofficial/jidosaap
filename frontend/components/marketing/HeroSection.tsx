"use client";

import React from "react";
import Link from "next/link";
import { Check, Clock3, ShieldCheck, Zap, Bot, Sparkles, MessageCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
      <div className="relative w-full rounded-[28px] sm:rounded-[36px] border border-zinc-200/90 bg-[#fafafa] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden min-h-[640px] sm:min-h-[700px] lg:min-h-[750px] flex flex-col items-center justify-center text-center px-6 py-20 lg:py-28">
        {/* Custom Hero Texture & Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-90 transition-opacity"
          style={{
            backgroundImage: "url('/hero-pattern.png')",
          }}
        />

        {/* ── TOP-LEFT WIDGET: Post-It Sticky Note (24/7 Automated Support) ── */}
        <div className="hidden md:block absolute top-8 lg:top-12 left-8 lg:left-14 -rotate-3 z-10 transition-transform hover:-rotate-1 duration-300">
          <div className="w-60 lg:w-68 bg-[#fef08a] border border-amber-300/60 shadow-[0_16px_36px_rgba(0,0,0,0.07)] rounded-sm p-4 text-left relative">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-md mx-auto -mt-2 mb-2 border border-red-600/40 relative">
              <span className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/60"></span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/90 font-mono mb-1">
              Live Automation
            </div>
            <div className="text-[13px] font-bold text-zinc-900 leading-snug">
              24/7 Customer Auto-Support
            </div>
            <p className="text-[11px] font-medium text-zinc-800/90 mt-1 leading-relaxed font-sans">
              Instant responses to client inquiries, rates delivery &amp; meeting booking—even while you sleep.
            </p>
          </div>
          {/* Floating Checkmark Squircle Button Below Note */}
          <div className="absolute -bottom-8 -right-3 rotate-6 w-14 h-14 rounded-2xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.1)] border border-zinc-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-xs">
              <Check className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* ── TOP-RIGHT WIDGET: Scheduled Morning Broadcast (7:00 AM Drops) ── */}
        <div className="hidden md:block absolute top-8 lg:top-12 right-8 lg:right-14 rotate-2 z-10 transition-transform hover:rotate-1 duration-300">
          <div className="w-60 lg:w-68 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-[0_16px_36px_rgba(0,0,0,0.06)] p-4 text-left relative">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900 mb-1">
              <span>Scheduled Broadcast</span>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">Automated</span>
            </div>
            <div className="text-[13px] font-bold text-zinc-900">7:00 AM Morning Drop</div>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
              Hands-free daily portfolio &amp; status showcase dispatched consistently.
            </p>

            <div className="mt-3 flex items-center gap-1.5 bg-blue-50 text-[#2563eb] px-2.5 py-1 rounded-lg text-[11px] font-semibold w-fit">
              <Clock3 className="h-3.5 w-3.5" />
              <span>07:00 AM Sharp • Cron Active</span>
            </div>
          </div>

          {/* Floating 3D Stopwatch Squircle */}
          <div className="absolute -top-3 -left-10 -rotate-6 w-14 h-14 rounded-2xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.1)] border border-zinc-100 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full border-2 border-zinc-900 flex items-center justify-center relative">
              <span className="w-0.5 h-3 bg-red-500 rounded -mt-2"></span>
              <span className="absolute top-1 right-2 w-1.5 h-0.5 bg-zinc-900"></span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM-LEFT WIDGET: Real-Time Automated Tasks Progress ── */}
        <div className="hidden md:block absolute bottom-8 lg:bottom-12 left-8 lg:left-14 -rotate-1 z-10 transition-transform hover:rotate-0 duration-300">
          <div className="w-68 lg:w-76 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-[0_16px_36px_rgba(0,0,0,0.06)] p-4 text-left space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-zinc-900">Automated Workflows</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-medium text-emerald-600">Active</span>
              </div>
            </div>

            {/* Task 1: 24/7 Inquiries */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
                  <span className="font-medium text-zinc-800">24/7 Client Auto-Support</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">&lt; 2s reply</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2563eb] h-full rounded-full w-[100%]"></div>
              </div>
            </div>

            {/* Task 2: Morning Drop */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-zinc-800">7:00 AM Daily Broadcast</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold font-mono">Completed</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[100%]"></div>
              </div>
            </div>

            {/* Task 3: Spam Shield */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-medium text-zinc-800">Anti-Spam Group Shield</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">18 blocked</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM-RIGHT WIDGET: Real Connected Integrations (Logos + Reasonable Number) ── */}
        <div className="hidden md:block absolute bottom-8 lg:bottom-12 right-8 lg:right-14 rotate-1 z-10 transition-transform hover:rotate-0 duration-300">
          <div className="w-68 lg:w-76 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-[0_16px_36px_rgba(0,0,0,0.06)] p-4 text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
              <span>20+ Essential Integrations</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Recognizable Brand Logos */}
            <div className="flex items-center gap-2 pt-1">
              {/* WhatsApp */}
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 shadow-xs flex items-center justify-center hover:scale-105 transition-transform" title="WhatsApp Official API">
                <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 2c-5.516 0-9.998 4.478-9.998 9.994 0 1.761.458 3.477 1.328 4.986L2 22l5.188-1.361a9.96 9.96 0 004.843 1.255h.004c5.516 0 9.998-4.478 9.998-9.994 0-2.671-1.04-5.182-2.928-7.071A9.924 9.924 0 0012.031 2zm0 18.292c-1.503 0-2.977-.404-4.262-1.168l-.306-.182-3.167.831.845-3.088-.199-.317A8.286 8.286 0 013.725 11.994c0-4.58 3.726-8.303 8.307-8.303 2.22 0 4.307.865 5.877 2.435 1.57 1.571 2.434 3.658 2.434 5.877 0 4.58-3.726 8.303-8.312 8.303zm4.553-6.219c-.249-.125-1.477-.729-1.705-.812-.229-.083-.395-.125-.561.125-.166.25-.644.812-.789.979-.145.166-.291.187-.54.062-.249-.125-1.053-.388-2.005-1.238-.741-.661-1.242-1.478-1.387-1.728-.145-.25-.015-.385.11-.509.112-.112.249-.291.374-.437.125-.145.166-.25.249-.416.083-.166.042-.312-.021-.437-.062-.125-.561-1.352-.769-1.851-.202-.486-.407-.42-.561-.428h-.478c-.166 0-.436.062-.664.312-.229.25-.873.853-.873 2.08s.894 2.413 1.018 2.58c.125.166 1.76 2.688 4.263 3.769.596.257 1.061.411 1.424.526.598.19 1.143.163 1.573.099.48-.072 1.477-.603 1.685-1.186.208-.582.208-1.082.145-1.186-.062-.104-.228-.166-.477-.291z" />
                </svg>
              </div>

              {/* Penna */}
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 shadow-xs flex items-center justify-center hover:scale-105 transition-transform" title="Penna.dev Newsletters">
                <span className="font-extrabold text-sm text-indigo-600 font-mono tracking-tighter">P</span>
              </div>

              {/* Stripe */}
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200/80 shadow-xs flex items-center justify-center hover:scale-105 transition-transform" title="Stripe Billing">
                <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.951 15.934.5 13.064.5 7.644.5 3.75 3.394 3.75 8.163c0 4.708 3.57 6.474 6.784 7.674 2.298.86 3.097 1.55 3.097 2.483 0 1.002-.924 1.547-2.316 1.547-2.342 0-5.18-1.109-7.067-2.158l-.946 5.578C5.07 24.328 7.94 25 11.238 25c5.69 0 9.774-2.858 9.774-7.857 0-4.662-3.32-6.438-7.036-7.993z" />
                </svg>
              </div>

              {/* OpenAI */}
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-900 shadow-xs flex items-center justify-center hover:scale-105 transition-transform" title="OpenAI Intelligence">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.64a4.485 4.485 0 0 1 2.366-1.973V12.2a.766.766 0 0 0 .388.677l5.815 3.355-2.02 1.169a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 8.64zm16.597 3.855l-5.833-3.387L15.124 7.94a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.412-.663zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.974V7.643a.08.08 0 0 1 .033-.062l4.84-2.795a4.504 4.504 0 0 1 6.666 4.676zM8.308 14.077l-2.02-1.164a.08.08 0 0 1-.038-.057V7.27a4.499 4.499 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.096-2.585l2.602-1.503 2.607 1.503v3.01l-2.607 1.504-2.602-1.504z" />
                </svg>
              </div>

              {/* Slack */}
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/80 shadow-xs flex items-center justify-center hover:scale-105 transition-transform" title="Slack Webhooks">
                <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                </svg>
              </div>

              {/* +15 Badge */}
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/80 shadow-xs flex items-center justify-center text-xs font-bold text-zinc-600">
                +15
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 font-mono">
              Meta Cloud API • Isolated Webhooks
            </div>
          </div>
        </div>

        {/* ── CENTER HERO CONTENT ── */}
        <div className="relative z-20 max-w-4xl lg:max-w-5xl mx-auto space-y-6">
          {/* Brand Icon Squircle */}
          <div className="w-16 h-16 rounded-[22px] bg-white border border-zinc-100 shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300">
            <div className="grid grid-cols-2 gap-1.5 w-6 h-6 items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
            </div>
          </div>

          {/* EXACTLY TWO LINES ON DESKTOP & TABLET */}
          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.035em] text-zinc-950 leading-[1.08]">
            <span className="block whitespace-normal sm:whitespace-nowrap">Your WhatsApp can do</span>
            <span className="block text-[#94a3b8] font-extrabold whitespace-normal sm:whitespace-nowrap mt-1 sm:mt-2">
              more than you think.
            </span>
          </h1>

          {/* PERSUASIVE, PROFESSIONAL, HIGH-CONVERTING TAGLINE (NOT GULLIBLE RAW DUMP) */}
          <p className="text-base sm:text-lg lg:text-[19px] text-[#475569] font-normal max-w-2xl mx-auto leading-relaxed pt-1">
            Turn your WhatsApp into an autonomous growth engine. Deliver 24/7 customer support, schedule morning broadcasts hands-free, and filter group spam with zero manual effort.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/request-integration">
              <button className="h-12 px-8 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-sm shadow-[0_8px_20px_rgba(37,99,235,0.28)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.36)] transition-all hover:-translate-y-0.5">
                Request Dedicated Subdomain &amp; Demo
              </button>
            </Link>
            <Link href="/solutions">
              <button className="h-12 px-6 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-700 font-medium text-sm shadow-xs transition-all">
                Explore All Solutions
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
