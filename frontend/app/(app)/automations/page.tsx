"use client";

import React, { useState } from "react";
import { useAutomations } from "@/hooks/useAutomations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Plus, Zap, Play, Pause, Trash2, ChevronRight,
  CheckCircle2, AlertCircle, Clock, Search, Activity,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const TRIGGER_LABELS: Record<string, string> = {
  incoming_message: "Incoming Message",
  schedule:         "Schedule",
  webhook:          "Webhook",
  new_contact:      "New Contact",
  new_lead:         "New Lead",
  manual:           "Manual",
};

export default function AutomationsPage() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", trigger_type: "incoming_message" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { automations, total, loading, refetch } = useAutomations({
    search: search || undefined,
  });

  const handleCreate = async () => {
    if (!form.name) return;
    setSaving(true);
    setError(null);
    const res = await api.post("/automations", form);
    setSaving(false);
    if (res.success && res.data) {
      setShowCreate(false);
      setForm({ name: "", description: "", trigger_type: "incoming_message" });
      refetch();
    } else {
      setError(res.error?.message ?? "Failed to create");
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const endpoint = current === "active"
      ? `/automations/${id}/disable`
      : `/automations/${id}/enable`;
    await api.post(endpoint);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this automation?")) return;
    await api.delete(`/automations/${id}`);
    refetch();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Automations</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{total} automations configured</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          New Automation
        </Button>
      </div>

      {/* Star Narrative Automation Recipes */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-2xl p-5 text-white border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Star Workflow Blueprints</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">Instant Setup</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              setForm({
                name: "Precious · penna.dev Newsletter Status Bridge",
                description: "Receives penna.dev publish webhook and posts issue summary to WhatsApp Status and broadcasts",
                trigger_type: "webhook",
              });
              setShowCreate(true);
            }}
            className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-all group"
          >
            <div className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
              Precious: Newsletter Bridge
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Trigger: Webhook ➔ Transformer ➔ WhatsApp Status Post
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({
                name: "Shola · 07:00 AM Daily Graphic Auto-Drop",
                description: "Pulls queued visual portfolio pieces from studio and broadcasts to WhatsApp at 7:00 AM sharp",
                trigger_type: "schedule",
              });
              setShowCreate(true);
            }}
            className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-all group"
          >
            <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
              Shola: 7 AM Daily Drop
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Trigger: Cron 07:00 AM ➔ Media Loader ➔ Status & Broadcast
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({
                name: "Michael · Group Spam Link Sentinel & Strike Exit",
                description: "Inspects incoming group messages, issues strikes for unauthorized links, and auto-kicks spammers",
                trigger_type: "incoming_message",
              });
              setShowCreate(true);
            }}
            className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-all group"
          >
            <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              Michael: Group Spam Shield
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Trigger: Incoming Message ➔ Link Filter ➔ Strike / Kick
            </p>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
          placeholder="Search automations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Automations list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-zinc-100 rounded w-1/3 mb-2" />
              <div className="h-3 bg-zinc-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : automations.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl py-20 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
            <Zap className="h-7 w-7 text-zinc-300" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-700 mb-1">No automations yet</h3>
          <p className="text-xs text-zinc-400 mb-5 max-w-xs text-center">
            Build visual workflows to automate your WhatsApp business
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Create Automation
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map((auto) => (
            <Card key={auto.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    auto.status === "active" ? "bg-rose-50" : "bg-zinc-100"
                  )}>
                    <Zap className={cn("h-5 w-5", auto.status === "active" ? "text-rose-500" : "text-zinc-400")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-zinc-900">{auto.name}</h3>
                      <Badge variant={auto.status === "active" ? "success" : "secondary"}>
                        {auto.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {auto.description && (
                      <p className="text-xs text-zinc-500 mb-2">{auto.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Trigger: {TRIGGER_LABELS[auto.trigger_type] || auto.trigger_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {auto.successful_runs} runs
                      </span>
                      {auto.failed_runs > 0 && (
                        <span className="flex items-center gap-1 text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {auto.failed_runs} failed
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(auto.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/automations/${auto.id}`}>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      <ChevronRight className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant={auto.status === "active" ? "outline" : "outline"}
                    onClick={() => toggleStatus(auto.id, auto.status)}
                    className={cn(
                      "gap-1.5 text-xs",
                      auto.status === "active"
                        ? "text-amber-600 border-amber-200 hover:bg-amber-50"
                        : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    )}
                  >
                    {auto.status === "active" ? (
                      <><Pause className="h-3.5 w-3.5" />Disable</>
                    ) : (
                      <><Play className="h-3.5 w-3.5" />Enable</>
                    )}
                  </Button>
                  <button
                    onClick={() => handleDelete(auto.id)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setError(null); }}
        title="New Automation"
        description="Create a new workflow automation"
        maxWidth="md"
      >
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{error}</div>
          )}
          <Input
            label="Automation Name *"
            placeholder="e.g. New Lead Follow-Up"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Description</label>
            <textarea
              className="w-full h-20 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder="What does this automation do?"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Trigger</label>
            <select
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              value={form.trigger_type}
              onChange={(e) => setForm((f) => ({ ...f, trigger_type: e.target.value }))}
            >
              {Object.entries(TRIGGER_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 text-sm">Cancel</Button>
            <Button onClick={handleCreate} isLoading={saving} className="flex-1 text-sm gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Create & Build
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
