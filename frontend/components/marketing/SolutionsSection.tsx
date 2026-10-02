"use client";

import React from "react";
import Link from "next/link";
import {
  Share2,
  Clock,
  ShieldCheck,
  Check,
  Search,
  Bell,
  SlidersHorizontal,
  Home,
  Layers,
  Inbox,
  Send,
  MoreVertical,
  Play,
  Square,
  CheckSquare,
  Calendar,
} from "lucide-react";

export function SolutionsSection() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      {/* ── Top Header matching Reference ── */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-zinc-700">
          Solutions
        </div>
        <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-normal tracking-[-0.03em] text-zinc-950 leading-[1.15]">
          Solve your team&apos;s biggest challenges
        </h2>
      </div>

      {/* ── 3 Value Columns with Connecting Horizontal Line & Nodes (Matching Reference Screenshot) ── */}
      <div className="relative max-w-5xl mx-auto">
        {/* Connecting Horizontal Line with 3 Anchor Nodes */}
        <div className="hidden md:block absolute top-3 left-10 right-10 h-[1px] bg-zinc-200/80 pointer-events-none z-0">
          <div className="absolute left-[16%] -top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-zinc-300"></div>
          <div className="absolute left-[50%] -top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-zinc-300"></div>
          <div className="absolute left-[84%] -top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-zinc-300"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative z-10 pt-8 md:pt-10">
          {/* Column 1 */}
          <div className="space-y-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 flex items-center justify-center shadow-2xs">
              <Share2 className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              Ensure your audience is always on the same page with 1-tap newsletter status sharing.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 flex items-center justify-center shadow-2xs">
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              Prioritize and broadcast your design work automatically every morning so you win high-ticket retainers.
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              Protect community chats 24/7 without the need for constant manual moderator check-ins.
            </p>
          </div>
        </div>
      </div>

      {/* ── Giant Radiant Cyan Dashboard Console Frame (Matching Reference Screenshot) ── */}
      <div className="relative max-w-6xl mx-auto pt-4">
        {/* Floating 3D '20' Cube Badge on Left */}
        <div className="hidden sm:flex absolute -top-4 -left-3 lg:-left-6 z-20 w-16 h-16 rounded-[22px] bg-white shadow-[0_16px_36px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)] border border-zinc-100 items-center justify-center text-2xl font-extrabold text-zinc-900 -rotate-12 select-none">
          20
        </div>

        {/* Floating 3D Teal Checkmark Squircle on Right */}
        <div className="hidden sm:flex absolute top-12 -right-3 lg:-right-6 z-20 w-16 h-16 rounded-[22px] bg-white shadow-[0_16px_36px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)] border border-zinc-100 items-center justify-center rotate-12 select-none">
          <div className="w-10 h-10 rounded-[14px] bg-[#00c49f] text-white flex items-center justify-center shadow-xs">
            <Check className="h-6 w-6 stroke-[3]" />
          </div>
        </div>

        {/* Radiant Cyan / Sky Blue Outer Frame */}
        <div className="rounded-[32px] sm:rounded-[44px] bg-gradient-to-b from-[#00c0f0] via-[#00b4d8] to-[#0096c7] p-3 sm:p-5 shadow-[0_24px_64px_-12px_rgba(0,180,216,0.35)]">
          {/* Inner Off-White Dashboard Container */}
          <div className="bg-[#f8f9fa] rounded-[24px] sm:rounded-[36px] p-5 sm:p-8 text-left space-y-6 shadow-inner border border-white/60 overflow-hidden">
            
            {/* Top Bar of the Dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/70 pb-4">
              <div className="flex items-center gap-6">
                {/* Brand */}
                <div className="flex items-center gap-2">
                  <div className="grid grid-cols-2 gap-1 w-4 h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
                  </div>
                  <span className="font-bold text-sm text-zinc-900">JidoSapp</span>
                </div>

                <div className="text-xs text-zinc-400 font-medium hidden md:block">
                  Monday, September 30
                </div>
              </div>

              {/* Header Right Tools */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center">
                    <Search className="h-3.5 w-3.5" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center">
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    PO
                  </div>
                  <span className="text-xs font-semibold text-zinc-800">Precious O.</span>
                </div>
              </div>
            </div>

            {/* Greeting + Customize Button */}
            <div className="flex items-center justify-between">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Good morning, Precious
              </h3>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200/80 text-xs font-medium text-zinc-600 shadow-2xs">
                <SlidersHorizontal className="h-3 w-3" />
                <span>Customize</span>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Sidebar + To-Do List (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* To-Do List Card */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-zinc-900">To do list</h4>
                    <span className="text-[11px] font-semibold text-blue-600 cursor-pointer">+ Create new</span>
                  </div>

                  <div className="space-y-2.5 pt-1 text-xs">
                    <div className="flex items-center gap-2.5 text-zinc-700">
                      <div className="w-4 h-4 rounded bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="line-through text-zinc-400">Sync penna.dev status issue #48</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-zinc-700">
                      <div className="w-4 h-4 rounded bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>7:00 AM designer drops broadcast queued</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-zinc-700">
                      <div className="w-4 h-4 rounded border border-zinc-300 shrink-0"></div>
                      <span>Review client automated inquiry transcripts</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-zinc-700">
                      <div className="w-4 h-4 rounded border border-zinc-300 shrink-0"></div>
                      <span>Verify group spam rules &amp; strike limits</span>
                    </div>
                  </div>
                </div>

                {/* Task Assigned Progress Bars */}
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">Tasks assigned</span>
                    <span className="text-[11px] text-zinc-400">Upcoming</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-zinc-800">Status Drop: UI Case Study</span>
                        <span className="font-mono text-zinc-500">60%</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2563eb] h-full rounded-full w-[60%]"></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-zinc-800">Auto-Responder Rate Cards</span>
                        <span className="font-mono text-zinc-500">95%</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[95%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column: Time Tracker (3 Cols) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 text-center space-y-4 shadow-2xs h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                    <span>Time tracker</span>
                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                  </div>

                  <div className="py-4">
                    <div className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-mono tracking-tight">
                      04:21:58
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">Autonomous uptime</div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-200 transition-colors">
                      <Play className="h-4 w-4 fill-zinc-700" />
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors shadow-xs">
                      <Square className="h-4 w-4 fill-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Activity Concentric Circular Gauge (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4 shadow-2xs h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                    <span>Activity</span>
                    <div className="flex items-center text-[10px] text-zinc-400 gap-1.5 font-medium">
                      <span className="text-zinc-900 font-bold underline">weekly</span>
                      <span>daily</span>
                    </div>
                  </div>

                  {/* Concentric Gauge Rings SVG matching screenshot */}
                  <div className="relative w-36 h-36 mx-auto my-1 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Outer Ring Background & Progress (Cyan) */}
                      <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="7" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#00c0f0"
                        strokeWidth="7"
                        strokeDasharray="251.2"
                        strokeDashoffset="75"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* Middle Ring Background & Progress (Orange) */}
                      <circle cx="50" cy="50" r="30" stroke="#f1f5f9" strokeWidth="7" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="30"
                        stroke="#f97316"
                        strokeWidth="7"
                        strokeDasharray="188.4"
                        strokeDashoffset="60"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* Inner Ring Background & Progress (Emerald) */}
                      <circle cx="50" cy="50" r="20" stroke="#f1f5f9" strokeWidth="7" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="20"
                        stroke="#10b981"
                        strokeWidth="7"
                        strokeDasharray="125.6"
                        strokeDashoffset="45"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* Metric Legend */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-zinc-100">
                    <div>
                      <div className="text-[10px] text-zinc-400">Working hours</div>
                      <div className="font-bold text-zinc-900 text-xs">29/40</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400">Tasks done</div>
                      <div className="font-bold text-zinc-900 text-xs">8/12</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400">Automations</div>
                      <div className="font-bold text-zinc-900 text-xs">4/7</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
