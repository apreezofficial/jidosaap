"use client";

import React, { useState } from "react";
import {
  useDashboardStats,
  useMessageSeries,
  useLeadAnalytics,
  useAutomationSeries,
} from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";
import {
  MessageSquare, Bot, Users, Zap, TrendingUp, CheckCircle2,
  AlertCircle, Activity, BarChart3, Send,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const PERIODS = [
  { label: "24h", value: "24h" },
  { label: "7d",  value: "7d" },
  { label: "14d", value: "14d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
] as const;

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#18181b",
    borderColor: "#27272a",
    borderRadius: "8px",
    fontSize: "11px",
    color: "#fff",
  },
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"24h" | "7d" | "14d" | "30d" | "90d">("7d");

  const { stats, loading: statsLoading } = useDashboardStats(period);
  const { series: msgSeries, loading: msgLoading }   = useMessageSeries(period);
  const { series: leadSeries, pipeline, loading: leadLoading } = useLeadAnalytics(period);
  const { series: autoSeries, loading: autoLoading } = useAutomationSeries(period);

  const kpis = stats ? [
    { label: "Messages Received",  value: formatNumber(stats.messages_received),  Icon: MessageSquare, color: "text-zinc-500" },
    { label: "Messages Sent",      value: formatNumber(stats.messages_sent),       Icon: Send,          color: "text-zinc-500" },
    { label: "AI Resolution Rate", value: `${stats.ai_resolution_rate}%`,          Icon: Bot,           color: "text-[#2563eb]" },
    { label: "Total Leads",        value: formatNumber(stats.total_leads),          Icon: Users,         color: "text-violet-500" },
    { label: "Won Value",          value: formatCurrency(stats.won_value),          Icon: TrendingUp,    color: "text-emerald-500" },
    { label: "Automation Runs",    value: formatNumber(stats.automation_runs),      Icon: Zap,           color: "text-amber-500" },
    { label: "Successful Runs",    value: formatNumber(stats.successful_runs),      Icon: CheckCircle2,  color: "text-emerald-500" },
    { label: "Failed Runs",        value: formatNumber(stats.failed_runs),          Icon: AlertCircle,   color: "text-red-500" },
  ] : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Analytics</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Real-time metrics from your WhatsApp operations</p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                period === p.value ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 animate-pulse">
                <div className="h-3 bg-zinc-100 rounded w-2/3 mb-2" />
                <div className="h-7 bg-zinc-100 rounded w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : (
          kpis.map(({ label, value, Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-500 font-medium">{label}</span>
                  <Icon className={cn("h-4 w-4", color)} />
                </div>
                <p className="text-2xl font-bold text-zinc-900">{value}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts Row 1: Messages + Pipeline */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Message Volume</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Inbound vs outbound WhatsApp messages over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {msgLoading ? (
              <div className="h-56 bg-zinc-50 rounded animate-pulse" />
            ) : msgSeries.length === 0 ? (
              <div className="h-56 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 text-zinc-200 mx-auto mb-2" />
                  <p className="text-xs text-zinc-400">No message data for this period</p>
                </div>
              </div>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={msgSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gReceived" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#71717a" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="received" name="Received" stroke="#71717a" strokeWidth={2} fill="url(#gReceived)" />
                    <Area type="monotone" dataKey="sent" name="Sent" stroke="#2563eb" strokeWidth={2} fill="url(#gSent)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Lead Pipeline</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Current leads by stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leadLoading ? (
              <div className="h-56 bg-zinc-50 rounded animate-pulse" />
            ) : pipeline.length === 0 ? (
              <div className="h-56 flex items-center justify-center">
                <p className="text-xs text-zinc-400">No lead data</p>
              </div>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipeline} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="count" name="Leads" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Automations + Lead growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Automation Executions</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Completed vs failed runs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {autoLoading ? (
              <div className="h-48 bg-zinc-50 rounded animate-pulse" />
            ) : autoSeries.length === 0 ? (
              <div className="h-48 flex items-center justify-center">
                <p className="text-xs text-zinc-400">No automation data</p>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={autoSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="failed"    name="Failed"    fill="#ef4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Lead Growth</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              New leads generated over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leadLoading ? (
              <div className="h-48 bg-zinc-50 rounded animate-pulse" />
            ) : leadSeries.length === 0 ? (
              <div className="h-48 flex items-center justify-center">
                <p className="text-xs text-zinc-400">No lead data</p>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={leadSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Line type="monotone" dataKey="total" name="Leads" stroke="#e11d48" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="won"   name="Won"   stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
