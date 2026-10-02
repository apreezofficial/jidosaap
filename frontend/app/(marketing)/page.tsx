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
    <div className="space-y-24 pb-24">
      {/* ─── HERO SECTION (EXACT STRUCTURE & SIZING FROM INSPIRATION) ─── */}
      <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="relative w-full rounded-[28px] sm:rounded-[36px] border border-zinc-200/90 bg-[#fafafa] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden min-h-[640px] sm:min-h-[700px] lg:min-h-[750px] flex flex-col items-center justify-center text-center px-6 py-20 lg:py-28">
          
          {/* Subtle Dot Grid Background (Identical to Inspiration) */}
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
              {/* Red Push Pin */}
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
              
              {/* Task 1 */}
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

              {/* Task 2 */}
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
              
              {/* App Icon Squircles Row */}
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
            {/* Center Floating App Icon (Exact 4-dot Badge from Inspiration) */}
            <div className="w-16 h-16 rounded-[22px] bg-white border border-zinc-100 shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-transform duration-300">
              <div className="grid grid-cols-2 gap-1.5 w-6 h-6 items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
              </div>
            </div>

            {/* Giant 2-Line Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.035em] text-zinc-950 leading-[1.06]">
              Your WhatsApp can do
              <span className="block text-[#94a3b8] font-extrabold mt-1 sm:mt-2">
                more than you think
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-[17px] text-[#475569] font-normal max-w-xl mx-auto leading-relaxed pt-1">
              Efficiently automate status drops, 7 AM designer broadcasts, spam filters &amp; 24/7 auto-responders.
            </p>

            {/* Blue Pill CTA Button */}
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

      {/* ─── LIVE SUBDOMAIN CLAIM BAR (*.jidosaap.xyz) ────────────────── */}
      <section id="subdomains" className="max-w-2xl mx-auto px-6 text-center space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
          Every Client Gets Their Own Dedicated Subdomain
        </div>

        <form onSubmit={handleCheckSubdomain} className="bg-white border-2 border-zinc-900 rounded-2xl p-1.5 shadow-xl flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 flex items-center px-3 w-full">
            <span className="text-xs font-semibold text-zinc-400 mr-1">https://</span>
            <input
              type="text"
              placeholder="precious, shola, michael, or yourbrand"
              value={subdomainQuery}
              onChange={(e) => {
                setSubdomainQuery(e.target.value);
                setCheckStatus("idle");
              }}
              className="w-full text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
            />
            <span className="text-xs font-bold text-[#0284c7] font-mono bg-sky-50 px-2 py-0.5 rounded">.jidosaap.xyz</span>
          </div>
          <Button type="submit" size="sm" className="w-full sm:w-auto px-6 h-10 bg-zinc-950 hover:bg-zinc-800 text-white font-medium shrink-0">
            Claim Subdomain
          </Button>
        </form>

        {checkStatus !== "idle" && (
          <div className={`text-xs flex items-center justify-center gap-1.5 font-medium ${checkStatus === "available" ? "text-emerald-600" : checkStatus === "checking" ? "text-zinc-500" : "text-rose-600"}`}>
            {checkStatus === "checking" && <span>Checking availability on jidosaap.xyz…</span>}
            {checkStatus === "available" && (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{checkMessage}</span>
                <Link href={`/request-integration?subdomain=${subdomainQuery}`} className="ml-2 font-bold underline text-emerald-700">
                  Provision Account &rarr;
                </Link>
              </>
            )}
            {checkStatus === "taken" && (
              <>
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>{checkMessage}</span>
              </>
            )}
          </div>
        )}
      </section>

      {/* ─── THE 4 STAR REAL-WORLD USE CASES & SIMULATORS ─────────────── */}
      <section id="use-cases" className="max-w-7xl mx-auto px-6 lg:px-12 space-y-24">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">Proven In The Real World</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Four Stories. Four WhatsApp Superpowers.
          </h2>
          <p className="text-sm text-zinc-600">
            Interact with live simulators of real creators, designers, group admins, and 24/7 auto-responders.
          </p>
        </div>

        {/* ── USE CASE 1: PRECIOUS @ PENNA.DEV ── */}
        <div id="use-case-precious" className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white p-8 lg:p-12 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                <Newspaper className="h-3.5 w-3.5" />
                <span>Use Case #1 · Newsletter-to-Status Bridge</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Precious publishes at <span className="text-indigo-600">penna.dev</span>. With 1 tap, it’s on WhatsApp Status.
              </h3>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Precious writes tech essays on penna.dev. Writing is hard enough; he hated switching between tabs, copying links, and typing out WhatsApp Status updates manually.
              </p>

              <div className="space-y-3 text-xs text-zinc-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Manual Tab Switching:</strong> Hit publish in penna.dev or tap the Jido bridge button.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automatic Status Formatting:</strong> JidoSapp generates the story card and includes the tracked read link.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Subdomain:</strong> Isolated at <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-indigo-600 font-semibold">precious.jidosaap.xyz</code>.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/request-integration?use_case=newsletter_bridge&subdomain=precious">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs h-10 px-5">
                    <span>Setup Newsletter Bridge For Me</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Live Playground: Precious */}
            <div className="lg:col-span-7 bg-zinc-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-xs font-mono text-zinc-300">penna.dev ➔ jidosaap webhook bridge</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">precious.jidosaap.xyz</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Penna.dev Real Article Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>penna.dev/apcodesphere</span>
                      <span className="text-emerald-400 font-medium">Published</span>
                    </div>
                    <div className="text-sm font-bold text-zinc-100 leading-snug">
                      User Experience: the gateway to the users heart
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      Tears of an ex developer — exploring how thoughtful craft, empathy, and intuitive flows unlock true customer devotion.
                    </p>
                  </div>

                  <Button
                    onClick={handlePreciousPublish}
                    size="sm"
                    className={`w-full text-xs font-medium gap-1.5 transition-all ${
                      preciousPublished ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    }`}
                  >
                    {preciousPublished ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Bridged to WhatsApp Status!</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Tap: Post to WhatsApp Status</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* WhatsApp Status Simulation Card */}
                <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] border-b border-zinc-800/80 pb-2">
                    <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Precious's WhatsApp Status</span>
                    </div>
                    <span className="text-zinc-500 text-[10px]">{preciousPublished ? "Just now" : "Waiting for publish…"}</span>
                  </div>

                  <div className="py-4 space-y-2 text-center">
                    {preciousPublished ? (
                      <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300 text-left">
                        <div className="bg-indigo-950/80 border border-indigo-500/40 rounded-lg p-3 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">New Newsletter Issue · Penna.dev</div>
                          <div className="text-xs font-bold text-white leading-snug">
                            User Experience: the gateway to the users heart
                          </div>
                          <a
                            href="https://www.penna.dev/apcodesphere/8078b477-011e-4b6b-bcf1-30414d28faf7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-zinc-300 hover:text-white underline font-mono block truncate"
                          >
                            penna.dev/apcodesphere/8078b477...
                          </a>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-mono text-center">
                          🔥 Live on WhatsApp Status · {preciousViews} views
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-500 py-6">
                        Click the button on the left to fire the 1-tap bridge
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-zinc-500 text-center border-t border-zinc-800/60 pt-1.5">
                    Synced via Meta Cloud API Status Engine
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── USE CASE 2: SHOLA THE GRAPHIC DESIGNER ── */}
        <div id="use-case-shola" className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white p-8 lg:p-12 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Simulator Left */}
            <div className="lg:col-span-7 order-2 lg:order-1 bg-zinc-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-xs font-mono text-zinc-300">7:00 am cron queue &amp; lead tracker</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">shola.jidosaap.xyz</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Daily at 07:00 AM
                    </span>
                    <span className="text-emerald-400 font-mono text-[10px]">Active</span>
                  </div>

                  <div className="aspect-video bg-zinc-800 rounded-lg border border-zinc-700 p-3 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                    <div className="relative text-left">
                      <span className="text-[9px] font-mono bg-rose-600 text-white px-1.5 py-0.5 rounded uppercase font-bold">Today's Showcase</span>
                      <div className="text-xs font-bold text-white mt-0.5">FinTech Mobile UI Rebrand</div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSholaTriggerDrop}
                    size="sm"
                    className="w-full text-xs font-medium bg-amber-600 hover:bg-amber-500 text-white gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Simulate 7:00 AM Auto-Drop</span>
                  </Button>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] border-b border-zinc-800 pb-2 mb-3">
                      <span className="font-semibold text-zinc-300">Incoming Client DMs</span>
                      <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {sholaInquiryCount} new inquiries
                      </span>
                    </div>

                    <div className="space-y-2 text-left">
                      <div className="bg-zinc-800/80 p-2.5 rounded-lg border border-zinc-700/60 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <span className="font-bold text-zinc-200">Alex (Tech Founder)</span>
                          <span>07:08 AM</span>
                        </div>
                        <p className="text-zinc-300 text-[11px]">
                          "Hey Shola! Saw your 7 AM status drop. Can you design our pitch deck this week?"
                        </p>
                      </div>

                      {sholaTriggered && (
                        <div className="bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/40 text-xs space-y-1 animate-in fade-in slide-in-from-top-2">
                          <div className="flex items-center justify-between text-[10px] text-amber-300 font-semibold">
                            <span>Kemi (Brand Director)</span>
                            <span>Just now</span>
                          </div>
                          <p className="text-zinc-200 text-[11px]">
                            "Love the daily consistency. Need your rate card for a 3-month retainer!"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 text-center border-t border-zinc-800/60 pt-2 mt-3">
                    Auto-captured directly into JidoSapp CRM Leads
                  </div>
                </div>
              </div>
            </div>

            {/* Story Right */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
                <Palette className="h-3.5 w-3.5" />
                <span>Use Case #2 · Consistency Engine for Freelancers</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Shola is a graphic designer. JidoSapp posts daily at <span className="text-amber-600">7:00 AM sharp</span>.
              </h3>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Clients hire the designers they see every single day. Shola struggled with waking up early and remembering to post daily portfolio designs. With JidoSapp, he queues a month in advance and lets consistency work for him.
              </p>

              <div className="space-y-3 text-xs text-zinc-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automatic 7:00 AM Cron Posting:</strong> Broadcasts daily visual graphics to status &amp; VIP broadcast lists.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Consistency Converts:</strong> Clients see relentless professionalism, driving high-ticket retainer inquiries.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Subdomain:</strong> Hosted at <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-amber-700 font-semibold">shola.jidosaap.xyz</code>.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/request-integration?use_case=graphic_scheduler&subdomain=shola">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2 text-xs h-10 px-5">
                    <span>Setup Daily 7 AM Scheduler</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── USE CASE 3: MICHAEL'S GROUP SPAM GUARDIAN ── */}
        <div id="use-case-michael" className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white p-8 lg:p-12 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Use Case #3 · 24/7 Group Guardian &amp; Strike System</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Michael runs WhatsApp groups. JidoSapp <span className="text-emerald-600">filters spam links, issues strikes, and auto-exits</span> offenders.
              </h3>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Spammers constantly invade community groups with scam crypto links and telegram invites. Michael couldn’t monitor the group 24/7. JidoSapp inspects messages, issues strike flags, and kicks scammers automatically.
              </p>

              <div className="space-y-3 text-xs text-zinc-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Real-Time Link &amp; Pattern Inspector:</strong> Banned domains and scam invite links are trapped immediately.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Strike Warnings &amp; Auto-Exit:</strong> Automated warnings on strike 1; immediate removal from the group on strike 2.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Subdomain:</strong> Managed on <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-emerald-700 font-semibold">michael.jidosaap.xyz</code>.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/request-integration?use_case=group_spam_guardian&subdomain=michael">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs h-10 px-5">
                    <span>Protect My WhatsApp Group</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Live Playground: Michael */}
            <div className="lg:col-span-7 bg-zinc-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-mono text-zinc-300">group spam sentinel &amp; strike engine</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">michael.jidosaap.xyz</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2 font-bold text-zinc-200">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span>Frontend Developers Hub (1,480 Members)</span>
                  </div>
                  <button onClick={handleMichaelReset} className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px]">
                    <RotateCcw className="h-3 w-3" /> Reset Test
                  </button>
                </div>

                {/* Simulated Chat Feed */}
                <div className="h-52 overflow-y-auto space-y-2.5 pr-2 font-sans text-xs">
                  {michaelLog.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border text-left ${
                        item.type === "normal"
                          ? "bg-zinc-800/80 border-zinc-700 text-zinc-200"
                          : item.type === "warning"
                          ? "bg-amber-950/60 border-amber-600/50 text-amber-200 font-medium"
                          : "bg-rose-950/70 border-rose-600/50 text-rose-200 font-bold"
                      }`}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* Test Action Controls */}
                <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-zinc-400">
                    Spammer Strikes: <span className="font-bold text-rose-400 font-mono">{michaelSpamCount} / 2</span>
                  </div>
                  <Button
                    onClick={handleMichaelSimulateSpam}
                    disabled={michaelSpamCount >= 2}
                    size="sm"
                    className="w-full sm:w-auto text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold gap-1.5"
                  >
                    <Flame className="h-3.5 w-3.5" />
                    <span>{michaelSpamCount === 0 ? "Test: Spammer Posts Scam Link" : michaelSpamCount === 1 ? "Test: Spammer Repeats Infraction" : "Spammer Exited by Bot"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── USE CASE 4: 24/7 AUTO-RESPONDER & SMART LEAD CAPTURE ── */}
        <div id="use-case-auto-responder" className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white p-8 lg:p-12 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Live Chat Simulator Left */}
            <div className="lg:col-span-7 order-2 lg:order-1 bg-zinc-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-xs font-mono text-zinc-300">24/7 smart auto-responder · zero latency</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">auto-replied in 0.8s</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2 font-bold text-zinc-200">
                    <Bot className="h-4 w-4 text-blue-400" />
                    <span>Business WhatsApp Bot (Live Simulation)</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[10px]">Online 24/7</span>
                </div>

                {/* Chat Feed */}
                <div className="h-56 overflow-y-auto space-y-3 pr-2 text-xs">
                  {autoChatLog.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-left ${
                          msg.sender === "user"
                            ? "bg-[#2563eb] text-white rounded-br-none"
                            : "bg-zinc-800 border border-zinc-700/80 text-zinc-200 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Input box */}
                <form onSubmit={handleSendAutoChat} className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type 'pricing', 'book call', or anything..."
                    value={testUserMsg}
                    onChange={(e) => setTestUserMsg(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <Button type="submit" size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs h-8 px-4">
                    Send
                  </Button>
                </form>
              </div>
            </div>

            {/* Story Right */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                <Bot className="h-3.5 w-3.5" />
                <span>Use Case #4 · 24/7 Auto-Responder &amp; CRM</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Never leave a client on "read". <span className="text-[#2563eb]">Auto-respond in seconds</span> at 2:00 AM.
              </h3>

              <p className="text-sm text-zinc-600 leading-relaxed">
                When prospects reach out after business hours or while you're focused, delay means lost revenue. JidoSapp answers inquiries instantly with intelligent menus, pricing, catalog links, and captures leads directly into your CRM.
              </p>

              <div className="space-y-3 text-xs text-zinc-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero-Latency Replies:</strong> Instant replies 24/7 without keeping prospects waiting.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automatic CRM Capture:</strong> Extracts client intent, budget, and tags qualified leads into Kanban pipelines.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Smart Human Escalation:</strong> Escalates to your team when human intervention or closure is required.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/request-integration?use_case=custom">
                  <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white gap-2 text-xs h-10 px-5">
                    <span>Setup 24/7 Auto-Responder</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── READY TO LAUNCH CTA ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl bg-zinc-950 p-10 sm:p-16 text-center text-white space-y-8 relative overflow-hidden border border-zinc-800">
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
              <Button size="lg" className="h-12 px-8 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold gap-2 shadow-lg shadow-blue-600/20">
                <span>Request Your Integration &amp; Subdomain</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="h-12 px-8 text-white border-zinc-700 hover:bg-zinc-900">
                Self-Service Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
