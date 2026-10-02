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
  Video,
  Bot,
  Zap,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function ChronoTaskDashboardHome() {
  const { user, currentWorkspace } = useAuth();

  // Greeting name
  const userName = user?.name ? user.name.split(" ")[0] : "Amanda";

  // To-do list state
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Finish the sales presentation for the client meeting at 2:00 PM", completed: false },
    { id: "2", text: "Send follow up WhatsApp drops to VIP cohort", completed: true },
    { id: "3", text: "Review customer moderation rules with marketing", completed: false },
    { id: "4", text: "Take 10 min break", completed: true },
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

  // Time tracker state
  const [seconds, setSeconds] = useState(15718); // 04:21:58
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

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

  const assignedTasks = [
    {
      code: "8",
      codeColor: "bg-rose-500",
      title: "New ideas for campaign",
      progress: 60,
      avatars: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      code: "7",
      codeColor: "bg-amber-500",
      title: "Change button",
      progress: 27,
      avatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      code: "6",
      codeColor: "bg-amber-400",
      title: "New BrandBook",
      progress: 95,
      avatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      code: "3",
      codeColor: "bg-emerald-500",
      title: "Wireframe for List",
      progress: 78,
      avatars: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      ],
    },
    {
      code: "2",
      codeColor: "bg-emerald-600",
      title: "Design PPT #4",
      progress: 100,
      avatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      ],
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12 select-none">
      {/* Display Greeting Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-900">
          Good morning, <span className="font-extrabold text-zinc-950">{userName}</span>
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/crm/leads"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200/80 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition-colors"
          >
            <span>View Board</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-[#2563eb] text-[10px]">Board</span>
          </Link>
          <button className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Top Row: To-do List | Time Tracker | Activity Rings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {/* 1. To-do List Card */}
        <div className="lg:col-span-5 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Pencil className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-bold text-zinc-950">To do list</h3>
            </div>

            {/* Quick Add Input */}
            <form onSubmit={addTodo} className="relative">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="+ Call Linda before vacation |"
                className="w-full text-xs font-medium text-zinc-700 placeholder:text-zinc-400 bg-transparent border-none focus:outline-none py-1"
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
                      "text-xs font-medium leading-relaxed",
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
          <div className="flex items-center gap-4 text-xs font-bold text-zinc-300 border-t border-zinc-100 pt-3">
            <span className="cursor-pointer hover:text-zinc-600">B</span>
            <span className="cursor-pointer hover:text-zinc-600 italic">I</span>
            <span className="cursor-pointer hover:text-zinc-600 underline">U</span>
            <span className="cursor-pointer hover:text-zinc-600">S</span>
          </div>
        </div>

        {/* 2. Time Tracker Widget (Warm Amber Gradient) */}
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
            <span className="text-xs font-bold tracking-wide">Time tracker</span>
            <button className="text-white/80 hover:text-white transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {/* Big Digital Display */}
          <div className="relative z-10 my-auto text-center">
            <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight">
              {formatTimer(seconds)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="h-10 w-10 rounded-full bg-white text-zinc-900 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title={isTimerRunning ? "Pause" : "Start"}
            >
              {isTimerRunning ? (
                <Pause className="h-4 w-4 fill-zinc-900" />
              ) : (
                <Play className="h-4 w-4 fill-zinc-900 ml-0.5" />
              )}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setSeconds(0);
              }}
              className="h-10 w-10 rounded-full bg-[#ff5252] text-white shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title="Stop and Reset"
            >
              <Square className="h-4 w-4 fill-white" />
            </button>
          </div>
        </div>

        {/* 3. Activity Widget (Dark Concentric Rings) */}
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

          {/* Content: Metrics on Left, Concentric Activity Rings on Right */}
          <div className="flex items-center justify-between my-auto gap-4">
            {/* Metric Bars */}
            <div className="space-y-4 text-xs font-medium">
              <div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                  <span className="w-1 h-3 rounded-full bg-amber-400" />
                  <span>Working hours</span>
                </div>
                <p className="text-lg font-bold text-white pl-2.5 mt-0.5">29/40</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                  <span className="w-1 h-3 rounded-full bg-cyan-400" />
                  <span>Tasks completed</span>
                </div>
                <p className="text-lg font-bold text-white pl-2.5 mt-0.5">8/12</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                  <span className="w-1 h-3 rounded-full bg-sky-500" />
                  <span>Projects completed</span>
                </div>
                <p className="text-lg font-bold text-white pl-2.5 mt-0.5">4/7</p>
              </div>
            </div>

            {/* Apple-style Concentric Rings SVG */}
            <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                {/* Background tracks */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="#27272a" strokeWidth="8" />
                <circle cx="60" cy="60" r="36" fill="none" stroke="#27272a" strokeWidth="8" />
                <circle cx="60" cy="60" r="24" fill="none" stroke="#27272a" strokeWidth="8" />

                {/* Outer Yellow/Amber Ring (Working hours 29/40 ~ 72%) */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeDasharray="301"
                  strokeDashoffset={301 - (301 * 0.725)}
                  strokeLinecap="round"
                />

                {/* Middle Cyan Ring (Tasks 8/12 ~ 66%) */}
                <circle
                  cx="60"
                  cy="60"
                  r="36"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="8"
                  strokeDasharray="226"
                  strokeDashoffset={226 - (226 * 0.66)}
                  strokeLinecap="round"
                />

                {/* Inner Blue Ring (Projects 4/7 ~ 57%) */}
                <circle
                  cx="60"
                  cy="60"
                  r="24"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="8"
                  strokeDasharray="150"
                  strokeDashoffset={150 - (150 * 0.57)}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Reminder Card | Tasks I've Assigned Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 4. Reminder Card */}
        <div className="lg:col-span-4 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-950">Reminder</h3>
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
              <h4 className="text-sm font-bold text-zinc-900">Today&apos;s Meeting</h4>
              <div className="h-6 w-6 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
                <Video className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-xs text-zinc-400">Meeting with marketing team</p>
          </div>

          <div className="rounded-2xl bg-zinc-50/80 border border-zinc-100 p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">People</p>
              <div className="flex -space-x-1.5 mt-1 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                  alt="A"
                  className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="B"
                  className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                  alt="C"
                  className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="D"
                  className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider text-right">Time</p>
              <div className="mt-1 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>13:00 - 13:45</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Tasks I've Assigned Card */}
        <div className="lg:col-span-8 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-5">
          {/* Header & Tabs */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold text-zinc-950">Tasks I&apos;ve assigned</h3>
            <button className="h-7 w-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
              <Plus className="h-3.5 w-3.5" />
            </button>
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
              <div key={idx} className="flex items-center justify-between gap-4 py-1">
                {/* Left: Code badge + title */}
                <div className="flex items-center gap-3 w-1/3 min-w-[160px]">
                  <span className={cn("h-6 w-6 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0", t.codeColor)}>
                    {t.code}
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 truncate">
                    {t.title}
                  </span>
                </div>

                {/* Center: Progress bar + percentage */}
                <div className="flex-1 flex items-center gap-3 max-w-xs">
                  <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        t.progress >= 100 ? "bg-rose-500" : "bg-sky-500"
                      )}
                      style={{ width: `${Math.min(t.progress, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-500 font-mono w-10 text-right">
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
