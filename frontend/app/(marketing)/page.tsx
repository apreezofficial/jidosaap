"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  Globe,
  Newspaper,
  Palette,
  ShieldAlert,
  Bot,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Flame,
  Users,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  UserX,
  Play,
  RotateCcw,
} from "lucide-react";

export default function LandingPage() {
  // Subdomain Claimer State
  const [subdomainQuery, setSubdomainQuery] = useState("");
  const [checkStatus, setCheckStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [checkMessage, setCheckMessage] = useState("");

  // Interactive Demo 1: Precious (penna.dev newsletter bridge)
  const [preciousPublished, setPreciousPublished] = useState(false);
  const [preciousViews, setPreciousViews] = useState(240);

  // Interactive Demo 2: Shola (7 AM Graphic Designer Drop)
  const [sholaScheduled, setSholaScheduled] = useState(true);
  const [sholaInquiryCount, setSholaInquiryCount] = useState(6);
  const [sholaTriggered, setSholaTriggered] = useState(false);

  // Interactive Demo 3: Michael (Group Spam Guardian)
  const [michaelSpamCount, setMichaelSpamCount] = useState(0);
  const [michaelLog, setMichaelLog] = useState<Array<{ id: number; text: string; type: "normal" | "warning" | "kicked" }>>([
    { id: 1, text: "Sarah: Has anyone reviewed the new React 19 documentation?", type: "normal" },
    { id: 2, text: "David: Yes! Server actions are much simpler now.", type: "normal" },
  ]);

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
    }, 400);
  };

  const handlePreciousPublish = () => {
    setPreciousPublished(true);
    setPreciousViews((prev) => prev + 18);
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

  return (
    <div className="space-y-28 pb-24 overflow-hidden">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="pt-16 lg:pt-24 px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-8 relative">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-rose-500/10 via-amber-500/10 to-emerald-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200/80 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-rose-600 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Next-Gen WhatsApp Multi-Tenant Automation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 max-w-4xl mx-auto leading-[1.08]">
          Your WhatsApp can do <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">more than you think</span>.
        </h1>

        <p className="text-base sm:text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Stop manually pasting newsletter updates, struggling with daily morning posting consistency, or losing active groups to spam links. JidoSapp powers your WhatsApp with automated bridges, schedules, and guardians on your own custom subdomain.
        </p>

        {/* Live Subdomain Claim Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <form onSubmit={handleCheckSubdomain} className="bg-white border-2 border-zinc-900 rounded-2xl p-1.5 shadow-xl flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-3 w-full">
              <span className="text-xs font-semibold text-zinc-400 mr-1">https://</span>
              <input
                type="text"
                placeholder="yourbrand"
                value={subdomainQuery}
                onChange={(e) => {
                  setSubdomainQuery(e.target.value);
                  setCheckStatus("idle");
                }}
                className="w-full text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
              />
              <span className="text-xs font-bold text-rose-600 font-mono bg-rose-50 px-2 py-0.5 rounded">.jidosaap.xyz</span>
            </div>
            <Button type="submit" size="sm" className="w-full sm:w-auto px-6 h-10 bg-zinc-950 hover:bg-zinc-800 text-white font-medium shrink-0">
              Claim Subdomain
            </Button>
          </form>

          {checkStatus !== "idle" && (
            <div className={`mt-3 text-xs flex items-center justify-center gap-1.5 font-medium ${checkStatus === "available" ? "text-emerald-600" : checkStatus === "checking" ? "text-zinc-500" : "text-rose-600"}`}>
              {checkStatus === "checking" && <span>Checking availability on jidosaap.xyz…</span>}
              {checkStatus === "available" && (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{checkMessage}</span>
                  <Link href={`/request-integration?subdomain=${subdomainQuery}`} className="ml-2 font-bold underline text-emerald-700">
                    Set Up Now &rarr;
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

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-[11px] text-zinc-500">
            <span>Popular claims:</span>
            <button type="button" onClick={() => { setSubdomainQuery("precious"); setCheckStatus("available"); setCheckMessage("Available for reservation!"); }} className="hover:text-zinc-900 underline font-mono">precious.jidosaap.xyz</button>
            <button type="button" onClick={() => { setSubdomainQuery("shola"); setCheckStatus("available"); setCheckMessage("Available for reservation!"); }} className="hover:text-zinc-900 underline font-mono">shola.jidosaap.xyz</button>
            <button type="button" onClick={() => { setSubdomainQuery("michael"); setCheckStatus("available"); setCheckMessage("Available for reservation!"); }} className="hover:text-zinc-900 underline font-mono">michael.jidosaap.xyz</button>
          </div>
        </div>

        {/* Top Use Case Teasers */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto text-left">
          <a href="#use-case-precious" className="p-4 rounded-xl border border-zinc-200/80 bg-white/70 hover:border-rose-400 hover:shadow-md transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Newspaper className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-zinc-900">Precious @ penna.dev</span>
            </div>
            <p className="text-xs text-zinc-600">
              1-Tap Status Bridge from newsletter to WhatsApp Status without manual copy-pasting.
            </p>
          </a>

          <a href="#use-case-shola" className="p-4 rounded-xl border border-zinc-200/80 bg-white/70 hover:border-rose-400 hover:shadow-md transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Palette className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-zinc-900">Shola The Designer</span>
            </div>
            <p className="text-xs text-zinc-600">
              Daily 7:00 AM sharp portfolio drops that create unshakeable client consistency & trust.
            </p>
          </a>

          <a href="#use-case-michael" className="p-4 rounded-xl border border-zinc-200/80 bg-white/70 hover:border-rose-400 hover:shadow-md transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldAlert className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-zinc-900">Michael's Community</span>
            </div>
            <p className="text-xs text-zinc-600">
              Intelligent group guardian: filters spam links, sets warning strikes, and auto-exits scammers.
            </p>
          </a>
        </div>
      </section>

      {/* ─── The 3 Star Real-World Use Cases ────────────────────────── */}
      <section id="use-cases" className="max-w-7xl mx-auto px-6 lg:px-12 space-y-24">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-600">Built For Real Humans & Businesses</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Three Stories. Three Superpowers.
          </h2>
          <p className="text-sm text-zinc-600">
            See how real creators, designers, and group admins eliminate manual chores and turn WhatsApp into an automated powerhouse.
          </p>
        </div>

        {/* ── USE CASE 1: PRECIOUS @ PENNA.DEV ── */}
        <div id="use-case-precious" className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-gradient-to-br from-indigo-50/40 via-white to-white p-8 lg:p-12 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold">
                <Newspaper className="h-3.5 w-3.5" />
                <span>Use Case #1 · Newsletter-to-Status Bridge</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Precious publishes at <span className="text-indigo-600">penna.dev</span>. With 1 tap, it’s live on WhatsApp Status.
              </h3>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Precious runs a high-engagement tech newsletter on penna.dev. Writing great content is hard enough; he hated switching between tabs, copying links, formatting snippets, and manually posting to WhatsApp Status.
              </p>

              <div className="space-y-3 text-xs text-zinc-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Manual Context Switching:</strong> Hit “Publish” or tap the WhatsApp bridge button inside penna.dev.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automatic Status Formatting:</strong> JidoSapp automatically creates the visual story card and adds the tracked read link.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Subdomain:</strong> Runs on his isolated webhook instance at <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-indigo-600 font-semibold">precious.jidosaap.xyz</code>.</span>
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
                  <span className="text-xs font-mono text-zinc-300">live demo: penna.dev ➔ jidosaap webhook bridge</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">subdomain: precious.jidosaap.xyz</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Penna.dev Mock Article Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>penna.dev/editor</span>
                      <span className="text-emerald-400">Draft Ready</span>
                    </div>
                    <div className="text-sm font-bold text-zinc-100">
                      Issue #48: Why Simple Architectures Win
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      Modern dev teams are overengineering their pipelines. Here is why simplicity wins in 2026.
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
                      <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-indigo-950/80 border border-indigo-500/40 rounded-lg p-3 text-left space-y-1">
                          <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">New Newsletter Issue</div>
                          <div className="text-xs font-bold text-white">Why Simple Architectures Win</div>
                          <div className="text-[11px] text-zinc-300 underline font-mono">penna.dev/p/issue-48</div>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-mono">
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
        <div id="use-case-shola" className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-gradient-to-br from-amber-50/40 via-white to-white p-8 lg:p-12 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Interactive Live Playground: Shola */}
            <div className="lg:col-span-7 order-2 lg:order-1 bg-zinc-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-xs font-mono text-zinc-300">live demo: 7:00 am cron queue &amp; lead tracker</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">subdomain: shola.jidosaap.xyz</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* 7 AM Scheduler Card */}
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

                {/* WhatsApp Inbound Inquiries Feed */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] border-b border-zinc-800 pb-2 mb-3">
                      <span className="font-semibold text-zinc-300">Incoming Client DMs</span>
                      <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
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

            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-semibold">
                <Palette className="h-3.5 w-3.5" />
                <span>Use Case #2 · Consistency Engine for Freelancers</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Shola is a graphic designer. JidoSapp posts daily at <span className="text-amber-600">7:00 AM sharp</span>.
              </h3>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Clients buy from the designers they see every day. Shola struggled with waking up early and remembering to post daily portfolio designs. With JidoSapp, he queues a month of designs in advance and goes to sleep peacefully.
              </p>

              <div className="space-y-3 text-xs text-zinc-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automatic 7:00 AM Cron Posting:</strong> Broadcasts daily visual graphics to status &amp; broadcast lists like clockwork.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Consistency Drives Client Conversion:</strong> Leads perceive relentless professionalism, generating steady high-ticket project DMs.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Subdomain:</strong> Hosted at <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-amber-700 font-semibold">shola.jidosaap.xyz</code> with full content calendar.</span>
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
        <div id="use-case-michael" className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-gradient-to-br from-emerald-50/40 via-white to-white p-8 lg:p-12 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Use Case #3 · 24/7 Group Guardian &amp; Strike System</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Michael runs WhatsApp groups. JidoSapp <span className="text-emerald-600">filters spam links, issues strikes, and auto-exits</span> offenders.
              </h3>

              <p className="text-sm text-zinc-600 leading-relaxed">
                As usual with high-traffic groups, spammers constantly invade with scam links, telegram invites, and crypto schemes. Michael couldn’t monitor the group 24/7. JidoSapp acts as an automated security shield.
              </p>

              <div className="space-y-3 text-xs text-zinc-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Real-Time Link &amp; Pattern Inspector:</strong> Banned domains, invite links, and crypto buzzwords are detected instantly.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Strike Warnings &amp; Instant Eviction:</strong> Sends automated warning flags on strike 1 and auto-exits the spammer on strike 2.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Subdomain:</strong> Managed on <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-emerald-700 font-semibold">michael.jidosaap.xyz</code> with group audit logs.</span>
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
                  <span className="text-xs font-mono text-zinc-300">live demo: group spam sentinel &amp; strike engine</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">subdomain: michael.jidosaap.xyz</span>
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
      </section>

      {/* ─── Dedicated Subdomain Architecture (*.jidosaap.xyz) ───────── */}
      <section id="subdomains" className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold">
            <Globe className="h-3.5 w-3.5 text-zinc-600" />
            <span>Dedicated Multi-Tenant Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Every Client Gets Their Own Subdomain &amp; Isolated WhatsApp Instance
          </h2>
          <p className="text-sm text-zinc-600">
            No shared queues. No messy collisions. When you contact or request integration, we configure your dedicated subdomain on <code className="font-bold text-rose-600">jidosaap.xyz</code> with full Meta Cloud API isolation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 hover:border-zinc-900 transition-all shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                precious.jidosaap.xyz
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <h3 className="text-base font-bold text-zinc-950">Newsletter Publisher Instance</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Equipped with penna.dev webhook listeners, instant Status push connectors, and VIP subscriber broadcast queues.
            </p>
            <div className="text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-100">
              Provider: Meta Cloud API · Isolated DB
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 hover:border-zinc-900 transition-all shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                shola.jidosaap.xyz
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <h3 className="text-base font-bold text-zinc-950">Freelancer Studio &amp; Scheduler</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Equipped with 7:00 AM daily cron worker, portfolio image CDN storage, and automatic client lead qualification.
            </p>
            <div className="text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-100">
              Provider: Meta Cloud API · Cron Engine
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 hover:border-zinc-900 transition-all shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                michael.jidosaap.xyz
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <h3 className="text-base font-bold text-zinc-950">Community Group Sentinel</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Equipped with real-time spam link scanner, strike counter tables, and auto-exit execution hooks for multiple groups.
            </p>
            <div className="text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-100">
              Provider: Meta Cloud API · Spam Guard
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ready to Launch CTA ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl bg-zinc-950 p-10 sm:p-16 text-center text-white space-y-8 relative overflow-hidden border border-zinc-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 max-w-2xl mx-auto relative">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to give your WhatsApp superpowers?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Tell us your brand or name. We set up your custom subdomain on <code className="text-white font-mono font-bold">jidosaap.xyz</code> and configure your dedicated WhatsApp account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative">
            <Link href="/request-integration">
              <Button size="lg" className="h-12 px-8 bg-rose-600 hover:bg-rose-500 text-white font-semibold gap-2 shadow-lg shadow-rose-600/20">
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
