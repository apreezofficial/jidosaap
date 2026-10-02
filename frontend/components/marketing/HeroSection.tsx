"use client";

import React from "react";
import Link from "next/link";
import { Check, Clock3 } from "lucide-react";
import { JidoSappIcon } from "@/components/ui/logo";
import {
  WhatsAppLogo,
  ProformsLogo,
  StripeLogo,
  OpenAILogo,
  SlackLogo,
} from "./IntegrationLogos";

export function HeroSection() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
      {/* Hero Canvas Container with Subtle Border and Soft Off-White Background */}
      <div className="relative w-full rounded-[32px] sm:rounded-[40px] border border-zinc-200/80 bg-[#fbfbfd] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.04)] overflow-hidden min-h-[660px] sm:min-h-[720px] lg:min-h-[760px] flex flex-col items-center justify-center text-center px-6 py-20 lg:py-28">
        
        {/* Soft, Almost Invisible Gray Grid Texture (Matching Reference Screenshot) */}
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-45 mix-blend-multiply"
          style={{
            backgroundImage: "url('/hero-pattern.png')",
          }}
        />

        {/* ── TOP-LEFT FLOATING PANEL: Partially Entering from Edge (Physical Floating Paper Feel) ── */}
        <div className="hidden md:block absolute -top-1 lg:top-8 -left-4 lg:-left-2 xl:left-6 -rotate-2 z-10 transition-transform hover:-rotate-1 duration-300">
          <div className="w-64 lg:w-70 bg-[#fef9c3] border border-amber-300/50 shadow-[0_16px_36px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.02)] rounded-[18px] p-4 text-left relative">
            {/* Small Push-Pin Detail */}
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm mx-auto -mt-2.5 mb-2 border border-white/80 relative">
              <span className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/70"></span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/80 font-mono mb-1">
              Live Automation
            </div>
            <div className="text-[13px] font-bold text-zinc-900 leading-snug">
              24/7 Customer Auto-Support
            </div>
            <p className="text-[11px] font-normal text-zinc-800/90 mt-1 leading-relaxed font-sans">
              Instant responses to client inquiries, rates delivery &amp; meeting booking—even while you sleep.
            </p>
          </div>
          {/* Floating Subtle Checkmark Squircle */}
          <div className="absolute -bottom-6 -right-2 rotate-6 w-12 h-12 rounded-[16px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-zinc-100 flex items-center justify-center">
            <div className="w-7 h-7 rounded-xl bg-[#2563eb] text-white flex items-center justify-center">
              <Check className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* ── TOP-RIGHT FLOATING PANEL: Partially Entering from Edge ── */}
        <div className="hidden md:block absolute -top-1 lg:top-8 -right-4 lg:-right-2 xl:right-6 rotate-2 z-10 transition-transform hover:rotate-1 duration-300">
          <div className="w-64 lg:w-70 bg-white/95 backdrop-blur-sm rounded-[22px] border border-zinc-200/70 shadow-[0_16px_36px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.02)] p-4 text-left relative">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900 mb-1">
              <span>Scheduled Broadcast</span>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50/90 px-2 py-0.5 rounded-full">Automated</span>
            </div>
            <div className="text-[13px] font-bold text-zinc-900">7:00 AM Morning Drop</div>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
              Hands-free daily portfolio &amp; status showcase dispatched consistently.
            </p>

            <div className="mt-3 flex items-center gap-1.5 bg-blue-50/80 text-[#2563eb] px-2.5 py-1 rounded-lg text-[11px] font-semibold w-fit border border-blue-100/60">
              <Clock3 className="h-3.5 w-3.5" />
              <span>07:00 AM Sharp • Cron Active</span>
            </div>
          </div>

          {/* Floating Subtle Stopwatch Squircle */}
          <div className="absolute -top-3 -left-8 -rotate-6 w-12 h-12 rounded-[16px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-zinc-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-900 flex items-center justify-center relative">
              <span className="w-0.5 h-2.5 bg-red-500 rounded -mt-1.5"></span>
              <span className="absolute top-1 right-1.5 w-1 h-0.5 bg-zinc-900"></span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM-LEFT FLOATING PANEL: Partially Entering from Bottom Edge ── */}
        <div className="hidden md:block absolute -bottom-2 lg:bottom-8 -left-4 lg:-left-2 xl:left-6 -rotate-1 z-10 transition-transform hover:rotate-0 duration-300">
          <div className="w-70 lg:w-76 bg-white/95 backdrop-blur-sm rounded-[22px] border border-zinc-200/70 shadow-[0_16px_36px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.02)] p-4 text-left space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-zinc-900">Automated Workflows</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-medium text-emerald-600">Active</span>
              </div>
            </div>

            {/* Task 1: 24/7 Inquiries */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
                  <span className="font-medium text-zinc-700">24/7 Client Auto-Support</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">&lt; 2s reply</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2563eb] h-full rounded-full w-[100%]"></div>
              </div>
            </div>

            {/* Task 2: Morning Drop */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-zinc-700">7:00 AM Daily Broadcast</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold font-mono">Completed</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[100%]"></div>
              </div>
            </div>

            {/* Task 3: Spam Shield */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span className="font-medium text-zinc-700">Anti-Spam Group Shield</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">18 blocked</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM-RIGHT FLOATING PANEL: Partially Entering from Bottom Edge ── */}
        <div className="hidden md:block absolute -bottom-2 lg:bottom-8 -right-4 lg:-right-2 xl:right-6 rotate-1 z-10 transition-transform hover:rotate-0 duration-300">
          <div className="w-70 lg:w-76 bg-white/95 backdrop-blur-md rounded-[22px] border border-zinc-200/70 shadow-[0_16px_36px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.02)] p-4 text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
              <span>20+ Essential Integrations</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>

            {/* Clean SVG Brand Badges */}
            <div className="flex items-center gap-2 pt-0.5">
              {/* WhatsApp */}
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 shadow-2xs flex items-center justify-center p-1.5" title="WhatsApp Official API">
                <WhatsAppLogo className="w-5 h-5" />
              </div>

              {/* Proforms */}
              <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center p-1.5" title="Proforms">
                <ProformsLogo className="w-5 h-5" />
              </div>

              {/* Stripe */}
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 shadow-2xs flex items-center justify-center p-1.5" title="Stripe Billing">
                <StripeLogo className="w-5 h-5" />
              </div>

              {/* OpenAI */}
              <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 shadow-2xs flex items-center justify-center p-1.5" title="OpenAI Intelligence">
                <OpenAILogo className="w-5 h-5" />
              </div>

              {/* Slack */}
              <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200/80 shadow-2xs flex items-center justify-center p-1.5" title="Slack Webhooks">
                <SlackLogo className="w-5 h-5" />
              </div>

              {/* +15 Badge */}
              <div className="w-9 h-9 rounded-xl bg-zinc-100/90 border border-zinc-200/60 shadow-2xs flex items-center justify-center text-xs font-bold text-zinc-500">
                +15
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 font-mono">
              Meta Cloud API • Isolated Webhooks
            </div>
          </div>
        </div>

        {/* ── CENTER HERO CONTENT: CLEAN, FOCUSED, LOTS OF BREATHING ROOM ── */}
        <div className="relative z-20 max-w-4xl lg:max-w-5xl mx-auto space-y-6">
          {/* Official JidoSapp Icon Above Headline */}
          <div className="w-14 h-14 rounded-[20px] bg-white border border-zinc-100 shadow-[0_12px_28px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.03)] flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300 p-2.5">
            <JidoSappIcon className="w-full h-full" />
          </div>

          {/* EXACT TYPOGRAPHY: PLUS JAKARTA SANS 400 (REGULAR), 56PX, -2PX TRACKING, 1.0 LINE-HEIGHT */}
          <h1
            className="text-3xl sm:text-5xl lg:text-[56px] font-normal leading-[1.0] max-w-4xl mx-auto"
            style={{
              fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif',
              letterSpacing: "-2px",
              fontWeight: 400,
            }}
          >
            <span className="block text-zinc-950 whitespace-normal sm:whitespace-nowrap font-normal">
              Your WhatsApp can do
            </span>
            <span className="block text-[#9ca3af] whitespace-normal sm:whitespace-nowrap mt-1 sm:mt-1.5 font-normal">
              more than you think.
            </span>
          </h1>

          {/* EXACT TEXT PRESERVED: SUBTITLE */}
          <p className="text-base sm:text-lg lg:text-[18px] text-zinc-500 font-normal max-w-2xl mx-auto leading-relaxed pt-1">
            Turn your WhatsApp into an autonomous growth engine. Deliver 24/7 customer support, schedule morning broadcasts hands-free, and filter group spam with zero manual effort.
          </p>

          {/* EXACT TEXT PRESERVED: CTAS */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/request-integration">
              <button className="h-11 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs shadow-[0_4px_14px_rgba(37,99,235,0.22)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5">
                Request Demo
              </button>
            </Link>
            <Link href="/solutions">
              <button className="h-11 px-6 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-700 font-medium text-xs shadow-2xs transition-all">
                Explore Solutions
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
