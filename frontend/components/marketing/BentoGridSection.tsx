"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  Lock,
  Globe,
  Radio,
  TrendingUp,
  Zap,
  ArrowRight,
  Send,
  ShieldCheck,
  Bot,
  Copy,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BentoGridSection() {
  // Card 3 Interactive Auto-Responder Simulator State
  const [selectedPrompt, setSelectedPrompt] = useState<string>("What are your retainer rates?");
  const [activeReply, setActiveReply] = useState<{ text: string; link?: string }>({
    text: "Our retainers start at $1,800/mo. Here is our booking link:",
    link: "cal.com/jido",
  });
  const [isTyping, setIsTyping] = useState(false);

  // Card 4 Subdomain Copy State
  const [copied, setCopied] = useState(false);

  const handlePromptSelect = (prompt: string, replyText: string, link?: string) => {
    if (selectedPrompt === prompt || isTyping) return;
    setSelectedPrompt(prompt);
    setIsTyping(true);
    setTimeout(() => {
      setActiveReply({ text: replyText, link });
      setIsTyping(false);
    }, 450);
  };

  const handleCopySubdomain = () => {
    navigator.clipboard?.writeText("https://yourbrand.jidosaap.xyz");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 select-none">
      {/* ── SECTION HEADER (Outfit Font Family & Exact Sizing) ── */}
      <div className="text-center space-y-3.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
          <span>Core Superpowers</span>
        </div>
        <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-normal tracking-[-0.03em] text-zinc-950 leading-[1.15]">
          Keep everything in one place
        </h2>
        <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-normal max-w-xl mx-auto">
          Four dedicated engines working in lockstep to keep your WhatsApp channel active, converting, and organized 24 hours a day.
        </p>
      </div>

      {/* ── 2x2 BENTO GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        {/* ── BENTO CARD 1: Seamless Newsletter Publishing (Penna.dev Status Bridge) ── */}
        <div className="group rounded-[32px] border border-zinc-200/90 bg-white p-7 sm:p-9 space-y-6 shadow-xs hover:border-[#2563eb]/50 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          {/* Visual Showcase Panel */}
          <div className="h-60 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/40 rounded-[24px] border border-zinc-200/80 p-5 flex flex-col justify-between relative overflow-hidden group-hover:border-indigo-200 transition-colors">
            {/* Top Status Ring Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full p-[1.5px] bg-gradient-to-tr from-[#2563eb] to-[#00b4d8]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-zinc-800 font-mono tracking-tight">
                  penna.dev status bridge
                </span>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                1-Tap Sync
              </span>
            </div>

            {/* Simulated Live Post Card with Floating Lift */}
            <div className="relative z-10 bg-white rounded-2xl border border-zinc-200/90 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.04)] space-y-2.5 transition-transform duration-300 group-hover:-translate-y-0.5">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                    PO
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 leading-tight block">Precious Okon</span>
                    <span className="text-zinc-400 font-mono text-[9px]">Founder @ penna.dev</span>
                  </div>
                </div>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-100">
                  Live
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-900 leading-snug">
                  User Experience: the gateway to recurring retention
                </p>
                <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5 font-normal">
                  How high-velocity founders automate customer trust directly in WhatsApp...
                </p>
              </div>

              {/* Status Bridge Pill */}
              <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100 text-[10px]">
                <span className="font-mono text-[#2563eb] font-semibold">
                  jido.to/penna-48
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>1-Tap published directly to status</span>
                </span>
              </div>
            </div>

            {/* Subtle Glow Beam */}
            <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Copy Description */}
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
              Seamless Newsletter Publishing
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Precious publishes on <span className="font-semibold text-zinc-900">penna.dev</span> and with a single tap, JidoSapp bridges the formatted update and tracked link to WhatsApp Status.
            </p>
          </div>
        </div>

        {/* ── BENTO CARD 2: Consistency & Schedule Engines (07:00 AM Drops) ── */}
        <div className="group rounded-[32px] border border-zinc-200/90 bg-white p-7 sm:p-9 space-y-6 shadow-xs hover:border-[#2563eb]/50 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          {/* Visual Showcase Panel */}
          <div className="h-60 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/40 rounded-[24px] border border-zinc-200/80 p-5 flex flex-col justify-between relative overflow-hidden group-hover:border-blue-200 transition-colors">
            {/* Top Bar with Cron Indicator */}
            <div className="flex items-center justify-between text-xs z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
                <span className="font-bold text-zinc-800 font-mono text-[11px]">
                  Daily Cron Drop
                </span>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Active 07:00 AM Sharp</span>
              </span>
            </div>

            {/* Split Metrics Showcase */}
            <div className="grid grid-cols-2 gap-3.5 my-auto z-10">
              <div className="bg-white rounded-2xl border border-zinc-200/90 p-4 shadow-xs text-left group-hover:border-blue-200 transition-colors">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Daily Cron Drop
                </div>
                <div className="text-3xl font-extrabold text-[#2563eb] font-mono tracking-tight mt-1">
                  07:00 AM
                </div>
                <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#2563eb]" />
                  <span className="font-semibold text-zinc-700">Autonomous Dispatch</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200/90 p-4 shadow-xs text-left group-hover:border-emerald-200 transition-colors">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Client Inquiries
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 font-mono tracking-tight mt-1">
                  +340%
                </div>
                <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span className="font-semibold text-zinc-700">Influenced Volume</span>
                </div>
              </div>
            </div>

            {/* Bottom Target Audience Bar */}
            <div className="bg-white rounded-xl border border-zinc-200/80 px-3.5 py-2 flex items-center justify-between text-[11px] shadow-2xs z-10">
              <span className="text-zinc-600 font-medium">Broadcast Audience</span>
              <span className="font-bold text-zinc-900 font-mono">1,240 subscribers</span>
            </div>

            {/* Ambient Background Radial */}
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Copy Description */}
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
              Consistency &amp; Schedule Engines
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Optimize your workflow with scheduled morning drops. Shola queues his designs in advance, ensuring daily client visibility without waking up early.
            </p>
          </div>
        </div>

        {/* ── BENTO CARD 3: 24/7 Zero-Latency Auto-Responder (Interactive Prompts) ── */}
        <div className="group rounded-[32px] border border-zinc-200/90 bg-white p-7 sm:p-9 space-y-6 shadow-xs hover:border-[#2563eb]/50 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          {/* Visual Showcase Panel: Realtime Simulated Dialogue */}
          <div className="h-60 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/40 rounded-[24px] border border-zinc-200/80 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group-hover:border-blue-200 transition-colors">
            {/* Quick Test Prompt Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 z-10">
              <button
                type="button"
                onClick={() =>
                  handlePromptSelect(
                    "What are your retainer rates?",
                    "Our retainers start at $1,800/mo. Here is our booking link:",
                    "cal.com/jido"
                  )
                }
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors border",
                  selectedPrompt === "What are your retainer rates?"
                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                )}
              >
                Rates?
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePromptSelect(
                    "Can we schedule a 15-min call?",
                    "Definitely! Pick a convenient slot on my calendar right here:",
                    "cal.com/precious"
                  )
                }
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors border",
                  selectedPrompt === "Can we schedule a 15-min call?"
                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                )}
              >
                Book Call?
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePromptSelect(
                    "Send me your portfolio PDF",
                    "Here is our latest 2026 brand identity portfolio & deck:",
                    "jido.to/deck"
                  )
                }
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors border",
                  selectedPrompt === "Send me your portfolio PDF"
                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                )}
              >
                Portfolio?
              </button>
            </div>

            {/* Client Inquiry (02:14 AM) */}
            <div className="bg-white rounded-2xl rounded-tl-sm border border-zinc-200/90 p-3 shadow-xs max-w-[85%] text-left space-y-1 transition-all z-10">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#2563eb] tracking-tight">Client Inquiry (02:14 AM)</span>
                <span className="text-zinc-400 font-mono">02:14 AM</span>
              </div>
              <p className="text-xs font-semibold text-zinc-800 leading-snug">
                &ldquo;{selectedPrompt}&rdquo;
              </p>
            </div>

            {/* Outgoing Autonomous JidoSapp Auto-Reply (02:14 AM) */}
            <div className="bg-[#2563eb] text-white rounded-2xl rounded-tr-sm p-3.5 shadow-md max-w-[92%] ml-auto text-left space-y-1 transition-all z-10">
              <div className="flex items-center justify-between text-[10px] text-blue-100">
                <span className="font-bold flex items-center gap-1">
                  <Bot className="w-3 h-3 text-cyan-300" />
                  <span>Auto-Responder (02:14 AM)</span>
                </span>
                <span className="font-mono flex items-center gap-1">
                  <span>02:14 AM</span>
                  <CheckCheck className="w-3 h-3 text-cyan-300 stroke-[2.5]" />
                </span>
              </div>
              {isTyping ? (
                <div className="flex items-center gap-1 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                </div>
              ) : (
                <p className="text-xs font-normal leading-relaxed text-white">
                  &ldquo;{activeReply.text}{" "}
                  {activeReply.link && (
                    <span className="underline decoration-cyan-300 font-mono font-medium">
                      {activeReply.link}
                    </span>
                  )}
                  &rdquo;
                </p>
              )}
            </div>

            {/* Sub-2s Speed indicator */}
            <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 z-10">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Response time: 1.2s</span>
              </span>
              <span className="font-mono text-zinc-400">Captured to CRM</span>
            </div>
          </div>

          {/* Copy Description */}
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
              24/7 Zero-Latency Auto-Responder
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Never leave potential clients on &ldquo;read&rdquo;. Automatically answer pricing questions, send booking links, and capture qualified leads into CRM.
            </p>
          </div>
        </div>

        {/* ── BENTO CARD 4: Dedicated Isolated Subdomains (*.jidosaap.xyz) ── */}
        <div className="group rounded-[32px] border-2 border-dashed border-zinc-300/90 bg-gradient-to-b from-[#fafafa] to-white p-7 sm:p-9 space-y-6 shadow-xs hover:border-[#2563eb] hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          {/* Visual Showcase Panel */}
          <div className="h-60 bg-gradient-to-br from-zinc-50 via-white to-blue-50/40 rounded-[24px] border border-zinc-200/80 p-5 flex flex-col items-center justify-center space-y-3.5 relative overflow-hidden group-hover:border-blue-300 transition-colors">
            {/* Dynamic Uptime Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-[11px] font-mono font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>04:21 Uptime</span>
              <span className="text-zinc-600">•</span>
              <span className="text-cyan-300 font-mono">100% Isolated</span>
            </div>

            {/* URL Browser Bar Capsule with Interactive Copy */}
            <div
              onClick={handleCopySubdomain}
              className="w-full max-w-sm bg-white rounded-2xl border border-zinc-200/90 p-3 shadow-xs flex items-center justify-between gap-2 cursor-pointer hover:border-[#2563eb] transition-all"
              title="Click to copy subdomain"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-900 truncate">
                  https://yourbrand.jidosaap.xyz
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </span>
            </div>

            {/* Webhook & Meta Instance Tag */}
            <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                Dedicated Webhooks
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                Multi-Tenant Cloud API
              </span>
            </div>
          </div>

          {/* Copy Description */}
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
              Dedicated Isolated Subdomains
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Every client gets their own dedicated <code className="font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">*.jidosaap.xyz</code> subdomain with an isolated WhatsApp Cloud API instance.
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM TEASER BADGE ── */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-100/80 border border-zinc-200/70 text-xs font-medium text-zinc-600">
          <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>and a lot more superpowers...</span>
          <Link
            href="/solutions"
            className="text-[#2563eb] font-semibold hover:underline flex items-center gap-1 ml-1"
          >
            <span>Explore all capabilities</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
