"use client";

import React, { useEffect, useRef, useState } from "react";
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
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BentoGridSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14 select-none"
    >
      {/* ── SECTION HEADER (Matching Exact Outfit Styling & Reference Phrase) ── */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
          <span>Core Superpowers</span>
        </div>
        <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-normal tracking-[-0.03em] text-zinc-950 leading-[1.15]">
          Keep everything in one place
        </h2>
        <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-normal max-w-xl mx-auto">
          Four purpose-built engines working in lockstep to keep your WhatsApp channel active, converting, and organized 24 hours a day.
        </p>
      </div>

      {/* ── 2x2 BENTO GRID WITH STAGGERED SCROLL ENTRANCE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* ── BENTO CARD 1: Seamless Newsletter Publishing (Penna.dev Status Bridge) ── */}
        <div
          className={cn(
            "group rounded-[32px] border border-zinc-200/90 bg-white p-7 sm:p-9 space-y-6 shadow-xs hover:border-[#2563eb]/40 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] transition-all duration-700 ease-out flex flex-col justify-between transform",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          {/* Visual Showcase Panel */}
          <div className="h-56 sm:h-60 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/50 rounded-[24px] border border-zinc-200/70 p-5 flex flex-col justify-center relative overflow-hidden group-hover:border-indigo-200 transition-colors">
            {/* Top Status Ring Header */}
            <div className="flex items-center justify-between mb-3 z-10">
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
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                1-Tap Sync
              </span>
            </div>

            {/* Simulated Live Post Card */}
            <div className="relative z-10 bg-white rounded-2xl border border-zinc-200/90 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] space-y-2.5 transition-transform duration-300 group-hover:-translate-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center">
                    PO
                  </div>
                  <span className="font-semibold text-zinc-900">Precious Okon</span>
                </div>
                <span className="text-zinc-400 font-mono text-[10px]">Just now</span>
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-900 leading-snug">
                  User Experience: the gateway to recurring retention
                </p>
                <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                  How high-velocity founders automate customer trust directly in WhatsApp...
                </p>
              </div>

              {/* Status Bridge Pill */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[10px]">
                <span className="font-mono text-[#2563eb] font-semibold">
                  jido.to/penna-48
                </span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Published to Status</span>
                </span>
              </div>
            </div>

            {/* Subtle Glow Beam in background */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
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
        <div
          className={cn(
            "group rounded-[32px] border border-zinc-200/90 bg-white p-7 sm:p-9 space-y-6 shadow-xs hover:border-[#2563eb]/40 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] transition-all duration-700 ease-out flex flex-col justify-between transform",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          )}
          style={{ transitionDelay: "220ms" }}
        >
          {/* Visual Showcase Panel */}
          <div className="h-56 sm:h-60 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/50 rounded-[24px] border border-zinc-200/70 p-5 flex flex-col justify-between relative overflow-hidden group-hover:border-blue-200 transition-colors">
            {/* Top Bar with Cron Indicator */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-800 font-mono text-[11px]">
                07:00 AM Sharp • Cron Active
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Dispatched</span>
              </span>
            </div>

            {/* Split Metrics Showcase */}
            <div className="grid grid-cols-2 gap-3 my-auto">
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-3.5 shadow-xs text-left">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Daily Drop
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#2563eb] font-mono tracking-tight mt-0.5">
                  07:00 AM
                </div>
                <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>Scheduled Daily</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-200/80 p-3.5 shadow-xs text-left">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Client Inquiries
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tracking-tight mt-0.5">
                  +340%
                </div>
                <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>Influenced volume</span>
                </div>
              </div>
            </div>

            {/* Bottom Target Audience Bar */}
            <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-zinc-200/70 px-3 py-1.5 flex items-center justify-between text-[11px]">
              <span className="text-zinc-600 font-medium">Broadcast Audience</span>
              <span className="font-bold text-zinc-900 font-mono">1,240 subscribers</span>
            </div>
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

        {/* ── BENTO CARD 3: 24/7 Zero-Latency Auto-Responder ── */}
        <div
          className={cn(
            "group rounded-[32px] border border-zinc-200/90 bg-white p-7 sm:p-9 space-y-6 shadow-xs hover:border-[#2563eb]/40 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] transition-all duration-700 ease-out flex flex-col justify-between transform",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          )}
          style={{ transitionDelay: "340ms" }}
        >
          {/* Visual Showcase Panel: Realtime Simulated Dialogue */}
          <div className="h-56 sm:h-60 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/50 rounded-[24px] border border-zinc-200/70 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group-hover:border-blue-200 transition-colors">
            {/* Incoming Client Chat Bubble (02:14 AM) */}
            <div className="bg-white rounded-2xl rounded-tl-sm border border-zinc-200/90 p-3 shadow-xs max-w-[85%] text-left space-y-1 transition-transform duration-200 group-hover:-translate-x-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#2563eb] tracking-tight">Client Inquiry</span>
                <span className="text-zinc-400 font-mono">02:14 AM</span>
              </div>
              <p className="text-xs font-medium text-zinc-800 leading-snug">
                &ldquo;What are your retainer rates?&rdquo;
              </p>
            </div>

            {/* Outgoing Autonomous JidoSapp Auto-Reply (02:14 AM - Sub 2s) */}
            <div className="bg-[#2563eb] text-white rounded-2xl rounded-tr-sm p-3.5 shadow-md max-w-[90%] ml-auto text-left space-y-1.5 transition-transform duration-200 group-hover:translate-x-1">
              <div className="flex items-center justify-between text-[10px] text-blue-100">
                <span className="font-bold flex items-center gap-1">
                  <Bot className="w-3 h-3 text-cyan-300" />
                  <span>Auto-Responder</span>
                </span>
                <span className="font-mono flex items-center gap-1">
                  <span>02:14 AM</span>
                  <CheckCheck className="w-3 h-3 text-cyan-300" />
                </span>
              </div>
              <p className="text-xs font-normal leading-relaxed text-white">
                &ldquo;Our retainers start at $1,800/mo. Here is our booking link:{" "}
                <span className="underline decoration-cyan-300 font-mono font-medium">cal.com/jido</span>&rdquo;
              </p>
            </div>

            {/* Sync to CRM status chip */}
            <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Response time: 1.2s</span>
              </span>
              <span className="font-mono text-zinc-400">Lead synced to CRM</span>
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
        <div
          className={cn(
            "group rounded-[32px] border-2 border-dashed border-zinc-300/90 bg-gradient-to-b from-[#fafafa] to-white p-7 sm:p-9 space-y-6 shadow-xs hover:border-[#2563eb] hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] transition-all duration-700 ease-out flex flex-col justify-between transform",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          )}
          style={{ transitionDelay: "460ms" }}
        >
          {/* Visual Showcase Panel: Dedicated Server & Subdomain Capsule */}
          <div className="h-56 sm:h-60 bg-gradient-to-br from-zinc-50 via-white to-blue-50/40 rounded-[24px] border border-zinc-200/80 p-5 flex flex-col items-center justify-center space-y-4 relative overflow-hidden group-hover:border-blue-300 transition-colors">
            {/* Dynamic Uptime Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-mono font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>04:21 Uptime</span>
              <span className="text-zinc-500">•</span>
              <span className="text-cyan-300 font-mono">100% Isolated</span>
            </div>

            {/* URL Browser Bar Capsule */}
            <div className="w-full max-w-sm bg-white rounded-2xl border border-zinc-200/90 p-3 shadow-sm flex items-center justify-between gap-2 group-hover:scale-102 transition-transform duration-200">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-900 truncate">
                  https://yourbrand.jidosaap.xyz
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                SSL Active
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
                Cloud API Multi-Tenant
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
