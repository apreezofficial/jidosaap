"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Plus,
  MoreVertical,
  X,
  Edit2,
  Share2,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Paperclip,
  Check,
  ChevronRight,
  MessageSquare,
  Phone,
  DollarSign,
  Bot,
  UserCheck,
  Send,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface LeadItem {
  id: string;
  columnId: "inquiries" | "qualified" | "call_booked" | "won_retainer";
  name: string;
  phone: string;
  company?: string;
  avatar: string;
  inquiry: string;
  lastReply: string;
  value: number;
  currency: string;
  latency: string;
  botStatus: "auto_replied" | "human_takeover" | "booked";
  priority: "High" | "Medium" | "VIP";
  createdDate: string;
  dueDate?: string;
  transcript: { sender: string; text: string; time: string; isBot?: boolean }[];
  qualificationChecks: { id: string; title: string; completed: boolean }[];
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: "lead-1",
    columnId: "inquiries",
    name: "Alex Rivera",
    phone: "+1 (415) 890-2311",
    company: "SaaS Scale Studio",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    inquiry: "Hey! What are your retainer rates for ongoing product design & WhatsApp automation?",
    lastReply: "Auto-Responder sent $1,800/mo tier + discovery booking link.",
    value: 1800,
    currency: "USD",
    latency: "1.2s",
    botStatus: "auto_replied",
    priority: "VIP",
    createdDate: "Today 02:14 AM",
    transcript: [
      { sender: "Alex Rivera", text: "What are your retainer rates for ongoing product design?", time: "02:14 AM" },
      { sender: "Jido Autonomous Bot", text: "Our retainers start at $1,800/mo. Here is our booking link to claim one of our 2 open sprint slots: cal.com/onos/15min", time: "02:14 AM", isBot: true },
    ],
    qualificationChecks: [
      { id: "qc-1", title: "Budget >= $1,800/mo", completed: true },
      { id: "qc-2", title: "Cal.com discovery link delivered", completed: true },
      { id: "qc-3", title: "Follow-up automated reminder if unbooked after 4h", completed: false },
    ],
  },
  {
    id: "lead-2",
    columnId: "inquiries",
    name: "Elena Rostova",
    phone: "+44 7911 123456",
    company: "Crypto Builders DAO",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    inquiry: "We have 4 community groups with 8,000 members plagued by spam. Can Group Shield handle this volume?",
    lastReply: "Auto-Responder confirmed multi-tenant group scale & sent whitelist spec sheet.",
    value: 3500,
    currency: "USD",
    latency: "1.4s",
    botStatus: "auto_replied",
    priority: "High",
    createdDate: "Today 05:40 AM",
    transcript: [
      { sender: "Elena", text: "Can Group Shield handle 8,000 members across 4 groups?", time: "05:40 AM" },
      { sender: "Jido Autonomous Bot", text: "Yes! Group Shield handles unlimited members with sub-second link purges and anti-phishing regex. Here's our Enterprise plan preview.", time: "05:40 AM", isBot: true },
    ],
    qualificationChecks: [
      { id: "qc-4", title: "Group admin permissions verified", completed: true },
      { id: "qc-5", title: "Custom strike rules outlined", completed: false },
    ],
  },
  {
    id: "lead-3",
    columnId: "qualified",
    name: "Precious O.",
    phone: "+234 810 992 0184",
    company: "Essayist & Tech Founder",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    inquiry: "Need the 1-Tap newsletter to WhatsApp Status bridge connected to my subdomain.",
    lastReply: "Qualified: Confirmed penna.dev webhook active. Ready for subdomain activation.",
    value: 2200,
    currency: "USD",
    latency: "1.8s",
    botStatus: "auto_replied",
    priority: "VIP",
    createdDate: "Yesterday",
    transcript: [
      { sender: "Precious O.", text: "Want to publish directly from penna.dev to WhatsApp Status without copy-pasting.", time: "Sep 29" },
      { sender: "Jido Autonomous Bot", text: "Isolated subdomain provisioned at precious.jidosaap.xyz. Ready to sync story cards.", time: "Sep 29", isBot: true },
    ],
    qualificationChecks: [
      { id: "qc-6", title: "Subdomain SSL active", completed: true },
      { id: "qc-7", title: "Story card template approved", completed: true },
      { id: "qc-8", title: "Monthly retainer agreement sent", completed: true },
    ],
  },
  {
    id: "lead-4",
    columnId: "call_booked",
    name: "Marcus Vance",
    phone: "+1 (312) 555-0199",
    company: "Apex Capital Partners",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80",
    inquiry: "Booked 15-min discovery call via WhatsApp bot for tomorrow 2:00 PM.",
    lastReply: "Cal.com automated confirmation sent with Google Meet link.",
    value: 5000,
    currency: "USD",
    latency: "Instant",
    botStatus: "booked",
    priority: "VIP",
    createdDate: "Oct 01",
    dueDate: "Tomorrow, 2:00 PM",
    transcript: [
      { sender: "Marcus", text: "Looking for an agency retainer for WhatsApp broadcast marketing.", time: "Oct 01" },
      { sender: "Jido Autonomous Bot", text: "Confirmed! Your call is set for tomorrow at 2:00 PM EST.", time: "Oct 01", isBot: true },
    ],
    qualificationChecks: [
      { id: "qc-9", title: "Calendar invite synced", completed: true },
      { id: "qc-10", title: "Briefing deck generated", completed: true },
    ],
  },
  {
    id: "lead-5",
    columnId: "won_retainer",
    name: "Shola Visuals",
    phone: "+234 802 334 9102",
    company: "Brand Identity Studio",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
    inquiry: "Active $1,800/mo retainer client running 7:00 AM daily morning drops.",
    lastReply: "Retainer active. 1,240 subscribers receiving morning design showcases.",
    value: 1800,
    currency: "USD",
    latency: "1.1s",
    botStatus: "auto_replied",
    priority: "VIP",
    createdDate: "Sep 20",
    transcript: [
      { sender: "Shola", text: "The 7:00 AM drops brought 4 new client inquiries this morning!", time: "Sep 20" },
      { sender: "Onos E.", text: "Awesome! Consistency engine is doing its work.", time: "Sep 20" },
    ],
    qualificationChecks: [
      { id: "qc-11", title: "Monthly invoice on auto-pay", completed: true },
      { id: "qc-12", title: "7 AM cron drops running daily", completed: true },
    ],
  },
];

const COLUMNS = [
  { id: "inquiries", title: "New Inquiries (WhatsApp DM)", count: 2, color: "bg-blue-500" },
  { id: "qualified", title: "Auto-Replied & Qualified", count: 1, color: "bg-cyan-500" },
  { id: "call_booked", title: "Discovery Call Booked", count: 1, color: "bg-amber-500" },
  { id: "won_retainer", title: "Active Retainers Closed", count: 1, color: "bg-emerald-500" },
] as const;

export default function WhatsAppLeadsPipeline() {
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [activeTab, setActiveTab] = useState<"transcript" | "checks">("transcript");
  const [newCheckText, setNewCheckText] = useState("");

  const totalPipelineValue = leads.reduce((acc, l) => acc + l.value, 0);

  const moveLead = (leadId: string, targetCol: LeadItem["columnId"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, columnId: targetCol } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, columnId: targetCol } : null));
    }
  };

  const toggleCheck = (checkId: string) => {
    if (!selectedLead) return;
    const updatedChecks = selectedLead.qualificationChecks.map((c) =>
      c.id === checkId ? { ...c, completed: !c.completed } : c
    );
    const updated = { ...selectedLead, qualificationChecks: updatedChecks };
    setSelectedLead(updated);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const addCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckText.trim() || !selectedLead) return;
    const newCheck = { id: `qc-${Date.now()}`, title: newCheckText.trim(), completed: false };
    const updatedChecks = [...selectedLead.qualificationChecks, newCheck];
    const updated = { ...selectedLead, qualificationChecks: updatedChecks };
    setSelectedLead(updated);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setNewCheckText("");
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 select-none font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>WhatsApp Inquiries Auto-Captured</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold">
              Pipeline: ${totalPipelineValue.toLocaleString()}/mo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            WhatsApp High-Intent Lead Pipeline
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Every client inquiring on WhatsApp is automatically scored, sent your rate cards, and funneled into discovery calls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/inbox"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Live Chats</span>
          </Link>
          <Link
            href="/automations"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Rate Card Rules</span>
          </Link>
        </div>
      </div>

      {/* ── 4-COLUMN KANBAN PIPELINE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.columnId === col.id);
          const colTotal = colLeads.reduce((acc, l) => acc + l.value, 0);

          return (
            <div key={col.id} className="rounded-2xl bg-zinc-100/70 border border-zinc-200/80 p-4 space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", col.color)} />
                  <h3 className="text-xs font-bold text-zinc-900 truncate">{col.title}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-zinc-700 font-bold border border-zinc-200">
                    {colLeads.length}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                    ${colTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Column Cards */}
              <div className="space-y-3">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-xs hover:border-[#2563eb]/40 cursor-pointer transition-all space-y-3 group"
                  >
                    {/* Top Row: Avatar + Name + Phone + Value */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={lead.avatar}
                          alt={lead.name}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-zinc-950 group-hover:text-[#2563eb] transition-colors">
                            {lead.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-mono">{lead.phone}</p>
                        </div>
                      </div>

                      <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 shrink-0">
                        ${lead.value}/mo
                      </span>
                    </div>

                    {/* Inquiry quote */}
                    <div className="p-2.5 rounded-lg bg-zinc-50 text-[11px] text-zinc-600 border border-zinc-100 line-clamp-2 leading-relaxed">
                      &ldquo;{lead.inquiry}&rdquo;
                    </div>

                    {/* Footer: Latency + Status Pill */}
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[10px]">
                      <div className="flex items-center gap-1 text-zinc-500 font-mono">
                        <Zap className="h-3 w-3 text-amber-500" />
                        <span>{lead.latency} auto-reply</span>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full font-semibold font-mono",
                        lead.botStatus === "auto_replied" && "bg-blue-50 text-[#2563eb]",
                        lead.botStatus === "booked" && "bg-emerald-50 text-emerald-700",
                        lead.botStatus === "human_takeover" && "bg-purple-50 text-purple-700"
                      )}>
                        {lead.botStatus === "auto_replied" ? "Bot Qualified" : lead.botStatus === "booked" ? "Call Set" : "Human"}
                      </span>
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="p-6 text-center border-2 border-dashed border-zinc-200 rounded-xl">
                    <p className="text-xs text-zinc-400">No leads in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LEAD DETAIL MODAL (WhatsApp Conversation & Qualification) ── */}
      {selectedLead && (
        <Modal
          open={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          title={
            <div className="flex items-center gap-3">
              <img
                src={selectedLead.avatar}
                alt={selectedLead.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-zinc-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-950">{selectedLead.name}</h3>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ${selectedLead.value}/mo
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">{selectedLead.phone} • {selectedLead.company}</p>
              </div>
            </div>
          }
          className="max-w-2xl"
        >
          <div className="space-y-6 pt-2">
            {/* Quick Stage Mover */}
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-zinc-600">Pipeline Stage:</span>
              <div className="flex flex-wrap gap-1.5">
                {COLUMNS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => moveLead(selectedLead.id, c.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                      selectedLead.columnId === c.id
                        ? "bg-[#2563eb] text-white shadow-2xs"
                        : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                    )}
                  >
                    {c.title.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-zinc-100 pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("transcript")}
                className={cn(
                  "pb-1 transition-colors flex items-center gap-1.5",
                  activeTab === "transcript" ? "text-[#2563eb] border-b-2 border-[#2563eb]" : "text-zinc-400 hover:text-zinc-700"
                )}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp Transcript</span>
              </button>
              <button
                onClick={() => setActiveTab("checks")}
                className={cn(
                  "pb-1 transition-colors flex items-center gap-1.5",
                  activeTab === "checks" ? "text-[#2563eb] border-b-2 border-[#2563eb]" : "text-zinc-400 hover:text-zinc-700"
                )}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Qualification Checklist ({selectedLead.qualificationChecks.filter(c => c.completed).length}/{selectedLead.qualificationChecks.length})</span>
              </button>
            </div>

            {/* Tab 1: Transcript */}
            {activeTab === "transcript" && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-950 text-white space-y-3 max-h-64 overflow-y-auto font-sans">
                  {selectedLead.transcript.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-3 rounded-xl text-xs max-w-[85%]",
                        msg.isBot
                          ? "bg-[#2563eb] text-white ml-auto"
                          : "bg-zinc-800 text-zinc-100"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 text-[10px] opacity-80">
                        <span className="font-bold">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-zinc-400">
                    ⚡ Auto-replied with sub-2s latency via Meta Cloud API
                  </span>
                  <Link
                    href="/inbox"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline"
                  >
                    <span>Open in WhatsApp Inbox</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Tab 2: Qualification Checklist */}
            {activeTab === "checks" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {selectedLead.qualificationChecks.map((check) => (
                    <div
                      key={check.id}
                      onClick={() => toggleCheck(check.id)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
                    >
                      <div className={cn(
                        "h-4 w-4 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                        check.completed ? "bg-[#2563eb] border-[#2563eb] text-white" : "border-zinc-300 bg-white"
                      )}>
                        {check.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        check.completed ? "text-zinc-400 line-through" : "text-zinc-800"
                      )}>
                        {check.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add new check */}
                <form onSubmit={addCheck} className="flex gap-2">
                  <Input
                    placeholder="+ Add qualification requirement..."
                    value={newCheckText}
                    onChange={(e) => setNewCheckText(e.target.value)}
                    className="text-xs h-9"
                  />
                  <Button type="submit" size="sm" className="h-9 px-4 text-xs bg-[#2563eb] hover:bg-[#1d4ed8]">
                    Add
                  </Button>
                </form>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
