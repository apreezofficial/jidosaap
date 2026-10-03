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
  Bot,
  BookOpen,
  Wrench,
  ChevronRight,
  Trash2,
  MessageSquare,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  description: string;
  role: string;
  status: "active" | "inactive";
  latency: string;
  tone: string;
  language: string;
  tools: string[];
  knowledgeBases: string[];
}

const DEFAULT_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "24/7 Zero-Latency Rate Qualifier",
    role: "Retainer & Pricing AI Responder",
    description: "Detects pricing keywords on WhatsApp, answers retainer queries ($1,800/mo), qualifies budget, and issues Cal.com discovery booking links.",
    status: "active",
    latency: "1.2s",
    tone: "Professional, punchy, confident",
    language: "EN",
    tools: ["Rate Card Dispatcher", "Cal.com Scheduler", "CRM Lead Creator"],
    knowledgeBases: ["Q4 Retainer Rate Cards", "Case Studies & Deliverables"],
  },
  {
    id: "agent-2",
    name: "Group Shield Sentinel AI",
    role: "Anti-Spam & Community Moderator",
    description: "Monitors 4 WhatsApp groups. Evaluates suspicious messages, deletes Telegram/crypto phishing links in <1s, and enforces 3-strike mute/ban rules.",
    status: "active",
    latency: "0.8s",
    tone: "Authoritative & objective",
    language: "EN",
    tools: ["Phishing Regex Purger", "Strike & Mute Bot", "Admin Alert Hook"],
    knowledgeBases: ["Community Rulebook", "Banned Domains Whitelist"],
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    tone: "Professional",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: form.name.trim(),
      role: form.role || "Custom WhatsApp Bot",
      description: form.description || "Autonomous WhatsApp conversational agent.",
      status: "active",
      latency: "1.4s",
      tone: form.tone,
      language: "EN",
      tools: ["Auto-Responder", "CRM Lead Creator"],
      knowledgeBases: ["General Business FAQ"],
    };

    setAgents([...agents, newAgent]);
    setShowCreate(false);
    setForm({ name: "", role: "", description: "", tone: "Professional" });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Autonomous WhatsApp AI Personas</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold">
              Sub-2s Response Guarantee
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            WhatsApp AI Personas &amp; Agents
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure the AI brains answering client DMs and policing your WhatsApp communities around the clock.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowCreate(true)}
          className="gap-1.5 text-xs bg-[#2563eb] hover:bg-[#1d4ed8]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New AI Persona</span>
        </Button>
      </div>

      {/* ── AGENTS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-xs transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-50 text-[#2563eb] border border-blue-200 flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-950">{agent.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      ⚡ {agent.latency}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium">{agent.role}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                {agent.status}
              </span>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              {agent.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-500">
                <Wrench className="h-3.5 w-3.5 text-zinc-400" />
                <span className="font-semibold text-zinc-700">Connected Tools:</span>
                <span className="text-zinc-600">{agent.tools.join(" • ")}</span>
              </div>

              <div className="flex items-center gap-2 text-zinc-500">
                <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
                <span className="font-semibold text-zinc-700">Knowledge Sets:</span>
                <span className="text-zinc-600">{agent.knowledgeBases.join(" • ")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs">
              <span className="text-[11px] text-zinc-400 font-mono">
                Tone: <span className="text-zinc-700 font-semibold">{agent.tone}</span>
              </span>
              <Link
                href="/automations"
                className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                <span>Edit Prompts &amp; Rules</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE MODAL ── */}
      {showCreate && (
        <Modal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          title="Create WhatsApp AI Persona"
          className="max-w-md"
        >
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Persona Name</label>
              <Input
                placeholder="e.g. Agency Retainer Qualifier"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Role / Function</label>
              <Input
                placeholder="e.g. Pricing & Meeting Booking Bot"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Description & Objective</label>
              <textarea
                placeholder="How this AI agent should handle WhatsApp clients..."
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
                Save Persona
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
