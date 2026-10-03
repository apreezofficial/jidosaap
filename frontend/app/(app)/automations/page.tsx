"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Plus,
  Zap,
  Play,
  Pause,
  Trash2,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Activity,
  Bot,
  ShieldCheck,
  Radio,
  Sparkles,
  Sliders,
  SlidersHorizontal,
  Flame,
} from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  category: "auto_responder" | "group_shield" | "status_bridge" | "scheduled_drop";
  description: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
  latency: string;
  runs: number;
  lastRun: string;
}

const DEFAULT_AUTOMATIONS: AutomationRule[] = [
  {
    id: "auto-1",
    name: "24/7 Zero-Latency Rate Card Auto-Responder",
    category: "auto_responder",
    description: "Detects pricing/retainer keywords in DMs, replies in <2s with $1,800/mo tier, and sends Cal.com booking link.",
    trigger: "WhatsApp Inbound DM contains ['rates', 'pricing', 'retainer', 'cost']",
    action: "Dispatches $1,800/mo Retainer Tier Card + cal.com/onos/15min meeting link",
    status: "active",
    latency: "1.2s",
    runs: 842,
    lastRun: "2 mins ago",
  },
  {
    id: "auto-2",
    name: "Group Shield · Anti-Spam & Link Sentinel",
    category: "group_shield",
    description: "Inspects incoming group messages, auto-deletes unauthorized Telegram/crypto invite links, and strikes bad actors.",
    trigger: "Inbound Group Message contains external invite link [t.me/, wa.me/, bit.ly/]",
    action: "Delete message immediately + Mute user for 24 hours (Strike 1/3 policy)",
    status: "active",
    latency: "0.8s",
    runs: 142,
    lastRun: "14 mins ago",
  },
  {
    id: "auto-3",
    name: "Newsletter Status Bridge (Penna / Substack)",
    category: "status_bridge",
    description: "Catches publication webhooks, generates 9:16 WhatsApp Status Card, and queues tracked link on onos.jidosaap.xyz.",
    trigger: "Webhook POST on /api/v1/webhooks/penna (Publish Event)",
    action: "Generate 9:16 Status Story Card + Bridge to WhatsApp Status with tracked read link",
    status: "active",
    latency: "1.9s",
    runs: 48,
    lastRun: "1 hour ago",
  },
  {
    id: "auto-4",
    name: "7:00 AM Consistency Engine Drop",
    category: "scheduled_drop",
    description: "Morning portfolio and design drop dispatched every morning at 07:00 AM sharp to 1,240 opted-in client numbers.",
    trigger: "Cron: 00 07 * * 1-5 (Every Weekday 07:00 AM UTC+1)",
    action: "Broadcast daily visual showcase to 1,240 contacts & update WhatsApp Status",
    status: "active",
    latency: "Instant",
    runs: 220,
    lastRun: "Today 07:00 AM",
  },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<AutomationRule[]>(DEFAULT_AUTOMATIONS);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    trigger: "",
    action: "",
    category: "auto_responder" as AutomationRule["category"],
  });
  const [testNotification, setTestNotification] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a
      )
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newRule: AutomationRule = {
      id: `auto-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      description: form.description || "Custom WhatsApp operational blueprint.",
      trigger: form.trigger || "Inbound message received",
      action: form.action || "Execute custom webhook & WhatsApp response",
      status: "active",
      latency: "1.4s",
      runs: 0,
      lastRun: "Never",
    };

    setAutomations([newRule, ...automations]);
    setShowCreate(false);
    setForm({ name: "", description: "", trigger: "", action: "", category: "auto_responder" });
  };

  const runTestTrigger = (automation: AutomationRule) => {
    setTestNotification(`⚡ Fired test trigger for "${automation.name}" in ${automation.latency}!`);
    setTimeout(() => setTestNotification(null), 4000);
  };

  const filteredAutomations = automations.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = selectedFilter === "all" || a.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 select-none font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>4 WhatsApp Engines Online</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold">
              Sub-2s Latency SLA Guaranteed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            WhatsApp Automations & Sentinel
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure the 4 core WhatsApp engines: Auto-Responder, Anti-Spam Group Shield, Newsletter Status Bridge, and 7 AM Drops.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {testNotification && (
            <div className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm animate-fade-in flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{testNotification}</span>
            </div>
          )}

          <Button
            size="sm"
            onClick={() => setShowCreate(true)}
            className="gap-1.5 text-xs bg-[#2563eb] hover:bg-[#1d4ed8]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Automation Blueprint</span>
          </Button>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl text-xs font-semibold text-zinc-600 overflow-x-auto whitespace-nowrap max-w-full">
          {[
            { id: "all", label: "All Automations" },
            { id: "auto_responder", label: "Auto-Responder" },
            { id: "group_shield", label: "Group Shield" },
            { id: "status_bridge", label: "Status Bridge" },
            { id: "scheduled_drop", label: "7 AM Drops" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all shrink-0",
                selectedFilter === f.id
                  ? "bg-white text-zinc-950 shadow-2xs"
                  : "hover:text-zinc-950"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-[#2563eb]"
            placeholder="Search triggers or rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── AUTOMATIONS LIST ── */}
      <div className="space-y-4">
        {filteredAutomations.map((rule) => (
          <div
            key={rule.id}
            className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-2xs hover:shadow-xs transition-all space-y-4"
          >
            {/* Top row: Icon + Name + Category + Status toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    rule.category === "auto_responder" && "bg-emerald-50 text-emerald-600 border border-emerald-200",
                    rule.category === "group_shield" && "bg-amber-50 text-amber-600 border border-amber-200",
                    rule.category === "status_bridge" && "bg-blue-50 text-[#2563eb] border border-blue-200",
                    rule.category === "scheduled_drop" && "bg-purple-50 text-purple-600 border border-purple-200"
                  )}
                >
                  {rule.category === "auto_responder" && <Bot className="h-5 w-5" />}
                  {rule.category === "group_shield" && <ShieldCheck className="h-5 w-5" />}
                  {rule.category === "status_bridge" && <Radio className="h-5 w-5" />}
                  {rule.category === "scheduled_drop" && <Clock className="h-5 w-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-950">{rule.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-semibold">
                      ⚡ {rule.latency}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{rule.description}</p>
                </div>
              </div>

              {/* Status and Action controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => runTestTrigger(rule)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 transition-colors flex items-center gap-1.5"
                  title="Simulate this rule"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#00b4d8]" />
                  <span>Test Trigger</span>
                </button>

                <button
                  onClick={() => toggleStatus(rule.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5",
                    rule.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200"
                  )}
                >
                  {rule.status === "active" ? (
                    <>
                      <Pause className="h-3 w-3 fill-current" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-current" />
                      <span>Paused</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Middle row: Trigger ➔ Action logic diagram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  When (Trigger)
                </span>
                <p className="text-zinc-800 font-mono text-[11px] leading-relaxed">{rule.trigger}</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 text-xs">
                <span className="text-[10px] font-bold text-[#2563eb] uppercase tracking-wider block mb-1">
                  Then (Autonomous Action)
                </span>
                <p className="text-zinc-800 font-mono text-[11px] leading-relaxed">{rule.action}</p>
              </div>
            </div>

            {/* Bottom row: Telemetry info */}
            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[11px] text-zinc-400 font-mono">
              <span>Total Dispatches: {rule.runs.toLocaleString()} runs</span>
              <span>Last Run: {rule.lastRun}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE AUTOMATION MODAL ── */}
      {showCreate && (
        <Modal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          title="Create WhatsApp Automation Blueprint"
          className="max-w-lg"
        >
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Automation Name</label>
              <Input
                placeholder="e.g. VIP Retainer Rate Auto-Responder"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Engine Category</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "auto_responder", label: "24/7 Auto-Responder" },
                  { id: "group_shield", label: "Group Shield Sentinel" },
                  { id: "status_bridge", label: "Newsletter Bridge" },
                  { id: "scheduled_drop", label: "7 AM Morning Drops" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm({ ...form, category: c.id as any })}
                    className={cn(
                      "p-2 rounded-xl text-xs font-semibold border text-left transition-all",
                      form.category === c.id
                        ? "bg-blue-50 text-[#2563eb] border-blue-300"
                        : "bg-white text-zinc-700 border-zinc-200"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Trigger Condition</label>
              <Input
                placeholder="e.g. Inbound message matches ['pricing', 'rates']"
                value={form.trigger}
                onChange={(e) => setForm({ ...form, trigger: e.target.value })}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Autonomous Action</label>
              <Input
                placeholder="e.g. Dispatch $1,800/mo Retainer Tier Card + Cal.com link"
                value={form.action}
                onChange={(e) => setForm({ ...form, action: e.target.value })}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Description</label>
              <textarea
                placeholder="Brief explanation of this automation's business objective..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-20 text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                Deploy Blueprint
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
