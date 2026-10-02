"use client";

import React from "react";
import Link from "next/link";
import { Check, Clock3 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
      <div className="relative w-full rounded-[28px] sm:rounded-[36px] border border-zinc-200/90 bg-[#fafafa] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden min-h-[640px] sm:min-h-[700px] lg:min-h-[750px] flex flex-col items-center justify-center text-center px-6 py-20 lg:py-28">
        {/* Subtle Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: "radial-gradient(#d4d4d8 1.1px, transparent 1.1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* ── TOP-LEFT WIDGET: Post-It Sticky Note (Precious Use Case) ── */}
        <div className="hidden md:block absolute top-8 lg:top-12 left-8 lg:left-14 -rotate-3 z-10 transition-transform hover:-rotate-1 duration-300">
          <div className="w-60 lg:w-64 bg-[#fef08a] border border-amber-300/60 shadow-[0_16px_36px_rgba(0,0,0,0.07)] rounded-sm p-4 text-left relative">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-md mx-auto -mt-2 mb-2 border border-red-600/40 relative">
              <span className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/60"></span>
            </div>
            <p className="text-[12px] font-medium text-zinc-800 leading-snug font-sans">
              Precious bridges his penna.dev newsletter straight to WhatsApp Status with a single tap. Zero friction.
            </p>
          </div>
          {/* Floating Checkmark Squircle Button Below Note */}
          <div className="absolute -bottom-8 -right-3 rotate-6 w-14 h-14 rounded-2xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.1)] border border-zinc-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-xs">
              <Check className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* ── TOP-RIGHT WIDGET: Folder Tab Reminder & Stopwatch (Shola 7 AM Drop) ── */}
        <div className="hidden md:block absolute top-8 lg:top-12 right-8 lg:right-14 rotate-2 z-10 transition-transform hover:rotate-1 duration-300">
          <div className="w-60 lg:w-68 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-[0_16px_36px_rgba(0,0,0,0.06)] p-4 text-left relative">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900 mb-2">
              <span>Reminders</span>
              <span className="text-[10px] text-zinc-400 font-normal">Broadcast</span>
            </div>
            <div className="text-[12px] font-semibold text-zinc-800">Today's Showcase</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Shola's daily portfolio drop</p>

            <div className="mt-3 flex items-center gap-1.5 bg-blue-50 text-[#2563eb] px-2.5 py-1 rounded-lg text-[11px] font-semibold w-fit">
              <Clock3 className="h-3.5 w-3.5" />
              <span>07:00 - 07:05 AM</span>
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

        {/* ── BOTTOM-LEFT WIDGET: Tasks & Progress Bars (Auto-Responder) ── */}
        <div className="hidden md:block absolute bottom-8 lg:bottom-12 left-8 lg:left-14 -rotate-1 z-10 transition-transform hover:rotate-0 duration-300">
          <div className="w-64 lg:w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-[0_16px_36px_rgba(0,0,0,0.06)] p-4 text-left space-y-3">
            <div className="text-xs font-bold text-zinc-900">Today's tasks</div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="font-medium text-zinc-800 truncate max-w-[130px]">Client inquiries</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">60%</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0284c7] h-full rounded-full w-[60%]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-zinc-800 truncate max-w-[130px]">Auto-replied &lt; 2s</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold font-mono">100%</span>
              </div>
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[100%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM-RIGHT WIDGET: Integrations & Guardians (Michael Use Case) ── */}
        <div className="hidden md:block absolute bottom-8 lg:bottom-12 right-8 lg:right-14 rotate-1 z-10 transition-transform hover:rotate-0 duration-300">
          <div className="w-64 lg:w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-[0_16px_36px_rgba(0,0,0,0.06)] p-4 text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
              <span>100+ Integrations</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/90 shadow-sm flex items-center justify-center">
                <span className="font-bold text-xs text-indigo-600">P</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 shadow-sm flex items-center justify-center">
                <span className="font-bold text-xs text-emerald-600">WA</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 shadow-sm flex items-center justify-center">
                <span className="font-bold text-xs text-blue-600">API</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-900 shadow-sm flex items-center justify-center text-white font-serif text-xs">
                自
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 font-mono">
              Michael's Group Shield Active
            </div>
          </div>
        </div>

        {/* ── CENTER HERO CONTENT ── */}
        <div className="relative z-20 max-w-3xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-[22px] bg-white border border-zinc-100 shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-transform duration-300">
            <div className="grid grid-cols-2 gap-1.5 w-6 h-6 items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.035em] text-zinc-950 leading-[1.06]">
            Your WhatsApp can do
            <span className="block text-[#94a3b8] font-extrabold mt-1 sm:mt-2">
              more than you think
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-[17px] text-[#475569] font-normal max-w-xl mx-auto leading-relaxed pt-1">
            Efficiently automate status drops, 7 AM designer broadcasts, spam filters &amp; 24/7 auto-responders.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/request-integration">
              <button className="h-12 px-8 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-sm shadow-[0_8px_20px_rgba(37,99,235,0.28)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.36)] transition-all hover:-translate-y-0.5">
                Get free demo
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
