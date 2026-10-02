"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useDashboardStats, useMessageSeries, useLeadAnalytics, useRecentActivity } from "@/hooks/useAnalytics";
import {
  Send, MessageSquare, Bot, Zap, TrendingUp, AlertCircle,
  Calendar, Users, CheckCircle2, Clock, ArrowUpRight, Sparkles,
  RefreshCw, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils";

const PERIOD_OPTIONS = ["24h", "7d", "30d"] as const;

const ACTION_ICONS: Record<string, { icon: any; color: string; bg: string }> = {
  user_login:          { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  whatsapp_connected:  { icon: Zap,          color: "text-blue-600",    bg: "bg-blue-50" },
  automation_enabled:  { icon: Zap,          color: "text-amber-600",   bg: "bg-amber-50" },
  contact_created:     { icon: Users,        color: "text-violet-600",  bg: "bg-violet-50" },
  ai_agent_created:    { icon: Bot,          color: "text-rose-600",    bg: "bg-rose-50" },
  automation_created:  { icon: Zap,          color: "text-amber-600",   bg: "bg-amber-50" },
};

const DEFAULT_ICON = { icon: Activity, color: "text-zinc-500", bg: "bg-zinc-100" };

export default function DashboardPage() {
  const { currentWorkspace, user } = useAuth();
  const [period, setPeriod] = useState<"24h" | "7d" | "30d">("7d");

  const { stats, loading: statsLoading, refetch } = useDashboardStats(period);
  const { series: msgSeries, loading: msgLoading } = useMessageSeries(period);
  const { pipeline, loading: pipelineLoading } = useLeadAnalytics(period);
  const { activity, loading: activityLoading } = useRecentActivity(8);

  const kpis = [
    {
      label: "Messages",
      value: statsLoading ? "—" : formatNumber((stats?.messages_received ?? 0) + (stats?.messages_sent ?? 0)),
      sub: statsLoading ? "" : `${formatNumber(stats?.messages_received ?? 0)} received`,
      icon: MessageSquare,
      color: "text-zinc-500",
    },
    {
      label: "AI Resolution",
      value: statsLoading ? "—" : `${stats?.ai_resolution_rate ?? 0}%`,
      sub: "Auto-resolved by AI",
      icon: Bot,
      color: "text-rose-500",
    },
    {
      label: "Leads",
      value: statsLoading ? "—" : formatNumber(stats?.total_leads ?? 0),
      sub: statsLoading ? "" : `${stats?.won_leads ?? 0} won`,
      icon: Users,
      color: "text-violet-500",
    },
    {
      label: "Automations",
      value: statsLoading ? "—" : formatNumber(stats?.automation_runs ?? 0),
      sub: statsLoading ? "" : stats?.failed_runs ? `${stats.failed_runs} failed` : "All successful",
      icon: Zap,
      color: "text-amber-500",
      alert: (stats?.failed_runs ?? 0) > 0,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2 flex-wrap">
            <span>Welcome, {user?.name?.split(" ")[0] || "Operator"}</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              {currentWorkspace?.name || "Workspace"}
            </span>
            {currentWorkspace?.slug && (
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
                {currentWorkspace.slug}.jidosaap.xyz
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Your WhatsApp can do more than you think · Dedicated instance running on <span className="font-mono text-zinc-700 font-semibold">{currentWorkspace?.slug || "workspace"}.jidosaap.xyz</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex bg-zinc-100 rounded-lg p-0.5">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                  period === p ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <Link href="/content/new">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              Schedule Post
            </Button>
          </Link>
          <Link href="/automations/new">
            <Button size="sm" className="gap-1.5 text-xs">
              <Zap className="h-3.5 w-3.5" />
              New Automation
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-xs font-medium">{kpi.label}</span>
                  <Icon className={cn("h-4 w-4", kpi.color)} />
                </div>
                <div className={cn("text-2xl font-bold", statsLoading ? "text-zinc-200 animate-pulse" : "text-zinc-950")}>
                  {kpi.value}
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[11px] font-medium",
                  kpi.alert ? "text-red-500" : "text-zinc-400"
                )}>
                  {kpi.alert ? <AlertCircle className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 text-emerald-500" />}
                  <span>{kpi.sub}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message Volume */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Message Traffic</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Inbound messages vs AI handled over time
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-zinc-500">Sent</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-zinc-400" />
                  <span className="text-zinc-500">Received</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-56">
              {msgLoading ? (
                <div className="h-full bg-zinc-50 rounded-lg animate-pulse" />
              ) : msgSeries.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 text-zinc-200 mx-auto mb-2" />
                    <p className="text-xs text-zinc-400">No message data yet</p>
                    <p className="text-[10px] text-zinc-300 mt-1">Connect WhatsApp to see traffic</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={msgSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E11D48" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#71717A" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#71717A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { weekday: "short" })}
                    />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b", borderColor: "#27272a",
                        borderRadius: "8px", fontSize: "11px", color: "#fff",
                      }}
                    />
                    <Area type="monotone" dataKey="received" name="Received" stroke="#71717A" strokeWidth={2} fillOpacity={1} fill="url(#colorReceived)" />
                    <Area type="monotone" dataKey="sent" name="Sent" stroke="#E11D48" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Lead Pipeline</CardTitle>
            <CardDescription className="text-xs text-zinc-400">Active leads by CRM stage</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-56">
              {pipelineLoading ? (
                <div className="h-full bg-zinc-50 rounded-lg animate-pulse" />
              ) : pipeline.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-zinc-200 mx-auto mb-2" />
                    <p className="text-xs text-zinc-400">No leads yet</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipeline} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b", borderColor: "#27272a",
                        borderRadius: "8px", fontSize: "11px", color: "#fff",
                      }}
                    />
                    <Bar dataKey="count" name="Leads" fill="#E11D48" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Quick Setup */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <Card>
          <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Live workspace events and operations
              </CardDescription>
            </div>
            <Link href="/analytics" className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1">
              <span>Full Analytics</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-zinc-100">
            {activityLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 flex items-start gap-3 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-100 rounded w-1/2" />
                    <div className="h-2.5 bg-zinc-100 rounded w-3/4" />
                  </div>
                </div>
              ))
            ) : activity.length === 0 ? (
              <div className="p-8 text-center">
                <Activity className="h-8 w-8 text-zinc-200 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">No activity yet</p>
                <p className="text-[10px] text-zinc-300 mt-1">Actions you and your team take will appear here</p>
              </div>
            ) : (
              activity.map((event, idx) => {
                const conf = ACTION_ICONS[event.action] || DEFAULT_ICON;
                const Icon = conf.icon;
                const ACTION_LABELS: Record<string, string> = {
                  user_login:            "Signed in",
                  user_registered:       "Account registered",
                  workspace_created:     "Workspace created",
                  whatsapp_connected:    "WhatsApp account connected",
                  whatsapp_disconnected: "WhatsApp disconnected",
                  automation_created:    "New automation created",
                  automation_enabled:    "Automation enabled",
                  automation_disabled:   "Automation paused",
                  ai_agent_created:      "AI agent configured",
                  ai_agent_modified:     "AI agent updated",
                  contact_created:       "Contact added",
                  api_connection_created:"API integration added",
                  member_invited:        "Team member invited",
                };
                return (
                  <div key={idx} className="p-4 flex items-start gap-3 hover:bg-zinc-50/60 transition-colors">
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", conf.bg)}>
                      <Icon className={cn("h-4 w-4", conf.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-zinc-900 truncate">
                          {ACTION_LABELS[event.action] || event.action}
                        </p>
                        <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                          {formatRelativeTime(event.created_at)}
                        </span>
                      </div>
                      {event.user_name && (
                        <p className="text-[11px] text-zinc-500 mt-0.5">{event.user_name}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Setup Checklist */}
        <Card>
          <CardHeader className="pb-3 border-b border-zinc-100">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-500" />
              Quick Start
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Complete these steps to activate your WhatsApp automation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-zinc-100">
            {[
              {
                title: "Connect WhatsApp",
                desc: "Link your WhatsApp Business account via Meta API",
                href: "/integrations/whatsapp",
                icon: "📱",
                done: false,
              },
              {
                title: "Create an AI Agent",
                desc: "Configure an AI to handle customer conversations",
                href: "/agents",
                icon: "🤖",
                done: false,
              },
              {
                title: "Upload Knowledge Base",
                desc: "Add FAQs and product info for your AI to reference",
                href: "/knowledge",
                icon: "📚",
                done: false,
              },
              {
                title: "Build Your First Automation",
                desc: "Create a workflow to automate repetitive tasks",
                href: "/automations/new",
                icon: "⚡",
                done: false,
              },
              {
                title: "Schedule Content",
                desc: "Plan and automate your WhatsApp broadcasts",
                href: "/content",
                icon: "📅",
                done: false,
              },
            ].map((step, idx) => (
              <Link key={idx} href={step.href}>
                <div className="p-4 flex items-start gap-3 hover:bg-zinc-50/60 transition-colors group cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-base shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 group-hover:text-rose-600 transition-colors">
                      {step.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{step.desc}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-rose-500 transition-colors shrink-0 mt-0.5" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
