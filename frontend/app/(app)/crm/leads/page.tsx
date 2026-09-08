"use client";

import React, { useState } from "react";
import { usePipeline } from "@/hooks/useCrm";
import { useContacts } from "@/hooks/useContacts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency, formatRelativeTime, initials } from "@/lib/utils";
import {
  Plus, TrendingUp, DollarSign, Users, Target,
  GripVertical, MoreVertical, ChevronRight, Search,
} from "lucide-react";
import { api } from "@/lib/api";

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: "New",       color: "bg-zinc-100 border-zinc-200 text-zinc-700" },
  contacted: { label: "Contacted", color: "bg-blue-50 border-blue-200 text-blue-700" },
  qualified: { label: "Qualified", color: "bg-violet-50 border-violet-200 text-violet-700" },
  proposal:  { label: "Proposal",  color: "bg-amber-50 border-amber-200 text-amber-700" },
  won:       { label: "Won",       color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  lost:      { label: "Lost",      color: "bg-red-50 border-red-200 text-red-700" },
};

export default function LeadsPage() {
  const { pipeline, loading, moveLead, refetch } = usePipeline();
  const { contacts } = useContacts({ limit: 100 });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", contact_id: "", value: "", stage: "new", source: "whatsapp",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const totalLeads = pipeline.reduce((s, c) => s + c.count, 0);
  const totalValue = pipeline.reduce((s, c) => s + (c.value || 0), 0);
  const wonValue = pipeline.find((c) => c.stage === "won")?.value || 0;
  const wonCount = pipeline.find((c) => c.stage === "won")?.count || 0;

  const handleCreate = async () => {
    if (!form.title || !form.contact_id) return;
    setSaving(true);
    setError(null);
    const res = await api.post("/crm/leads", { ...form, value: Number(form.value) || 0 });
    setSaving(false);
    if (res.success) {
      setShowCreate(false);
      setForm({ title: "", contact_id: "", value: "", stage: "new", source: "whatsapp" });
      refetch();
    } else {
      setError(res.error?.message ?? "Failed to create lead");
    }
  };

  const handleDrop = async (leadId: string, stage: string) => {
    await moveLead(leadId, stage);
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">CRM Pipeline</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Drag leads between stages to update their status</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          New Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: totalLeads.toString(), icon: Users, color: "text-zinc-700" },
          { label: "Pipeline Value", value: formatCurrency(totalValue), icon: DollarSign, color: "text-violet-600" },
          { label: "Won", value: wonCount.toString(), icon: Target, color: "text-emerald-600" },
          { label: "Won Value", value: formatCurrency(wonValue), icon: TrendingUp, color: "text-emerald-600" },
        ].map((s) => (
          <Card key={s.label}>
            <div className="p-4 flex items-center gap-3">
              <div className={cn("h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center", s.color)}>
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">{s.label}</p>
                <p className="text-lg font-bold text-zinc-900">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-64 bg-zinc-100/60 rounded-xl p-4 animate-pulse h-96" />
            ))
          ) : (
            pipeline.map((col) => {
              const stageInfo = STAGE_LABELS[col.stage];
              return (
                <div
                  key={col.stage}
                  className="w-64 shrink-0"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const leadId = e.dataTransfer.getData("leadId");
                    if (leadId) handleDrop(leadId, col.stage);
                  }}
                >
                  {/* Column header */}
                  <div className={cn(
                    "flex items-center justify-between mb-3 px-3 py-2 rounded-lg border",
                    stageInfo.color
                  )}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{stageInfo.label}</span>
                      <span className="text-[10px] font-medium opacity-60">{col.count}</span>
                    </div>
                    <span className="text-[10px] font-medium">{formatCurrency(col.value || 0)}</span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2 min-h-[200px]">
                    {col.leads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("leadId", lead.id);
                          setDragging(lead.id);
                        }}
                        onDragEnd={() => setDragging(null)}
                        className={cn(
                          "bg-white rounded-lg border border-zinc-200 p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all group",
                          dragging === lead.id && "opacity-50 scale-95"
                        )}
                      >
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <p className="text-xs font-semibold text-zinc-900 leading-tight">{lead.title}</p>
                          <GripVertical className="h-3.5 w-3.5 text-zinc-300 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[8px] font-bold">
                            {initials(lead.contact_name)}
                          </div>
                          <span className="text-[11px] text-zinc-500">{lead.contact_name}</span>
                        </div>
                        {lead.value > 0 && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-700">
                              {formatCurrency(lead.value, lead.currency)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
                          <span className="text-[10px] text-zinc-400">
                            {formatRelativeTime(lead.created_at)}
                          </span>
                          <Badge variant="secondary">{lead.source}</Badge>
                        </div>
                      </div>
                    ))}
                    {col.leads.length === 0 && (
                      <div className="rounded-lg border-2 border-dashed border-zinc-200 h-24 flex items-center justify-center">
                        <p className="text-xs text-zinc-300">Drop leads here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setError(null); }}
        title="New Lead"
        description="Create a lead in your pipeline"
        maxWidth="md"
      >
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
          <Input
            label="Lead Title *"
            placeholder="e.g. Website redesign project"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Contact *</label>
            <select
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              value={form.contact_id}
              onChange={(e) => setForm((f) => ({ ...f, contact_id: e.target.value }))}
            >
              <option value="">Select a contact…</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
              ))}
            </select>
          </div>
          <Input
            label="Value (USD)"
            type="number"
            placeholder="0"
            value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Stage</label>
            <select
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              value={form.stage}
              onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}
            >
              {Object.entries(STAGE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 text-sm">
              Cancel
            </Button>
            <Button onClick={handleCreate} isLoading={saving} className="flex-1 text-sm">
              Create Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
