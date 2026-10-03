"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";
import {
  MessageSquare,
  Bot,
  Users,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Activity,
  BarChart3,
  Send,
  ShieldCheck,
  Clock,
  Radio,
  Eye,
  MousePointerClick,
  Globe,
  Flame,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const PERIODS = [
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "14d", value: "14d" },
  { label: "30d", value: "30d" },
] as const;

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#18181b",
    borderColor: "#27272a",
    borderRadius: "12px",
    fontSize: "11px",
    color: "#fff",
  },
};

const LATENCY_DATA = [
  { time: "00:00", botLatency: 1.1, manualLatency: 240 },
  { time: "04:00", botLatency: 1.3, manualLatency: 360 },
  { time: "08:00", botLatency: 1.4, manualLatency: 45 },
  { time: "12:00", botLatency: 1.2, manualLatency: 25 },
  { time: "16:00", botLatency: 1.5, manualLatency: 35 },
  { time: "20:00", botLatency: 1.3, manualLatency: 180 },
];

const DISPATCH_DATA = [
  { day: "Mon", drops: 1240, autoReplies: 110, spamPurged: 8 },
  { day: "Tue", drops: 1240, autoReplies: 145, spamPurged: 6 },
  { day: "Wed", drops: 1240, autoReplies: 180, spamPurged: 12 },
  { day: "Thu", drops: 1240, autoReplies: 160, spamPurged: 5 },
  { day: "Fri", drops: 1240, autoReplies: 195, spamPurged: 7 },
  { day: "Sat", drops: 1240, autoReplies: 90, spamPurged: 4 },
  { day: "Sun", drops: 1240, autoReplies: 85, spamPurged: 3 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"24h" | "7d" | "14d" | "30d">("7d");

  const kpis = [
    {
      label: "Autonomous Response Latency",
      value: "1.4s",
      subtext: "vs 4.2h manual industry avg",
      Icon: Zap,
      color: "text-amber-500",
      badge: "Zero-Latency SLA",
    },
    {
      label: "Inquiries Auto-Resolved",
      value: "842 / 910",
      subtext: "92.5% autonomous resolution",
      Icon: Bot,
      color: "text-[#2563eb]",
      badge: "+340% conversion",
    },
    {
      label: "7:00 AM Drop Views",
      value: "1,240 / drop",
      subtext: "84.6% WhatsApp status view rate",
      Icon: Radio,
      color: "text-purple-600",
      badge: "Daily Consistency",
    },
    {
      label: "Spam & Attacks Neutralized",
      value: "38 Purged",
      subtext: "4 community groups protected",
      Icon: ShieldCheck,
      color: "text-emerald-600",
      badge: "0 False Positives",
    },
    {
      label: "Tracked Subdomain Clicks",
      value: "420 clicks",
      subtext: "via onos.jidosaap.xyz",
      Icon: MousePointerClick,
      color: "text-cyan-500",
      badge: "33.8% CTR",
    },
    {
      label: "Pipeline Retainer Value",
      value: "$28,400/mo",
      subtext: "High-intent WhatsApp leads",
      Icon: TrendingUp,
      color: "text-emerald-600",
      badge: "14 Active Retainers",
    },
    {
      label: "Total Messages Dispatched",
      value: "2,840",
      subtext: "Meta Cloud API online",
      Icon: Send,
      color: "text-zinc-700",
      badge: "99.8% Delivery",
    },
    {
      label: "Edge Subdomain Uptime",
      value: "99.98%",
      subtext: "42ms webhook roundtrip",
      Icon: Globe,
      color: "text-blue-500",
      badge: "Argon2id Encrypted",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              <span>Real-Time WhatsApp Telemetry</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold font-mono">
              Meta Cloud API Connected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            WhatsApp Operational Analytics & ROI
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitor sub-second response speeds, 7 AM drop visibility, group spam mitigation, and captured pipeline revenue.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                period === p.value
                  ? "bg-white text-zinc-950 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 8 KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.Icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">{kpi.label}</span>
                <span className={cn("p-2 rounded-xl bg-zinc-50 border border-zinc-100", kpi.color)}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>

              <div>
                <p className="text-2xl font-extrabold text-zinc-950 font-mono tracking-tight">
                  {kpi.value}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{kpi.subtext}</p>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                  {kpi.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CHARTS ROW: Latency Comparison (Left) | Dispatch Volume (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Comparison Chart */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-950">
                Response Speed: Jido Autonomous vs Manual Operator
              </h3>
              <p className="text-xs text-zinc-400">
                Sub-2s autonomous bot latency ensures zero lost client leads
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Avg: 1.4s
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={LATENCY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} unit="s" domain={[0, 3]} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="botLatency"
                  name="Jido Latency (Seconds)"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#latencyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
              <span>Jido Autonomous Bot (1.1s - 1.5s)</span>
            </span>
            <span className="text-zinc-400">Manual replies average 45 - 360 mins</span>
          </div>
        </div>

        {/* Weekly Dispatch & Purge Volume */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-950">
                Weekly Activity: 7 AM Drops &amp; Auto-Replies
              </h3>
              <p className="text-xs text-zinc-400">
                Dispatches and group moderation across all 4 WhatsApp engines
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#2563eb] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              2,840 Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISPATCH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="drops" name="7 AM Drops" fill="#9333ea" radius={[4, 4, 0, 0]} />
                <Bar dataKey="autoReplies" name="Auto-Replies" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spamPurged" name="Spam Purged" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-zinc-500 pt-2 border-t border-zinc-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>7 AM Drops (1,240/day)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
              <span>Auto-Replies</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Spam Purged</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
