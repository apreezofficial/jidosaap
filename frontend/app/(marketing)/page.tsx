"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  Globe,
  Newspaper,
  Palette,
  ShieldAlert,
  Bot,
  Check,
  RotateCcw,
  Play,
  Flame,
  Users,
  MessageSquare,
  AlertTriangle,
  Clock3,
  ExternalLink,
  ChevronRight,
  Share2,
  SlidersHorizontal,
  FolderKanban,
  Calendar,
  Layers,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function LandingPage() {
  // Subdomain Claimer State
  const [subdomainQuery, setSubdomainQuery] = useState("");
  const [checkStatus, setCheckStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [checkMessage, setCheckMessage] = useState("");

  // Interactive Demo 1: Precious (penna.dev newsletter bridge)
  const [preciousPublished, setPreciousPublished] = useState(false);
  const [preciousViews, setPreciousViews] = useState(384);

  // Interactive Demo 2: Shola (7 AM Graphic Designer Drop)
  const [sholaInquiryCount, setSholaInquiryCount] = useState(6);
  const [sholaTriggered, setSholaTriggered] = useState(false);

  // Interactive Demo 3: Michael (Group Spam Guardian)
  const [michaelSpamCount, setMichaelSpamCount] = useState(0);
  const [michaelLog, setMichaelLog] = useState<Array<{ id: number; text: string; type: "normal" | "warning" | "kicked" }>>([
    { id: 1, text: "Sarah: Has anyone reviewed the new React 19 documentation?", type: "normal" },
    { id: 2, text: "David: Yes! Server actions are much simpler now.", type: "normal" },
  ]);

  // Interactive Demo 4: Auto-Responder
  const [autoChatLog, setAutoChatLog] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    { sender: "user", text: "Hey! What are your rates for a 3-month brand design retainer?", time: "02:14 AM" },
    { sender: "bot", text: "Hi there! 👋 Thanks for reaching out. Our design retainers start at $1,800/mo including unlimited revisions. Would you like to view our portfolio or book a 15-min discovery call?", time: "02:14 AM" },
  ]);
  const [testUserMsg, setTestUserMsg] = useState("");

  const handleCheckSubdomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = subdomainQuery.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!clean || clean.length < 3) {
      setCheckStatus("taken");
      setCheckMessage("Subdomain must be at least 3 characters");
      return;
    }
    setCheckStatus("checking");
    setTimeout(() => {
      const reserved = ["api", "admin", "www", "app", "root"];
      if (reserved.includes(clean)) {
        setCheckStatus("taken");
        setCheckMessage(`${clean}.jidosaap.xyz is reserved by system.`);
      } else {
        setCheckStatus("available");
        setCheckMessage(`Available! Your dedicated instance will live at ${clean}.jidosaap.xyz`);
      }
    }, 350);
  };

  const handlePreciousPublish = () => {
    setPreciousPublished(true);
    setPreciousViews((prev) => prev + 24);
  };

  const handleSholaTriggerDrop = () => {
    setSholaTriggered(true);
    setSholaInquiryCount((prev) => prev + 1);
  };

  const handleMichaelSimulateSpam = () => {
    const nextCount = michaelSpamCount + 1;
    setMichaelSpamCount(nextCount);

    if (nextCount === 1) {
      setMichaelLog((prev) => [
        ...prev,
        { id: Date.now(), text: "CryptoBot99: 🔥 Claim Free $5000 USDT Now -> http://bit.ly/scam999", type: "warning" },
        { id: Date.now() + 1, text: "🛡️ JidoSapp Guardian: [Strike 1/2] Unauthorized link deleted. Warning issued to CryptoBot99.", type: "warning" },
      ]);
    } else {
      setMichaelLog((prev) => [
        ...prev,
        { id: Date.now(), text: "CryptoBot99: CLICK BEFORE EXPIRED: t.me/fast_money_scam", type: "kicked" },
        { id: Date.now() + 1, text: "🚫 JidoSapp Guardian: [Strike 2/2 Maximum Reached] Spam deleted. Offender CryptoBot99 has been exited from the group.", type: "kicked" },
      ]);
    }
  };

  const handleMichaelReset = () => {
    setMichaelSpamCount(0);
    setMichaelLog([
      { id: 1, text: "Sarah: Has anyone reviewed the new React 19 documentation?", type: "normal" },
      { id: 2, text: "David: Yes! Server actions are much simpler now.", type: "normal" },
    ]);
  };

  const handleSendAutoChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUserMsg.trim()) return;

    const userText = testUserMsg;
    setTestUserMsg("");
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setAutoChatLog((prev) => [...prev, { sender: "user", text: userText, time: nowTime }]);

    setTimeout(() => {
      let reply = "Got it! Our automated assistant has recorded your request and notified the team. You'll receive a full response shortly.";
      if (userText.toLowerCase().includes("pricing") || userText.toLowerCase().includes("rate")) {
        reply = "Our plans start at $15/mo for individuals up to $99/mo for enterprise setups. All include a dedicated *.jidosaap.xyz subdomain!";
      } else if (userText.toLowerCase().includes("call") || userText.toLowerCase().includes("book")) {
        reply = "You can book directly on our calendar here: cal.com/jidosaap-demo. Looking forward to speaking!";
      }
      setAutoChatLog((prev) => [...prev, { sender: "bot", text: reply, time: nowTime }]);
    }, 600);
  };

  return (
    <div className="space-y-32 pb-32">
      {/* ─── 1. HERO SECTION (EXACT STRUCTURE & SIZING FROM INSPIRATION) ─── */}
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

      {/* ─── 2. "SOLUTIONS" SECTION (MATCHING SCREENSHOT 1: media_1790959521082.png) ─── */}
      <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
            Solutions
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
            Solve your team's biggest challenges
          </h2>
        </div>

        {/* 3 Value Pillars with Connecting Dots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left relative pt-4">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              <strong>1-Tap Bridge (Precious):</strong> Ensure your audience is always reading your latest penna.dev issues with single-tap status sharing.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0284c7] flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              <strong>7:00 AM Drops (Shola):</strong> Prioritize and broadcast your design work automatically every morning so you win high-ticket retainers.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              <strong>Group Shield (Michael):</strong> Keep community chats clean and protected 24/7 without constant manual moderator check-ins.
            </p>
          </div>
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

      {/* ─── 3. BENTO GRID FEATURES (MATCHING SCREENSHOT 2: media_1790959532339.png) ─── */}
      <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bento Card 1: Seamless Collaboration / Penna.dev Status Bridge */}
          <div className="rounded-[28px] border border-zinc-200/90 bg-white p-8 sm:p-10 space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-44 bg-[#fafafa] rounded-2xl border border-zinc-100 p-4 flex flex-col justify-center relative overflow-hidden">
              <div className="bg-white rounded-xl border border-zinc-200 p-3 shadow-md w-fit max-w-[280px] space-y-1 -rotate-2">
                <div className="text-[10px] font-bold text-indigo-600">penna.dev status bridge</div>
                <div className="text-xs font-bold text-zinc-900 truncate">User Experience: the gateway...</div>
                <div className="text-[10px] text-zinc-400">1-Tap published directly to status</div>
              </div>
            </div>
            <div className="space-y-2 text-left">
              <h3 className="text-xl font-bold text-zinc-950">Seamless Newsletter Publishing</h3>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
                Precious publishes on penna.dev and with a single tap, JidoSapp bridges the formatted update and tracked link to WhatsApp Status.
              </p>
            </div>
          </div>

          {/* Bento Card 2: Time Management Tools / Shola 7 AM Drops */}
          <div className="rounded-[28px] border border-zinc-200/90 bg-white p-8 sm:p-10 space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-44 bg-[#fafafa] rounded-2xl border border-zinc-100 p-4 flex items-center justify-around relative overflow-hidden">
              <div className="text-center space-y-1">
                <div className="text-xl font-extrabold text-[#0284c7] font-mono">07:00 AM</div>
                <div className="text-[10px] text-zinc-400">Daily Cron Drop</div>
              </div>
              <div className="h-20 w-px bg-zinc-200"></div>
              <div className="text-center space-y-1">
                <div className="text-xl font-extrabold text-emerald-600 font-mono">+340%</div>
                <div className="text-[10px] text-zinc-400">Client Inquiries</div>
              </div>
            </div>
            <div className="space-y-2 text-left">
              <h3 className="text-xl font-bold text-zinc-950">Consistency &amp; Schedule Engines</h3>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
                Optimize your workflow with scheduled morning drops. Shola queues his designs in advance, ensuring daily client visibility without waking up early.
              </p>
            </div>
          </div>

          {/* Bento Card 3: Advanced Lead Tracking & 24/7 Auto-Responder */}
          <div className="rounded-[28px] border border-zinc-200/90 bg-white p-8 sm:p-10 space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-44 bg-[#fafafa] rounded-2xl border border-zinc-100 p-4 flex flex-col justify-center space-y-2 relative overflow-hidden text-left">
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200 shadow-sm text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-rose-600">Client Inquiry (02:14 AM)</span>
                <p className="text-[11px] text-zinc-700">"What are your retainer rates?"</p>
              </div>
              <div className="bg-[#2563eb] text-white p-2.5 rounded-xl shadow-sm text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-blue-200">Auto-Responder (02:14 AM)</span>
                <p className="text-[11px]">"Our retainers start at $1,800/mo. Here is our booking link..."</p>
              </div>
            </div>
            <div className="space-y-2 text-left">
              <h3 className="text-xl font-bold text-zinc-950">24/7 Zero-Latency Auto-Responder</h3>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
                Never leave potential clients on "read". Automatically answer pricing questions, send booking links, and capture qualified leads into CRM.
              </p>
            </div>
          </div>

          {/* Bento Card 4: Customizable Workspaces on *.jidosaap.xyz (Dashed Border) */}
          <div className="rounded-[28px] border-2 border-dashed border-zinc-300 bg-[#fafafa] p-8 sm:p-10 space-y-6 shadow-sm hover:border-zinc-400 transition-colors">
            <div className="h-44 flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-zinc-900 font-bold flex items-center justify-center text-lg shadow-md">
                04:21
              </div>
              <div className="text-xs font-mono font-bold text-zinc-800 bg-white border border-zinc-200 px-3 py-1 rounded-xl shadow-xs">
                https://yourbrand.jidosaap.xyz
              </div>
            </div>
            <div className="space-y-2 text-left">
              <h3 className="text-xl font-bold text-zinc-950">Dedicated Isolated Subdomains</h3>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
                Every client gets their own dedicated <code className="font-mono font-bold text-zinc-900">*.jidosaap.xyz</code> subdomain with an isolated WhatsApp Cloud API instance.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs font-medium text-zinc-400">
          and a lot more superpowers...
        </div>
      </section>

      {/* ─── 4. "INTEGRATIONS" SECTION (MATCHING SCREENSHOT 3: media_1790959542837.png) ─── */}
      <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
            Integrations
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
            Connect integrations you use every day
          </h2>
        </div>

        {/* Brand Center Icon with Guide Lines */}
        <div className="relative max-w-4xl mx-auto py-6">
          <div className="w-16 h-16 rounded-[22px] bg-white border border-zinc-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-10">
            <div className="grid grid-cols-2 gap-1.5 w-6 h-6 items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
            </div>
          </div>

          {/* Staggered Floating Squircles Row 1 */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-indigo-600 font-mono">Penna</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-emerald-600">WhatsApp</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 border border-blue-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-[#0284c7]">Meta API</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-50 border border-rose-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-rose-600">Slack</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-amber-600">Gmail</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-50 border border-purple-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-purple-600">Figma</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-50 border border-sky-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-sky-600">Notion</span>
            </div>
          </div>

          {/* Staggered Floating Squircles Row 2 */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-violet-600">Stripe</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-zinc-900">OpenAI</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-teal-600">Zendesk</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-orange-500">HubSpot</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-zinc-800">Cal.com</span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <span className="font-bold text-sm sm:text-base text-blue-700">Webhook</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. "TESTIMONIALS" SECTION (MATCHING SCREENSHOT 4: media_1790959551582.png) ─── */}
      <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
            People just like you are already using JidoSapp
          </h2>
        </div>

        {/* Masonry-style Grid of Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
          {/* Card 1 */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
              "The 1-tap WhatsApp Status bridge completely transformed how I distribute my newsletter on penna.dev. I never have to manually copy, paste, and reformat on my phone again."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                PO
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Precious Okon</div>
                <div className="text-[11px] text-zinc-400">Founder @ penna.dev</div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
              "Posting daily portfolio designs at 7:00 AM sharp without having to wake up early changed my business. Clients think I never sleep. It influenced inquiries so heavily my retainer booked out."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
                SW
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Shola W.</div>
                <div className="text-[11px] text-zinc-400">Freelance Brand Designer</div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
              "Running developer groups with over 3,000 members used to be a full-time moderation nightmare. JidoSapp's spam filter deletes scam links in seconds and boots repeat offenders instantly."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                MJ
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Michael J.</div>
                <div className="text-[11px] text-zinc-400">Community Director</div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
              "The 24/7 auto-responder answers high-intent client inquiries at 2:00 AM with our rate card and Calendly link. We captured $14,000 in retainers from leads who would have moved on."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                DT
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Daniela T.</div>
                <div className="text-[11px] text-zinc-400">Agency Director</div>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
              "Getting our own dedicated subdomain on jidosaap.xyz meant zero bot collisions and pure isolated webhooks. The architecture is enterprise grade."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                AM
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Alex M.</div>
                <div className="text-[11px] text-zinc-400">Full-Stack Lead</div>
              </div>
            </div>
          </div>

          {/* Card 6: Video Testimonial Card with YouTube Squircle */}
          <div className="rounded-3xl border border-zinc-200/80 bg-zinc-900 text-white p-7 space-y-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            {/* Floating YouTube Badge */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Play className="h-5 w-5 fill-white" />
            </div>
            <div className="space-y-2 pt-6">
              <div className="text-xs font-bold text-emerald-400 font-mono">CASE STUDY VIDEO</div>
              <h4 className="text-base font-bold text-white">How Shola 3x'd his client conversions</h4>
              <p className="text-xs text-zinc-400">Watch the 2-minute walkthrough of the 7:00 AM consistency engine.</p>
            </div>
            <Link href="/request-integration">
              <button className="h-9 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all">
                Watch video review
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 6. "PRICING" SECTION (MATCHING SCREENSHOT 5: media_1790959567570.png) ─── */}
      <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
            Simple pricing plans
          </h2>
        </div>

        {/* 3 Pricing Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
          {/* Card 1: Basic Plan */}
          <div className="rounded-[30px] border border-zinc-200/80 bg-white p-8 sm:p-10 space-y-8 shadow-xs text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-950">Basic plan</h3>
              <p className="text-xs text-zinc-400">Perfect for individuals.</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
                $15<span className="text-base font-normal text-zinc-400">/mo</span>
              </div>
            </div>

            <Link href="/request-integration" className="block">
              <button className="w-full h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold transition-all">
                Get started
              </button>
            </Link>

            <div className="space-y-3 pt-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-zinc-800 shrink-0" />
                <span>Dedicated *.jidosaap.xyz subdomain</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-zinc-800 shrink-0" />
                <span>1 Official WhatsApp Connection</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-zinc-800 shrink-0" />
                <span>1-Tap Newsletter Bridge</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-zinc-800 shrink-0" />
                <span>Standard support</span>
              </div>
            </div>
          </div>

          {/* Card 2: Pro Plan (HERO BLUE CARD WITH FLOATING 3D LIGHTNING BOLT) */}
          <div className="relative rounded-[32px] bg-[#2563eb] text-white p-8 sm:p-11 space-y-8 shadow-2xl text-left scale-100 md:scale-105 z-10">
            {/* Floating 3D Yellow Lightning Bolt Squircle */}
            <div className="absolute -top-5 right-6 w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center rotate-12 border border-blue-100">
              <Zap className="h-7 w-7 text-amber-500 fill-amber-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Pro plan</h3>
              <p className="text-xs text-blue-100">Ideal for creators &amp; small teams.</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                $39<span className="text-base font-normal text-blue-200">/mo</span>
              </div>
              <div className="text-[11px] font-semibold text-blue-200">Best choice for growing businesses</div>
            </div>

            <Link href="/request-integration" className="block">
              <button className="w-full h-11 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold transition-all shadow-md">
                Get started
              </button>
            </Link>

            <div className="space-y-3 pt-2 text-xs text-blue-50">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-white shrink-0" />
                <span>All product features</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-white shrink-0" />
                <span>7:00 AM Daily Cron Drop Engine</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-white shrink-0" />
                <span>24/7 Smart Auto-Responder</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-white shrink-0" />
                <span>Group Spam Sentinel &amp; Strikes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-white shrink-0" />
                <span>Unlimited file storage &amp; CRM capture</span>
              </div>
            </div>
          </div>

          {/* Card 3: Advanced Plan */}
          <div className="rounded-[30px] border border-zinc-200/80 bg-white p-8 sm:p-10 space-y-8 shadow-xs text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-950">Advanced plan</h3>
              <p className="text-xs text-zinc-400">Best for agencies &amp; multi-community.</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
                $99<span className="text-base font-normal text-zinc-400">/mo</span>
              </div>
            </div>

            <Link href="/request-integration" className="block">
              <button className="w-full h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold transition-all">
                Get started
              </button>
            </Link>

            <div className="space-y-3 pt-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-zinc-800 shrink-0" />
                <span>Unlimited official WhatsApp connections</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-zinc-800 shrink-0" />
                <span>Multi-community group sentinel &amp; auto-kick</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-zinc-800 shrink-0" />
                <span>Dedicated account manager &amp; custom webhooks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-zinc-800 shrink-0" />
                <span>Priority 24/7 SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. READY TO LAUNCH BOTTOM CTA ──────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-[32px] bg-zinc-950 p-10 sm:p-16 text-center text-white space-y-8 relative overflow-hidden border border-zinc-800">
          <div className="space-y-4 max-w-2xl mx-auto relative">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to give your WhatsApp superpowers?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Claim your custom subdomain on <code className="text-white font-mono font-bold">jidosaap.xyz</code> and let us configure your dedicated WhatsApp Business Cloud API instance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative">
            <Link href="/request-integration">
              <button className="h-12 px-8 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-sm shadow-[0_8px_20px_rgba(37,99,235,0.28)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.36)] transition-all hover:-translate-y-0.5">
                Request Your Integration &amp; Subdomain
              </button>
            </Link>
            <Link href="/register">
              <button className="h-12 px-8 rounded-xl bg-transparent border border-zinc-700 hover:bg-zinc-900 text-white font-medium text-sm transition-all">
                Self-Service Sign Up
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
