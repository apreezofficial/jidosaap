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
  BookOpen,
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Bot,
  Sparkles,
  DollarSign,
  ShieldCheck,
  Radio,
} from "lucide-react";

interface KnowledgeSet {
  id: string;
  name: string;
  category: "pricing" | "group_shield" | "subdomain";
  description: string;
  documents: { name: string; size: string; updated: string }[];
  usedBy: string;
}

const DEFAULT_KNOWLEDGE_SETS: KnowledgeSet[] = [
  {
    id: "kb-1",
    name: "Q4 Retainer Rate Cards & Tiers",
    category: "pricing",
    description: "Defines the $1,800/mo and $3,500/mo retainer deliverables, scope limits, and Cal.com booking link rules used by the Auto-Responder.",
    documents: [
      { name: "Retainer Rates Breakdown Q4.pdf", size: "1.2 MB", updated: "2 days ago" },
      { name: "Cal.com 15-min Booking Protocol.txt", size: "14 KB", updated: "Yesterday" },
    ],
    usedBy: "24/7 Zero-Latency Rate Qualifier",
  },
  {
    id: "kb-2",
    name: "Group Shield Community Rules & Blacklist",
    category: "group_shield",
    description: "Phishing patterns, banned crypto keywords, unauthorized Telegram invite regex, and 3-strike mute policies.",
    documents: [
      { name: "Phishing & Scam Regex v3.json", size: "48 KB", updated: "Today" },
      { name: "Community Strike Escalation Guide.md", size: "22 KB", updated: "3 days ago" },
    ],
    usedBy: "Group Shield Sentinel AI",
  },
  {
    id: "kb-3",
    name: "Subdomain & Status Bridge Config",
    category: "subdomain",
    description: "Webhook secret verification rules for penna.dev and 9:16 WhatsApp Status Card dimension standards.",
    documents: [
      { name: "Penna Webhook Signing Protocol.txt", size: "8 KB", updated: "Sep 28" },
      { name: "Story Card Tracking Specs.md", size: "19 KB", updated: "Sep 29" },
    ],
    usedBy: "Newsletter Status Bridge",
  },
];

export default function KnowledgePage() {
  const [knowledgeSets, setKnowledgeSets] = useState<KnowledgeSet[]>(DEFAULT_KNOWLEDGE_SETS);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newSet: KnowledgeSet = {
      id: `kb-${Date.now()}`,
      name: form.name.trim(),
      category: "pricing",
      description: form.description || "Custom WhatsApp operational knowledge.",
      documents: [{ name: "Initial Spec.txt", size: "12 KB", updated: "Just now" }],
      usedBy: "24/7 Zero-Latency Auto-Responder",
    };

    setKnowledgeSets([...knowledgeSets, newSet]);
    setShowCreate(false);
    setForm({ name: "", description: "" });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" />
              <span>WhatsApp AI Knowledge &amp; Rate Cards</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
              Live Synced to Auto-Responder
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Rate Cards &amp; Knowledge Base
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Train your WhatsApp Auto-Responder on your retainer rates, Cal.com scheduling links, and community anti-spam rulebooks.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowCreate(true)}
          className="gap-1.5 text-xs bg-[#2563eb] hover:bg-[#1d4ed8]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Knowledge Set</span>
        </Button>
      </div>

      {/* ── KNOWLEDGE SETS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {knowledgeSets.map((kb) => (
          <div
            key={kb.id}
            className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center text-white",
                    kb.category === "pricing" && "bg-emerald-600",
                    kb.category === "group_shield" && "bg-amber-500",
                    kb.category === "subdomain" && "bg-[#2563eb]"
                  )}
                >
                  {kb.category === "pricing" && <DollarSign className="h-4 w-4" />}
                  {kb.category === "group_shield" && <ShieldCheck className="h-4 w-4" />}
                  {kb.category === "subdomain" && <Radio className="h-4 w-4" />}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-semibold">
                  {kb.documents.length} Docs
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-950 leading-tight">{kb.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{kb.description}</p>
              </div>

              {/* Documents List */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                {kb.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100 text-[11px]"
                  >
                    <span className="text-zinc-800 font-medium truncate max-w-[180px] flex items-center gap-1.5">
                      <FileText className="h-3 w-3 text-zinc-400 shrink-0" />
                      <span className="truncate">{doc.name}</span>
                    </span>
                    <span className="text-zinc-400 font-mono text-[10px]">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 text-xs">
              <span className="text-[10px] text-zinc-400 block mb-0.5">Used by:</span>
              <span className="font-semibold text-zinc-800 flex items-center gap-1">
                <Bot className="h-3 w-3 text-[#2563eb]" />
                <span>{kb.usedBy}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE MODAL ── */}
      {showCreate && (
        <Modal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          title="Create Rate Card / Knowledge Set"
          className="max-w-md"
        >
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Knowledge Title</label>
              <Input
                placeholder="e.g. 2026 Retainer Rate Cards"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Description & Scope</label>
              <textarea
                placeholder="Explain what pricing or rules this knowledge set provides to the bot..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-24 text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                Save Knowledge Set
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
