"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Radio,
  Clock,
  Sparkles,
  Send,
  Plus,
  Calendar,
  CheckCircle2,
  Eye,
  MousePointerClick,
  ExternalLink,
  ChevronRight,
  Smartphone,
  Image as ImageIcon,
  Share2,
  Layers,
  Globe,
  RefreshCw,
} from "lucide-react";

interface StatusDrop {
  id: string;
  category: "7am_drop" | "newsletter_bridge" | "group_broadcast";
  title: string;
  subtitle: string;
  subdomainUrl: string;
  scheduledTime: string;
  status: "queued" | "published" | "draft";
  subscribers: number;
  views: number;
  clicks: number;
  image: string;
  caption: string;
}

const INITIAL_DROPS: StatusDrop[] = [
  {
    id: "drop-1",
    category: "7am_drop",
    title: "UI Design System Drop #14: The Linear Aesthetic",
    subtitle: "Daily morning showcase for high-ticket design retainer prospects",
    subdomainUrl: "https://onos.jidosaap.xyz/drops/linear-aesthetic",
    scheduledTime: "Tomorrow 07:00 AM Sharp",
    status: "queued",
    subscribers: 1240,
    views: 0,
    clicks: 0,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    caption: "Morning Drop #14: How we engineered the Linear-style dark mode design system. Open for 2 retainer client sprints starting Monday. Read full breakdown at onos.jidosaap.xyz/drops/linear-aesthetic",
  },
  {
    id: "drop-2",
    category: "newsletter_bridge",
    title: "Essay #48: The Architecture of Clean APIs",
    subtitle: "Bridged from Penna webhook with 1-tap WhatsApp story card generation",
    subdomainUrl: "https://precious.jidosaap.xyz/read/48",
    scheduledTime: "Published Today",
    status: "published",
    subscribers: 1240,
    views: 890,
    clicks: 420,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    caption: "New essay up on penna.dev! How modern micro-SaaS isolates webhooks at edge. Read the full breakdown with tracked link: precious.jidosaap.xyz/read/48",
  },
  {
    id: "drop-3",
    category: "7am_drop",
    title: "Typography Hierarchy in Modern Web Apps",
    subtitle: "Consistency engine drop delivered to design community contacts",
    subdomainUrl: "https://onos.jidosaap.xyz/drops/typography",
    scheduledTime: "Yesterday 07:00 AM",
    status: "published",
    subscribers: 1240,
    views: 1120,
    clicks: 340,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    caption: "Why Outfit + JetBrains Mono is the ultimate pairing for developer tools. View typography guide: onos.jidosaap.xyz/drops/typography",
  },
];

export default function StatusDropsStudioPage() {
  const [drops, setDrops] = useState<StatusDrop[]>(INITIAL_DROPS);
  const [selectedDrop, setSelectedDrop] = useState<StatusDrop>(INITIAL_DROPS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Quick form state
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState<StatusDrop["category"]>("7am_drop");

  const handleCreateDrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: StatusDrop = {
      id: `drop-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      subtitle: newCategory === "7am_drop" ? "Scheduled 7:00 AM Consistency Drop" : "Newsletter Bridge Story Card",
      subdomainUrl: `https://onos.jidosaap.xyz/drops/${Date.now()}`,
      scheduledTime: "Tomorrow 07:00 AM Sharp",
      status: "queued",
      subscribers: 1240,
      views: 0,
      clicks: 0,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      caption: newCaption.trim() || newTitle.trim(),
    };

    setDrops([created, ...drops]);
    setSelectedDrop(created);
    setShowCreateModal(false);
    setNewTitle("");
    setNewCaption("");
  };

  const filteredDrops = drops.filter((d) => {
    if (categoryFilter === "all") return true;
    return d.category === categoryFilter;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 select-none font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold flex items-center gap-1.5">
              <Radio className="h-3 w-3" />
              <span>WhatsApp Status Drops & Broadcast Studio</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold font-mono">
              onos.jidosaap.xyz
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Status Drops & Newsletter Bridge
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            1-Tap publish directly to WhatsApp Status. Queue 7:00 AM morning drops with tracked links on your isolated subdomain.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="gap-1.5 text-xs bg-[#2563eb] hover:bg-[#1d4ed8]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Queue New Status Drop</span>
          </Button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: Queue List (Left) + WhatsApp Mobile Story Preview (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Broadcast Queue */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl text-xs font-semibold text-zinc-600">
            {[
              { id: "all", label: "All Drops" },
              { id: "7am_drop", label: "7:00 AM Consistency Engine" },
              { id: "newsletter_bridge", label: "Newsletter Bridge (Penna)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCategoryFilter(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all",
                  categoryFilter === f.id
                    ? "bg-white text-zinc-950 shadow-2xs"
                    : "hover:text-zinc-950"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredDrops.map((drop) => (
              <div
                key={drop.id}
                onClick={() => setSelectedDrop(drop)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer bg-white space-y-3 shadow-2xs hover:shadow-xs",
                  selectedDrop.id === drop.id
                    ? "border-[#2563eb] ring-2 ring-[#2563eb]/10"
                    : "border-zinc-200/80 hover:border-zinc-300"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs",
                        drop.category === "7am_drop" ? "bg-purple-600" : "bg-[#2563eb]"
                      )}
                    >
                      {drop.category === "7am_drop" ? <Clock className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-950 leading-tight">
                        {drop.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{drop.subdomainUrl}</p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0",
                      drop.status === "queued" && "bg-purple-50 text-purple-700 border border-purple-200",
                      drop.status === "published" && "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    )}
                  >
                    {drop.status}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                  {drop.caption}
                </p>

                {/* Metrics row */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-700 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-zinc-400" />
                    <span>{drop.scheduledTime}</span>
                  </span>

                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="flex items-center gap-1 text-zinc-600">
                      <Eye className="h-3 w-3 text-zinc-400" />
                      <span>{drop.views.toLocaleString()} Views</span>
                    </span>
                    <span className="flex items-center gap-1 text-[#2563eb] font-bold">
                      <MousePointerClick className="h-3 w-3" />
                      <span>{drop.clicks} Clicks</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Columns: WhatsApp Mobile Story Card Mockup */}
        <div className="lg:col-span-5 rounded-[28px] border border-zinc-200/80 bg-zinc-950 text-white p-6 shadow-sm space-y-4 sticky top-20">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#00b4d8]" />
              <span className="text-xs font-bold tracking-wide uppercase font-mono text-zinc-300">
                WhatsApp Status Preview
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
              9:16 Story Card
            </span>
          </div>

          {/* Smartphone Simulator */}
          <div className="relative mx-auto w-full max-w-[300px] aspect-[9/16] rounded-[36px] bg-zinc-900 border-4 border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            {/* Background Story Image */}
            <img
              src={selectedDrop.image}
              alt="Story Preview"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />

            {/* Story Top Bar */}
            <div className="relative z-10 space-y-2">
              {/* Progress bars */}
              <div className="flex gap-1 h-1">
                <div className="flex-1 bg-white rounded-full" />
                <div className="flex-1 bg-white/40 rounded-full" />
                <div className="flex-1 bg-white/40 rounded-full" />
              </div>

              {/* Status Poster Profile */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-400">
                  OE
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Onos E.</p>
                  <p className="text-[10px] text-zinc-300">Today, 07:00 AM</p>
                </div>
              </div>
            </div>

            {/* Story Content & Tracked Link Card */}
            <div className="relative z-10 space-y-3">
              <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white space-y-2">
                <p className="text-xs font-bold leading-snug">{selectedDrop.title}</p>
                <p className="text-[11px] text-zinc-300 leading-relaxed line-clamp-3">
                  {selectedDrop.caption}
                </p>
              </div>

              {/* Swipe-Up / Tap Link Card */}
              <div className="p-2.5 rounded-xl bg-white text-zinc-950 flex items-center justify-between text-xs font-bold shadow-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <Globe className="h-3.5 w-3.5 text-[#2563eb] shrink-0" />
                  <span className="truncate text-[11px] font-mono">
                    {selectedDrop.subdomainUrl.replace("https://", "")}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 shrink-0" />
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-zinc-400 font-medium">
              1-Tap bridged via <span className="font-mono text-zinc-200">onos.jidosaap.xyz</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── QUEUE MODAL ── */}
      {showCreateModal && (
        <Modal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Queue WhatsApp Status Drop"
          className="max-w-md"
        >
          <form onSubmit={handleCreateDrop} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Drop Engine Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewCategory("7am_drop")}
                  className={cn(
                    "p-2.5 rounded-xl text-xs font-bold border transition-all text-left",
                    newCategory === "7am_drop"
                      ? "bg-purple-50 text-purple-700 border-purple-300"
                      : "bg-white text-zinc-700 border-zinc-200"
                  )}
                >
                  ⏰ 7:00 AM Consistency Drop
                </button>
                <button
                  type="button"
                  onClick={() => setNewCategory("newsletter_bridge")}
                  className={cn(
                    "p-2.5 rounded-xl text-xs font-bold border transition-all text-left",
                    newCategory === "newsletter_bridge"
                      ? "bg-blue-50 text-[#2563eb] border-blue-300"
                      : "bg-white text-zinc-700 border-zinc-200"
                  )}
                >
                  📰 Newsletter Status Bridge
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Drop Title</label>
              <Input
                placeholder="e.g. Design System Drop #15"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Story Caption & Tracked Copy</label>
              <textarea
                placeholder="Write the caption and CTA for WhatsApp Status..."
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full h-24 text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                Schedule Drop
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
