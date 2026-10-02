"use client";

import React, { useState } from "react";
import { useAgents } from "@/hooks/useAgents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Plus, Bot, BookOpen, Wrench, ChevronRight, Trash2,
  MessageSquare, Zap, CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const AVAILABLE_TOOLS = [
  { id: "searchKnowledgeBase",   label: "Search Knowledge Base",  desc: "Look up information from uploaded documents" },
  { id: "searchProducts",        label: "Search Products",         desc: "Find product information from your catalog" },
  { id: "createLead",            label: "Create Lead",             desc: "Automatically create CRM leads from conversations" },
  { id: "updateLead",            label: "Update Lead",             desc: "Update existing leads in the CRM" },
  { id: "addContactTag",         label: "Add Contact Tag",         desc: "Tag contacts for segmentation" },
  { id: "requestHumanHandoff",   label: "Human Handoff",           desc: "Escalate conversations to a human agent" },
];

export default function AgentsPage() {
  const { agents, loading, refetch } = useAgents();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", personality: "professional",
    tone: "professional", language: "en",
    business_info: "", instructions: "",
    tools: ["searchKnowledgeBase", "createLead", "requestHumanHandoff"],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!form.name) return;
    setSaving(true);
    setError(null);
    const res = await api.post("/agents", form);
    setSaving(false);
    if (res.success) {
      setShowCreate(false);
      setForm({
        name: "", description: "", personality: "professional",
        tone: "professional", language: "en",
        business_info: "", instructions: "",
        tools: ["searchKnowledgeBase", "createLead", "requestHumanHandoff"],
      });
      refetch();
    } else {
      setError(res.error?.message ?? "Failed to create agent");
    }
  };

  const toggleTool = (toolId: string) => {
    setForm((f) => ({
      ...f,
      tools: f.tools.includes(toolId)
        ? f.tools.filter((t) => t !== toolId)
        : [...f.tools, toolId],
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this AI agent?")) return;
    await api.delete(`/agents/${id}`);
    refetch();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">AI Agents</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure AI agents to handle customer conversations automatically
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          New Agent
        </Button>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl py-20 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
            <Bot className="h-7 w-7 text-zinc-300" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-700 mb-1">No AI agents yet</h3>
          <p className="text-xs text-zinc-400 mb-5 max-w-xs text-center">
            Create your first AI agent to automatically handle customer conversations
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Create Agent
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    agent.status === "active" ? "bg-blue-50" : "bg-zinc-100"
                  )}>
                    <Bot className={cn("h-5 w-5", agent.status === "active" ? "text-[#2563eb]" : "text-zinc-400")} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{agent.name}</h3>
                    <Badge variant={agent.status === "active" ? "success" : "secondary"}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {agent.description && (
                <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{agent.description}</p>
              )}

              <div className="flex items-center gap-3 text-[11px] text-zinc-500 mb-4">
                <span className="flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  {agent.tool_count} tools
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {agent.knowledge_base_count} KB
                </span>
                <span className="capitalize">{agent.tone}</span>
                <span className="uppercase">{agent.language}</span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
                <Link href={`/agents/${agent.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                    <ChevronRight className="h-3.5 w-3.5" />
                    Configure
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setError(null); }}
        title="New AI Agent"
        description="Configure an AI agent to handle customer conversations"
        maxWidth="lg"
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{error}</div>
          )}
          <Input
            label="Agent Name *"
            placeholder="e.g. Jido Sales Assistant"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Description</label>
            <input
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
              placeholder="What does this agent do?"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Tone</label>
              <select
                className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb] bg-white"
                value={form.tone}
                onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value }))}
              >
                {["professional", "friendly", "formal", "casual", "sales"].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
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
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Business Information</label>
            <textarea
              className="w-full h-20 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
              placeholder="Describe your business, products, services…"
              value={form.business_info}
              onChange={(e) => setForm((f) => ({ ...f, business_info: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Agent Instructions</label>
            <textarea
              className="w-full h-24 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
              placeholder="Specific instructions for how the agent should behave…"
              value={form.instructions}
              onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
            />
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-700">Enabled Tools</label>
            <div className="space-y-1.5">
              {AVAILABLE_TOOLS.map((tool) => (
                <label
                  key={tool.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-50"
                >
                  <input
                    type="checkbox"
                    checked={form.tools.includes(tool.id)}
                    onChange={() => toggleTool(tool.id)}
                    className="rounded text-[#2563eb] focus:ring-[#2563eb]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-900">{tool.label}</p>
                    <p className="text-[10px] text-zinc-400">{tool.desc}</p>
                  </div>
                  {form.tools.includes(tool.id) && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-zinc-100 mt-4">
          <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 text-sm">Cancel</Button>
          <Button onClick={handleCreate} isLoading={saving} className="flex-1 text-sm gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            Create Agent
          </Button>
        </div>
      </Modal>
    </div>
  );
}
