"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  MessageSquare,
  Bot,
  ShieldCheck,
  Send,
  Zap,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Layers,
  PhoneCall,
  Flame,
  Globe,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EventItem {
  id: string;
  type: "auto_responder" | "group_shield" | "status_bridge" | "scheduled_drop";
  title: string;
  sender: string;
  detail: string;
  timestamp: string;
  latency?: string;
  status: "success" | "warning" | "info";
}

const INITIAL_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    type: "auto_responder",
    title: "Retainer Rate Card Dispatched",
    sender: "+1 (415) 890-2311 (Alex Rivera)",
    detail: 'Client asked: "What are your retainer rates?" → Dispatched $1,800/mo tier + Cal.com link',
    timestamp: "2 mins ago",
    latency: "1.3s",
    status: "success",
  },
  {
    id: "evt-2",
    type: "group_shield",
    title: "Phishing Link Purged & User Muted",
    sender: "Designers Guild WhatsApp Group",
    detail: "Purged unauthorized crypto t.me/ invite from bad actor. Issued Strike 1 automatically.",
    timestamp: "14 mins ago",
    latency: "0.8s",
    status: "warning",
  },
  {
    id: "evt-3",
    type: "status_bridge",
    title: "Newsletter Story Card Bridged",
    sender: "Penna Webhook (onos.jidosaap.xyz)",
    detail: 'Bridged "The Architecture of Clean APIs" to WhatsApp Status with tracked read link.',
    timestamp: "1 hour ago",
    latency: "1.9s",
    status: "info",
  },
  {
    id: "evt-4",
    type: "scheduled_drop",
    title: "7:00 AM Consistency Drop Delivered",
    sender: "Status & Broadcast Engine",
    detail: "Dispatched morning design drop to 1,240 subscribers. 99.4% delivery rate recorded.",
    timestamp: "07:00 AM",
    latency: "Instant",
    status: "success",
  },
  {
    id: "evt-5",
    type: "auto_responder",
    title: "Call Booking Confirmed",
    sender: "+234 810 992 0184 (Sarah K.)",
    detail: "Prospect selected 15-min discovery call for Thursday 2:00 PM via Cal.com.",
    timestamp: "08:14 AM",
    latency: "2.1s",
    status: "success",
  },
];

export default function JidoSappCommandCenter() {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(" ")[0] : "Onos";
  const userFullName = user?.name || "Onos E.";

  // Formatted date
  const [formattedDate, setFormattedDate] = useState("Monday, September 30");
  useEffect(() => {
    const now = new Date();
    setFormattedDate(
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(now)
    );
  }, []);

  // Autonomous Uptime Tracker state (live counter)
  const [seconds, setSeconds] = useState(15718); // 04:21:58
  const [isEngineRunning, setIsEngineRunning] = useState(true);

  useEffect(() => {
    if (!isEngineRunning) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isEngineRunning]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Live simulation state
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [simulating, setSimulating] = useState(false);
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [testNotification, setTestNotification] = useState<string | null>(null);

  const triggerSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      const newEvent: EventItem = {
        id: `sim-${Date.now()}`,
        type: "auto_responder",
        title: "⚡ Live Test Inquiry Auto-Resolved",
        sender: "+1 (555) 019-2834 (Test Client)",
        detail: 'Inquiry: "Are you free for a $2,500/mo retainer sprint?" → Replied in 1.1s with booking link',
        timestamp: "Just now",
        latency: "1.1s",
        status: "success",
      };
      setEvents((prev) => [newEvent, ...prev]);
      setSimulating(false);
      setTestNotification("Simulated WhatsApp inquiry resolved in 1.1s!");
      setTimeout(() => setTestNotification(null), 4000);
    }, 900);
  };

  const filteredEvents = events.filter((e) => {
    if (eventFilter === "all") return true;
    return e.type === eventFilter;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12 select-none font-sans">
      {/* ── TOP DISPLAY GREETING & COMMAND HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold">
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Meta Cloud API Online</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold font-mono">
              <Globe className="w-3 h-3" />
              <span>onos.jidosaap.xyz</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-900">
            Welcome back, <span className="font-extrabold text-zinc-950">{userName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
            Your autonomous WhatsApp engines are active. Zero manual policing. 100% lead capture.
          </p>
        </div>

        {/* Quick Simulator & Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {testNotification && (
            <div className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm animate-fade-in flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{testNotification}</span>
            </div>
          )}

          <button
            onClick={triggerSimulation}
            disabled={simulating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-all active:scale-95 shadow-xs disabled:opacity-50"
            title="Simulate incoming WhatsApp inquiry"
          >
            <Sparkles className={cn("h-3.5 w-3.5 text-[#00b4d8]", simulating && "animate-spin")} />
            <span>{simulating ? "Simulating..." : "Test Auto-Responder"}</span>
          </button>

          <Link
            href="/inbox"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#2563eb] text-white text-xs font-semibold hover:bg-[#1d4ed8] transition-all active:scale-95 shadow-xs"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Open WhatsApp Inbox</span>
          </Link>
        </div>
      </div>

      {/* ── TOP METRICS ROW: Autonomous Uptime | Telemetry Rings | Subdomain HUD ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* 1. Autonomous Uptime Widget */}
        <div className="md:col-span-1 lg:col-span-4 rounded-2xl sm:rounded-[28px] bg-gradient-to-b from-amber-400 via-amber-500 to-amber-500 text-white p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[250px]">
          {/* Subtle Concentric Rings Graphic */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <circle cx="150" cy="150" r="80" stroke="white" strokeWidth="20" fill="none" />
              <circle cx="150" cy="150" r="120" stroke="white" strokeWidth="20" fill="none" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", isEngineRunning ? "bg-white animate-pulse" : "bg-white/40")} />
              <span className="text-xs font-bold tracking-wide uppercase font-sans">
                {isEngineRunning ? "Autonomous Uptime" : "Engine Paused"}
              </span>
            </div>
            <span className={cn(
              "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase transition-colors",
              isEngineRunning ? "bg-black/25 text-white" : "bg-white/20 text-white"
            )}>
              {isEngineRunning ? "Live" : "Standby"}
            </span>
          </div>

          <div className="relative z-10 my-auto text-center py-2">
            <span className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight drop-shadow-xs transition-opacity duration-300",
              !isEngineRunning && "opacity-80"
            )}>
              {formatTimer(seconds)}
            </span>
            <p className="text-[10px] sm:text-[11px] font-semibold text-white/95 mt-1">
              {isEngineRunning ? "Sub-2s Zero-Latency Engine • Meta Cloud API" : "Autonomous Engine Paused • Click Resume"}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setIsEngineRunning(!isEngineRunning)}
              className={cn(
                "h-9 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer",
                isEngineRunning
                  ? "bg-white text-zinc-950 hover:bg-zinc-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-500 ring-2 ring-white/40"
              )}
            >
              {isEngineRunning ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                  <span>Resume</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                if (seconds === 0) setSeconds(15718);
                else setSeconds(0);
              }}
              className="h-9 px-3.5 rounded-full bg-black/30 hover:bg-black/40 text-white border border-white/25 shadow-sm flex items-center justify-center gap-1.5 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{seconds === 0 ? "Restore" : "Reset"}</span>
            </button>
          </div>
        </div>

        {/* 2. Concentric Telemetry Activity Card */}
        <div className="md:col-span-1 lg:col-span-5 rounded-2xl sm:rounded-[28px] bg-zinc-950 text-white p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[250px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#00b4d8]" />
              <span className="text-xs font-bold tracking-wide text-zinc-200">WhatsApp Telemetry</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
              Avg Latency: 1.4s
            </span>
          </div>

          <div className="flex items-center justify-between my-auto gap-2 sm:gap-4 py-2">
            <div className="space-y-3 text-xs font-medium min-w-0">
              <div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate">Messages Dispatched</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-white pl-3 mt-0.5 font-mono">2,840 / 3,000</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span className="truncate">Inquiries Auto-Resolved</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-white pl-3 mt-0.5 font-mono">842 / 910</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0" />
                  <span className="truncate">Active Engines</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-white pl-3 mt-0.5 font-mono">4 / 4 Online</p>
              </div>
            </div>

            {/* Apple-style Concentric Rings */}
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#27272a" strokeWidth="8" />
                <circle cx="60" cy="60" r="36" fill="none" stroke="#27272a" strokeWidth="8" />
                <circle cx="60" cy="60" r="24" fill="none" stroke="#27272a" strokeWidth="8" />

                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeDasharray="301"
                  strokeDashoffset={301 - 301 * 0.946}
                  strokeLinecap="round"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="36"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="8"
                  strokeDasharray="226"
                  strokeDashoffset={226 - 226 * 0.925}
                  strokeLinecap="round"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="8"
                  strokeDasharray="150"
                  strokeDashoffset={150 - 150 * 1.0}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400 border-t border-zinc-900 pt-2 font-mono">
            <span>Meta API: 42ms</span>
            <span className="text-emerald-400 font-semibold">99.98% uptime</span>
          </div>
        </div>

        {/* 3. Subdomain & Isolated Instance Card */}
        <div className="md:col-span-2 lg:col-span-3 rounded-2xl sm:rounded-[28px] border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between min-h-[250px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Isolated Instance</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-950 font-mono truncate">onos.jidosaap.xyz</p>
              <p className="text-xs text-zinc-500">Multi-tenant webhook container isolated at edge.</p>
            </div>

            <div className="mt-4 space-y-2 pt-2 border-t border-zinc-100 text-xs">
              <div className="flex items-center justify-between text-zinc-600">
                <span>WABA Status</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>Webhook Route</span>
                <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[120px]">
                  /api/v1/webhooks
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>Protected Groups</span>
                <span className="font-bold text-zinc-900">4 Active</span>
              </div>
            </div>
          </div>

          <Link
            href="/integrations/whatsapp"
            className="w-full flex items-center justify-center gap-1.5 py-2 mt-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 border border-zinc-200/80 transition-colors"
          >
            <span>Manage Subdomain</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* ── THE 4 CORE WHATSAPP ENGINES ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950">Active WhatsApp Automation Engines</h2>
            <p className="text-xs text-zinc-500">The 4 foundational pillars powering your WhatsApp presence</p>
          </div>
          <Link
            href="/automations"
            className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1"
          >
            <span>Configure all blueprints</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Engine 1: 24/7 Zero-Latency Auto-Responder */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sub-2s Active
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 group-hover:text-[#2563eb] transition-colors">
                  24/7 Zero-Latency Auto-Responder
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Never leave potential clients on &ldquo;read&rdquo;. Auto-answers retainer pricing, sends Cal.com links, and captures leads into CRM.
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-zinc-100 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Active Rule</span>
                <span className="font-semibold text-zinc-900">$1,800/mo Retainer Tier</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Response Speed</span>
                <span className="font-mono text-emerald-600 font-bold">1.4s</span>
              </div>
              <Link
                href="/automations"
                className="w-full mt-2 inline-flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-800 transition-colors"
              >
                <span>Edit Rate Cards</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Engine 2: Anti-Spam Group Shield */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  4 Groups Guarded
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 group-hover:text-[#2563eb] transition-colors">
                  Anti-Spam Group Shield
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Zero manual group policing. Automatically delete phishing links, purge unauthorized Telegram invites, and enforce 3-strike bans.
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-zinc-100 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Purged Links</span>
                <span className="font-bold text-amber-600">38 Spam Links</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Bad Actors Banned</span>
                <span className="font-bold text-zinc-900">3 Malicious Bots</span>
              </div>
              <Link
                href="/automations"
                className="w-full mt-2 inline-flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-800 transition-colors"
              >
                <span>Group Rules</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Engine 3: Newsletter Status Bridge */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-xl bg-blue-50 text-[#2563eb] border border-blue-200/80 flex items-center justify-center">
                  <Radio className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200">
                  1-Tap Bridge Ready
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 group-hover:text-[#2563eb] transition-colors">
                  Newsletter Status Bridge
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Bridge essays and newsletters directly to WhatsApp Status. Generates high-converting story cards with tracked links on your subdomain.
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-zinc-100 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Connected Source</span>
                <span className="font-semibold text-zinc-900">Penna Webhook</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Tracked Clicks</span>
                <span className="font-bold text-[#2563eb]">420 Readers</span>
              </div>
              <Link
                href="/content"
                className="w-full mt-2 inline-flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-800 transition-colors"
              >
                <span>Open Bridge Studio</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Engine 4: 7:00 AM Consistency Engine */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/80 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Queued 07:00 AM
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950 group-hover:text-[#2563eb] transition-colors">
                  7:00 AM Consistency Engine
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Queue designs, drops, and announcements in advance. Ensure morning client visibility on WhatsApp Status without waking up early.
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-zinc-100 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Next Drop</span>
                <span className="font-semibold text-zinc-900">Tomorrow 07:00 AM</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Audience</span>
                <span className="font-bold text-purple-700">1,240 Contacts</span>
              </div>
              <Link
                href="/content"
                className="w-full mt-2 inline-flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-800 transition-colors"
              >
                <span>Queue Next Drop</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIVE WHATSAPP EVENT FEED & OPERATIONAL LOG ── */}
      <div className="rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-lg font-bold text-zinc-950">Real-Time WhatsApp Event Stream</h3>
            </div>
            <p className="text-xs text-zinc-400">Live feed of incoming client inquiries, autonomous replies, and group security actions</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl text-xs font-semibold text-zinc-600">
            {[
              { id: "all", label: "All Events" },
              { id: "auto_responder", label: "Auto-Responder" },
              { id: "group_shield", label: "Group Shield" },
              { id: "status_bridge", label: "Status Bridge" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setEventFilter(f.id)}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all",
                  eventFilter === f.id
                    ? "bg-white text-zinc-950 shadow-2xs"
                    : "hover:text-zinc-950"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Table / List */}
        <div className="space-y-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                  evt.type === "auto_responder" && "bg-emerald-50 text-emerald-600 border border-emerald-200/80",
                  evt.type === "group_shield" && "bg-amber-50 text-amber-600 border border-amber-200/80",
                  evt.type === "status_bridge" && "bg-blue-50 text-[#2563eb] border border-blue-200/80",
                  evt.type === "scheduled_drop" && "bg-purple-50 text-purple-600 border border-purple-200/80"
                )}>
                  {evt.type === "auto_responder" && <Bot className="h-4 w-4" />}
                  {evt.type === "group_shield" && <ShieldCheck className="h-4 w-4" />}
                  {evt.type === "status_bridge" && <Radio className="h-4 w-4" />}
                  {evt.type === "scheduled_drop" && <Clock className="h-4 w-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-950">{evt.title}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">• {evt.sender}</span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{evt.detail}</p>
                </div>
              </div>

              <div className="flex items-center sm:flex-col sm:items-end justify-between shrink-0 gap-1 pl-11 sm:pl-0">
                <span className="text-[10px] text-zinc-400 font-mono">{evt.timestamp}</span>
                {evt.latency && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                    ⚡ {evt.latency}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Multi-tenant isolation active at edge • Argon2id encrypted</span>
          </div>
          <Link
            href="/crm/leads"
            className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1"
          >
            <span>View Captured Lead Pipeline</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
