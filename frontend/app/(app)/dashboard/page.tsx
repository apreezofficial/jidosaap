"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Pencil,
  Search,
  MoreVertical,
  Pause,
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Calendar,
  Clock,
  Radio,
  SlidersHorizontal,
  Bot,
  Zap,
  MessageSquare,
  ShieldCheck,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function ChronoTaskDashboardHome() {
  const { user } = useAuth();

  // User Greeting
  const userName = user?.name ? user.name.split(" ")[0] : "Precious";
  const userFullName = user?.name || "Precious O.";
  const userInitials = userFullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Formatted Date
  const [formattedDate, setFormattedDate] = useState("Monday, September 30");

  useEffect(() => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(now);
    setFormattedDate(formatted);
  }, []);

  // To-do list state (Authentic JidoSapp WhatsApp Operations)
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Sync penna.dev status issue #48", completed: false },
    { id: "2", text: "7:00 AM designer drops broadcast queued", completed: true },
    { id: "3", text: "Review client automated inquiry transcripts", completed: false },
    { id: "4", text: "Verify group spam rules & strike limits", completed: true },
  ]);
  const [newTodoText, setNewTodoText] = useState("");

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos((prev) => [
      { id: Date.now().toString(), text: newTodoText.trim(), completed: false },
      ...prev,
    ]);
    setNewTodoText("");
  };

  // Autonomous Uptime Tracker state (live counter)
  const [seconds, setSeconds] = useState(15718); // 04:21:58
  const [isEngineRunning, setIsEngineRunning] = useState(true);

  useEffect(() => {
    if (!isEngineRunning) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isEngineRunning]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Activity widget state
  const [activityPeriod, setActivityPeriod] = useState<"weekly" | "daily">("weekly");

  // Assigned tasks tab state
  const [assignedTab, setAssignedTab] = useState<"Upcoming" | "Overdue" | "Completed">("Upcoming");

  // JidoSapp Core Automations & Broadcasts
  const assignedTasks = [
    {
      code: "SD",
      codeColor: "bg-[#2563eb]",
      title: "Status Drop: UI Case Study",
      progress: 60,
      subtext: "7:00 AM dispatch • 1,240 subscribers",
      avatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      code: "AR",
      codeColor: "bg-emerald-600",
      title: "Auto-Responder Rate Cards",
      progress: 95,
      subtext: "Instant rates & meeting booking sync",
      avatars: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      code: "GS",
      codeColor: "bg-amber-500",
      title: "Anti-Spam Group Shield",
      progress: 100,
      subtext: "4 groups active • 18 links purged",
      avatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      code: "WH",
      codeColor: "bg-[#00b4d8]",
      title: "VIP Inquiries & Stripe Webhook",
      progress: 78,
      subtext: "Auto-invoicing & checkout link dispatch",
      avatars: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      code: "PD",
      codeColor: "bg-indigo-600",
      title: "Sync penna.dev status issue #48",
      progress: 45,
      subtext: "Bi-directional webhook sync queued",
      avatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      ],
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12 select-none">
      {/* ── TOP DISPLAY GREETING HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/70 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold">
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Meta Cloud API Online</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-900">
            Good morning, <span className="font-extrabold text-zinc-950">{userName}</span>
          </h1>
        </div>

        {/* User Pill & Customize Controls */}
        <div className="flex items-center gap-3">
          {/* User profile avatar badge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs tracking-wider">
              {userInitials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-zinc-900 leading-tight">{userFullName}</p>
              <p className="text-[10px] text-zinc-400 font-medium">Admin / Workspace Owner</p>
            </div>
          </div>

          <button
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-zinc-200/80 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:text-zinc-950 transition-all active:scale-98"
            title="Customize Dashboard"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
            <span>Customize</span>
          </button>

          <Link
            href="/crm/leads"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#2563eb] text-white text-xs font-semibold shadow-xs hover:bg-[#1d4ed8] transition-all active:scale-98"
          >
            <span>Kanban Board</span>
          </Link>
        </div>
      </div>

      {/* ── TOP ROW: To-do List | Autonomous Uptime | Activity Rings ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 1. To-do list Card */}
        <div className="lg:col-span-5 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-[#2563eb]">
                  <Pencil className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold text-zinc-950">To do list</h3>
              </div>
              <span className="text-[11px] font-semibold text-zinc-400">
                {todos.filter((t) => t.completed).length}/{todos.length} done
              </span>
            </div>

            {/* Quick Add Input */}
            <form onSubmit={addTodo} className="relative">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="+ Create new operational task |"
                className="w-full text-xs font-medium text-zinc-700 placeholder:text-zinc-400 bg-zinc-50/70 border border-zinc-200/70 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2563eb] transition-all"
              />
            </form>

            {/* Task Checklist */}
            <div className="space-y-3 pt-1">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div
                    className={cn(
                      "mt-0.5 h-4 w-4 rounded-md border flex items-center justify-center transition-colors shrink-0",
                      todo.completed
                        ? "bg-[#2563eb] border-[#2563eb] text-white"
                        : "border-zinc-300 group-hover:border-zinc-400 bg-white"
                    )}
                  >
                    {todo.completed && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium leading-relaxed transition-colors",
                      todo.completed
                        ? "text-zinc-400 line-through"
                        : "text-zinc-800 group-hover:text-zinc-950"
                    )}
                  >
                    {todo.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom formatting toolbar */}
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300 border-t border-zinc-100 pt-3">
            <div className="flex items-center gap-4">
              <span className="cursor-pointer hover:text-zinc-600">B</span>
              <span className="cursor-pointer hover:text-zinc-600 italic">I</span>
              <span className="cursor-pointer hover:text-zinc-600 underline">U</span>
              <span className="cursor-pointer hover:text-zinc-600">S</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">Auto-saved</span>
          </div>
        </div>

        {/* 2. Autonomous Uptime Widget (Royal Blue & Amber Gradient) */}
        <div className="lg:col-span-3 rounded-[28px] bg-gradient-to-b from-amber-400 via-amber-500 to-amber-500 text-white p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          {/* Subtle Concentric Rings Graphic */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <circle cx="150" cy="150" r="80" stroke="white" strokeWidth="20" fill="none" />
              <circle cx="150" cy="150" r="120" stroke="white" strokeWidth="20" fill="none" />
            </svg>
          </div>

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase font-sans">Autonomous uptime</span>
            </div>
            <button className="text-white/80 hover:text-white transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {/* Big Digital Display: 04:21:58 */}
          <div className="relative z-10 my-auto text-center">
            <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight drop-shadow-xs">
              {formatTimer(seconds)}
            </span>
            <p className="text-[11px] font-semibold text-white/90 mt-1">
              Autonomous Engine Active • Meta Cloud API
            </p>
          </div>

          {/* Control Buttons */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsEngineRunning(!isEngineRunning)}
              className="h-10 w-10 rounded-full bg-white text-zinc-900 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title={isEngineRunning ? "Pause Autonomous Engine" : "Resume Autonomous Engine"}
            >
              {isEngineRunning ? (
                <Pause className="h-4 w-4 fill-zinc-900" />
              ) : (
                <Play className="h-4 w-4 fill-zinc-900 ml-0.5" />
              )}
            </button>
            <button
              onClick={() => {
                setIsEngineRunning(false);
                setSeconds(0);
              }}
              className="h-10 w-10 rounded-full bg-zinc-900 text-white shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title="Reset Engine Session"
            >
              <Square className="h-4 w-4 fill-white" />
            </button>
          </div>
        </div>

        {/* 3. Activity Widget (Authentic WhatsApp Automation Metrics & Concentric Rings) */}
        <div className="lg:col-span-4 rounded-[28px] bg-zinc-950 text-white p-6 shadow-sm flex flex-col justify-between min-h-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide text-zinc-200">Activity</span>
            <div className="flex bg-zinc-900 rounded-full p-0.5 text-[10px] font-semibold">
              <button
                onClick={() => setActivityPeriod("weekly")}
                className={cn(
                  "px-2.5 py-0.5 rounded-full transition-colors",
                  activityPeriod === "weekly" ? "bg-zinc-800 text-white" : "text-zinc-400"
                )}
              >
                weekly
              </button>
              <button
                onClick={() => setActivityPeriod("daily")}
                className={cn(
                  "px-2.5 py-0.5 rounded-full transition-colors",
                  activityPeriod === "daily" ? "bg-zinc-800 text-white" : "text-zinc-400"
                )}
              >
                daily
              </button>
            </div>
          </div>

          {/* Content: 3 Authentic WhatsApp Operational Metrics on Left, Concentric Activity Rings on Right */}
          <div className="flex items-center justify-between my-auto gap-4">
            {/* Metric Bars */}
            <div className="space-y-4 text-xs font-medium">
              <div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                  <span className="w-1 h-3 rounded-full bg-amber-400" />
                  <span>Messages dispatched</span>
                </div>
                <p className="text-lg font-bold text-white pl-2.5 mt-0.5">2,840/3,000</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                  <span className="w-1 h-3 rounded-full bg-cyan-400" />
                  <span>Inquiries resolved</span>
                </div>
                <p className="text-lg font-bold text-white pl-2.5 mt-0.5">842/910</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                  <span className="w-1 h-3 rounded-full bg-[#2563eb]" />
                  <span>Active automations</span>
                </div>
                <p className="text-lg font-bold text-white pl-2.5 mt-0.5">4/4 online</p>
              </div>
            </div>

            {/* Apple-style Concentric Rings SVG Representing the 3 Metrics */}
            <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                {/* Background tracks */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#27272a" strokeWidth="8" />
                <circle cx="60" cy="60" r="36" fill="none" stroke="#27272a" strokeWidth="8" />
                <circle cx="60" cy="60" r="24" fill="none" stroke="#27272a" strokeWidth="8" />

                {/* Outer Ring: Messages Dispatched (2840/3000 ~ 94.6%) */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeDasharray="301"
                  strokeDashoffset={301 - (301 * 0.946)}
                  strokeLinecap="round"
                />

                {/* Middle Ring: Inquiries Resolved (842/910 ~ 92.5%) */}
                <circle
                  cx="60"
                  cy="60"
                  r="36"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="8"
                  strokeDasharray="226"
                  strokeDashoffset={226 - (226 * 0.925)}
                  strokeLinecap="round"
                />

                {/* Inner Ring: Active Automations (4/4 ~ 100%) */}
                <circle
                  cx="60"
                  cy="60"
                  r="24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="8"
                  strokeDasharray="150"
                  strokeDashoffset={150 - (150 * 1.0)}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Upcoming Scheduled Broadcast | Tasks Assigned ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 4. Upcoming Scheduled Broadcast Card */}
        <div className="lg:col-span-4 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-bold text-zinc-950">Upcoming Broadcast</h3>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <button className="p-1 rounded-lg hover:bg-zinc-100 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1 rounded-lg hover:bg-zinc-100 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-900">7:00 AM Designer Drops</h4>
              <div className="h-6 w-6 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#2563eb]">
                <Send className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Daily status showcase &amp; portfolio dispatch to 1,240 subscribers.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 border border-zinc-100 p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Audience</p>
              <div className="flex items-center mt-1">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                    alt="Audience"
                    className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                    alt="Audience"
                    className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                    alt="Audience"
                    className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 ml-2">+1.2k</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Time</p>
              <div className="mt-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>07:00 AM Sharp</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Tasks Assigned / Active Automations Card */}
        <div className="lg:col-span-8 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-5">
          {/* Header & Tabs */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-zinc-950">Tasks assigned</h3>
              <p className="text-[11px] text-zinc-400 font-medium">Live pipeline &amp; autonomous campaign execution</p>
            </div>
            <Link
              href="/crm/leads"
              className="h-7 w-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
              title="Add task in board"
            >
              <Plus className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 text-xs font-semibold text-zinc-400">
            {(["Upcoming", "Overdue", "Completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAssignedTab(tab)}
                className={cn(
                  "relative py-1 transition-colors hover:text-zinc-900",
                  assignedTab === tab ? "text-[#2563eb]" : "text-zinc-400"
                )}
              >
                <span>{tab}</span>
                {assignedTab === tab && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* List items */}
          <div className="space-y-4 pt-2">
            {assignedTasks.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 py-1 group hover:bg-zinc-50/50 p-2 rounded-xl transition-colors">
                {/* Left: Code badge + title & subtext */}
                <div className="flex items-center gap-3 w-2/5 min-w-[200px]">
                  <span className={cn("h-7 w-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs", t.codeColor)}>
                    {t.code}
                  </span>
                  <div className="truncate">
                    <span className="text-xs font-bold text-zinc-900 truncate block">
                      {t.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium block truncate">
                      {t.subtext}
                    </span>
                  </div>
                </div>

                {/* Center: Progress bar + percentage */}
                <div className="flex-1 flex items-center gap-3 max-w-xs">
                  <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        t.progress >= 100 ? "bg-emerald-500" : "bg-[#2563eb]"
                      )}
                      style={{ width: `${Math.min(t.progress, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-600 font-mono w-10 text-right">
                    {t.progress}%
                  </span>
                </div>

                {/* Right: Stacked avatars */}
                <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                  {t.avatars.map((av, i) => (
                    <img
                      key={i}
                      src={av}
                      alt="Assignee"
                      className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
