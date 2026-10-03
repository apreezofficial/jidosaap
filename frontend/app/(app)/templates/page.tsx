"use client";

import React, { useState } from "react";
import { useTemplates } from "@/hooks/useContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Plus, FileText, Copy, Trash2, Tag, ChevronRight, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

const CATEGORY_COLORS: Record<string, string> = {
  marketing:   "bg-blue-50 text-[#2563eb] border-blue-200",
  utility:     "bg-blue-50 text-blue-700 border-blue-200",
  transactional:"bg-violet-50 text-violet-700 border-violet-200",
  support:     "bg-amber-50 text-amber-700 border-amber-200",
};

const DEFAULT_TEMPLATES = [
  {
    id: "tmpl-1",
    name: "24/7 AI Lead Qualification & Rate Card",
    category: "marketing",
    header: "New Inbound Inquiry Response",
    body: "Hello {{contact_name}}, thank you for reaching out! Our retainers start at $1,800/mo. Here is our booking link to schedule a 15-minute consultation: {{booking_url}}",
    footer: "Powered by JidoSapp Auto-Responder",
    status: "approved",
    language: "en",
    variables: ["contact_name", "booking_url"],
    created_at: new Date().toISOString(),
  },
  {
    id: "tmpl-2",
    name: "7:00 AM Consistency Engine Drop",
    category: "marketing",
    header: "Morning Design Drop",
    body: "Morning drop: {{drop_title}} is now live. Check the full breakdown with tracked link on our isolated subdomain: {{drop_url}}",
    footer: "Reply STOP to unsubscribe",
    status: "approved",
    language: "en",
    variables: ["drop_title", "drop_url"],
    created_at: new Date().toISOString(),
  },
  {
    id: "tmpl-3",
    name: "Group Buddy Anti-Spam Warning Notice",
    category: "utility",
    header: "Community Guardian Alert",
    body: "Warning [Strike {{strike_count}}/3]: @{{user_name}}, promotional or unauthorized links are prohibited in this group. Repeat offenses result in immediate exit.",
    footer: "Protected by JidoSapp Sentinel",
    status: "approved",
    language: "en",
    variables: ["strike_count", "user_name"],
    created_at: new Date().toISOString(),
  },
  {
    id: "tmpl-4",
    name: "Newsletter Status Bridge Release Card",
    category: "marketing",
    header: "New Essay Published",
    body: "Fresh issue live on penna.dev: {{issue_title}}. Tap to read: {{tracked_url}}",
    footer: "Bridged via onos.jidosaap.xyz",
    status: "approved",
    language: "en",
    variables: ["issue_title", "tracked_url"],
    created_at: new Date().toISOString(),
  },
];

export default function TemplatesPage() {
  const { templates: apiTemplates, loading, refetch } = useTemplates();
  const templates = apiTemplates.length > 0 ? apiTemplates : DEFAULT_TEMPLATES;
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", body: "", header: "", footer: "",
    category: "marketing", language: "en",
    variables: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!form.name || !form.body) return;
    setSaving(true);
    setError(null);
    const res = await api.post("/content/templates", {
      ...form,
      variables: form.variables.split(",").map((v) => v.trim()).filter(Boolean),
    });
    setSaving(false);
    if (res.success) {
      setShowCreate(false);
      setForm({ name: "", body: "", header: "", footer: "", category: "marketing", language: "en", variables: "" });
      refetch();
    } else {
      setError(res.error?.message ?? "Failed to create template");
    }
  };

  const handleCopy = (body: string, id: string) => {
    navigator.clipboard.writeText(body);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Templates</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {templates.length} reusable message templates
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          New Template
        </Button>
      </div>

      {/* Star Use Case Starter Blueprints */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 rounded-2xl p-5 text-white border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#2563eb] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">Featured WhatsApp Blueprints</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">1-Tap Preset Loaders</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              setForm({
                name: "24/7 AI Lead Qualification & Rate Card",
                category: "marketing",
                header: "New Inbound Inquiry Response",
                body: "Hello {{contact_name}}, thank you for reaching out. Here is our overview deck and current pricing: {{pricing_url}}\n\nWould you like to schedule a 15-minute consultation?",
                footer: "Powered by JidoSapp Auto-Responder",
                language: "en",
                variables: "contact_name, pricing_url",
              });
              setShowCreate(true);
            }}
            className="p-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-all group"
          >
            <div className="text-xs font-bold text-blue-400 group-hover:text-blue-300">
              AI Lead Response &amp; Rate Card
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Instant welcome, portfolio link, and consultation booking.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({
                name: "Daily Scheduled Portfolio & Drop Broadcast",
                category: "marketing",
                header: "Daily Creative Drop · Morning Brief",
                body: "Today's featured concept: {{project_name}}.\n\nCrafted for high-growth teams. Reply directly to reserve your slot for this week's sprint!",
                footer: "Consistency powered by JidoSapp",
                language: "en",
                variables: "project_name",
              });
              setShowCreate(true);
            }}
            className="p-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-all group"
          >
            <div className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
              Daily Drop &amp; Portfolio Broadcast
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Client-attracting morning portfolio broadcast template.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({
                name: "Group Buddy Anti-Spam Warning Notice",
                category: "utility",
                header: "Community Guardian Alert",
                body: "Warning [Strike {{strike_count}}/2]: @{{user_name}}, promotional or unauthorized links are prohibited in this group. Repeat offenses result in immediate exit.",
                footer: "Protected by JidoSapp Sentinel",
                language: "en",
                variables: "strike_count, user_name",
              });
              setShowCreate(true);
            }}
            className="p-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-all group"
          >
            <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              Group Buddy Anti-Spam Notice
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Real-time strike warning notice for group spam links.
            </p>
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 animate-pulse h-40" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl py-20 flex flex-col items-center">
          <FileText className="h-10 w-10 text-zinc-200 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-700 mb-1">No templates yet</h3>
          <p className="text-xs text-zinc-400 mb-5 max-w-xs text-center">
            Create reusable message templates with variable placeholders
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tmpl: any) => (
            <Card key={tmpl.id} className="p-5 group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">{tmpl.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      CATEGORY_COLORS[tmpl.category] || "bg-zinc-100 text-zinc-700 border-zinc-200"
                    )}>
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-medium">{tmpl.language}</span>
                  </div>
                </div>
                <Badge variant={tmpl.status === "approved" ? "success" : "secondary"}>
                  {tmpl.status}
                </Badge>
              </div>

              {tmpl.header && (
                <p className="text-xs font-semibold text-zinc-600 mb-1">{tmpl.header}</p>
              )}
              <div className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 mb-3">
                <p className="text-xs text-zinc-700 whitespace-pre-wrap leading-relaxed">{tmpl.body}</p>
              </div>
              {tmpl.footer && (
                <p className="text-[10px] text-zinc-400 italic mb-2">{tmpl.footer}</p>
              )}

              {tmpl.variables?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {tmpl.variables.map((v: string) => (
                    <span key={v} className="text-[10px] bg-violet-50 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded-full font-mono">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                <span className="text-[10px] text-zinc-400">{formatRelativeTime(tmpl.created_at)}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopy(tmpl.body, tmpl.id)}
                    className="p-1.5 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    title="Copy body"
                  >
                    {copied === tmpl.id ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
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
        title="New Template"
        description="Create a reusable WhatsApp message template"
        maxWidth="lg"
      >
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{error}</div>
          )}
          <Input
            label="Template Name *"
            placeholder="e.g. product_promotion"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Category</label>
              <select
                className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb] bg-white"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {["marketing", "utility", "transactional", "support"].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Language</label>
              <select
                className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb] bg-white"
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
              >
                {[["en","English"],["es","Spanish"],["pt","Portuguese"],["fr","French"],["ar","Arabic"]].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Header (optional)"
            placeholder="Bold header text"
            value={form.header}
            onChange={(e) => setForm((f) => ({ ...f, header: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Message Body *</label>
            <textarea
              className="w-full h-32 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb] font-mono"
              placeholder={"{{product_name}} is now available!\n\nPrice: {{price}}\nStock: {{stock}} remaining\n\nMessage us to order."}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
          </div>
          <Input
            label="Footer (optional)"
            placeholder="Reply STOP to unsubscribe"
            value={form.footer}
            onChange={(e) => setForm((f) => ({ ...f, footer: e.target.value }))}
          />
          <Input
            label="Variables (comma-separated)"
            placeholder="product_name, price, stock"
            value={form.variables}
            onChange={(e) => setForm((f) => ({ ...f, variables: e.target.value }))}
          />
        </div>
        <div className="flex gap-2 pt-4 border-t border-zinc-100 mt-4">
          <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 text-sm">Cancel</Button>
          <Button onClick={handleCreate} isLoading={saving} className="flex-1 text-sm gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Create Template
          </Button>
        </div>
      </Modal>
    </div>
  );
}
