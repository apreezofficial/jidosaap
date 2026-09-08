"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAgent } from "@/hooks/useAgents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ArrowLeft, Bot, Save, CheckCircle2, Wrench, BookOpen, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const AVAILABLE_TOOLS = [
  { id: "searchKnowledgeBase",  label: "Search Knowledge Base" },
  { id: "searchProducts",       label: "Search Products" },
  { id: "createLead",           label: "Create Lead" },
  { id: "updateLead",           label: "Update Lead" },
  { id: "addContactTag",        label: "Add Contact Tag" },
  { id: "requestHumanHandoff",  label: "Human Handoff" },
];

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const { agent, loading } = useAgent(agentId);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (agent) {
      setForm({
        name: agent.name,
        description: agent.description,
        personality: agent.personality,
        tone: agent.tone,
        language: agent.language,
        business_info: agent.business_info || "",
        instructions: agent.instructions || "",
        status: agent.status,
        tools: agent.tools?.map((t) => t.tool_name) || [],
      });
    }
  }, [agent]);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    const res = await api.patch(`/agents/${agentId}`, form);
    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const toggleTool = (toolId: string) => {
    setForm((f: any) => ({
      ...f,
      tools: f.tools.includes(toolId)
        ? f.tools.filter((t: string) => t !== toolId)
        : [...f.tools, toolId],
    }));
  };

  if (loading || !form) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-100 rounded w-1/3" />
        <div className="h-48 bg-zinc-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/agents">
            <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Bot className="h-5 w-5 text-rose-500" />
              {agent?.name}
            </h1>
            <Badge variant={form.status === "active" ? "success" : "secondary"}>{form.status}</Badge>
          </div>
        </div>
        <Button onClick={handleSave} isLoading={saving} size="sm" className="gap-1.5 text-xs">
          {saved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-5">
        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Identity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input label="Agent Name" value={form.name} onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))} />
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Description</label>
              <textarea
                className="w-full h-16 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                value={form.description}
                onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["tone", "language", "status"].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700 capitalize">{field}</label>
                  <input
                    className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                    value={form[field]}
                    onChange={(e) => setForm((f: any) => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Business Context</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Business Information</label>
              <textarea
                className="w-full h-24 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                value={form.business_info}
                onChange={(e) => setForm((f: any) => ({ ...f, business_info: e.target.value }))}
                placeholder="Describe your business, products, and services…"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Instructions</label>
              <textarea
                className="w-full h-32 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-xs"
                value={form.instructions}
                onChange={(e) => setForm((f: any) => ({ ...f, instructions: e.target.value }))}
                placeholder="Specific instructions for agent behavior. These are kept confidential from customers."
              />
              <p className="text-[10px] text-zinc-400">
                Instructions are protected against prompt injection. Customers cannot override these.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Enabled Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_TOOLS.map((tool) => (
                <label
                  key={tool.id}
                  className={cn(
                    "flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors",
                    form.tools.includes(tool.id)
                      ? "border-rose-300 bg-rose-50"
                      : "border-zinc-200 hover:bg-zinc-50"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={form.tools.includes(tool.id)}
                    onChange={() => toggleTool(tool.id)}
                    className="rounded text-rose-600"
                  />
                  <span className="text-xs font-medium text-zinc-800">{tool.label}</span>
                  {form.tools.includes(tool.id) && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {agent?.knowledge_bases && agent.knowledge_bases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Knowledge Bases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {agent.knowledge_bases.map((kb: any) => (
                  <div key={kb.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">{kb.name}</p>
                      <p className="text-[10px] text-zinc-400">{kb.document_count} documents</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
