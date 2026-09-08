"use client";

import React, { useState } from "react";
import { useContent } from "@/hooks/useContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime, truncate } from "@/lib/utils";
import {
  Plus, FileText, Image, Send, Clock, Calendar,
  Sparkles, MoreVertical, Edit, Trash2, Search, Filter,
  CheckCircle2, AlertCircle, X, Zap,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const STATUS_CONFIG = {
  draft:      { label: "Draft",      variant: "secondary" as const, icon: FileText },
  scheduled:  { label: "Scheduled",  variant: "warning" as const,   icon: Clock },
  processing: { label: "Processing", variant: "secondary" as const, icon: Zap },
  sent:       { label: "Sent",       variant: "success" as const,   icon: CheckCircle2 },
  failed:     { label: "Failed",     variant: "destructive" as const, icon: AlertCircle },
  cancelled:  { label: "Cancelled",  variant: "secondary" as const,  icon: X },
};

export default function ContentPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", status: "draft" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { content, total, loading, refetch } = useContent({
    status: statusFilter || undefined,
    search: search || undefined,
  });

  const handleCreate = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);
    setError(null);
    const res = await api.post("/content", form);
    setSaving(false);
    if (res.success) {
      setShowCreate(false);
      setForm({ title: "", content: "", status: "draft" });
      refetch();
    } else {
      setError(res.error?.message ?? "Failed to create content");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this content?")) return;
    await api.delete(`/content/${id}`);
    refetch();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Content Studio</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {total} pieces of content in your workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/calendar">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              Calendar
            </Button>
          </Link>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            New Content
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
            placeholder="Search content…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["", "draft", "scheduled", "sent", "failed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors",
                statusFilter === s
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
              )}
            >
              {s === "" ? "All" : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-zinc-100 rounded w-3/4 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-zinc-100 rounded w-full" />
                <div className="h-3 bg-zinc-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : content.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl py-20 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
            <FileText className="h-7 w-7 text-zinc-300" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-700 mb-1">No content yet</h3>
          <p className="text-xs text-zinc-400 mb-5 max-w-xs text-center">
            Create your first WhatsApp message or campaign
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            New Content
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.map((item) => {
            const statusConf = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = statusConf?.icon || FileText;
            return (
              <Card key={item.id} className="group hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-zinc-900 leading-tight">{item.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge variant={statusConf?.variant || "secondary"}>
                        <StatusIcon className="h-2.5 w-2.5 mr-1" />
                        {statusConf?.label || item.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                    {truncate(item.content, 100)}
                  </p>
                  {item.media?.length > 0 && (
                    <div className="flex gap-1.5 mb-3">
                      {item.media.slice(0, 3).map((m, idx) => (
                        <div key={idx} className="h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                          {m.media_type === "image" ? (
                            <img src={m.media_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Image className="h-5 w-5 text-zinc-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      {item.next_run_at && (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>{new Date(item.next_run_at).toLocaleDateString()}</span>
                        </>
                      )}
                      {!item.next_run_at && (
                        <span>{formatRelativeTime(item.created_at)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setError(null); }}
        title="New Content"
        description="Compose a new WhatsApp message or campaign"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{error}</div>
          )}
          <Input
            label="Title *"
            placeholder="e.g. Weekly Product Update"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Message Content *</label>
            <textarea
              className="w-full h-40 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder="Write your WhatsApp message here…&#10;&#10;Use {{customer.name}}, {{product_name}}, {{price}} as variables."
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
            <p className="text-[10px] text-zinc-400">
              Supports variables: {`{{customer.name}}`}, {`{{product_name}}`}, {`{{price}}`}, {`{{current_date}}`}
            </p>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Status</label>
            <select
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 text-sm">
              Cancel
            </Button>
            <Button onClick={handleCreate} isLoading={saving} className="flex-1 text-sm gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Create Content
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
