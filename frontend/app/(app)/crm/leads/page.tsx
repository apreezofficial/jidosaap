"use client";

import React, { useState } from "react";
import { usePipeline } from "@/hooks/useCrm";
import { useContacts } from "@/hooks/useContacts";
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
  Download,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  UserPlus,
  Layers,
  Sparkles,
  Paperclip,
  Check,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { api } from "@/lib/api";

interface TaskItem {
  id: string;
  columnId: "todo" | "in_progress" | "completed";
  code: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  progress: number;
  previewType?: "buttons" | "cards" | "none";
  priority: string;
  createdDate: string;
  dueDate: string;
  assignees: { name: string; avatar: string }[];
  attachments: { name: string; size: string; type: string }[];
  subtasks: { id: string; title: string; completed: boolean; note?: string; assignee?: string; date?: string }[];
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "task-1",
    columnId: "todo",
    code: "8",
    tag: "UI/UX Design",
    tagColor: "bg-orange-50 text-orange-700 border-orange-200/80",
    title: "Design System",
    description: "Create UI components (buttons, inputs, modals) following the design tokens.",
    progress: 65,
    previewType: "buttons",
    priority: "A",
    createdDate: "Jul 10, 2025 09:30 AM",
    dueDate: "Jul 25, 2025",
    assignees: [
      { name: "Amanda Black", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" },
      { name: "David Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
    ],
    attachments: [
      { name: "Design Tokens v1.2", size: "1.85 MB", type: "PDF" },
    ],
    subtasks: [
      { id: "st-1", title: "Button variants and hover states", completed: true },
      { id: "st-2", title: "Form input validation borders", completed: true },
      { id: "st-3", title: "Modal elevation drop shadows", completed: false },
    ],
  },
  {
    id: "task-2",
    columnId: "todo",
    code: "6",
    tag: "UI/UX Design",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200/80",
    title: "User Research",
    description: "Define target audience, customer personas, and primary use cases.",
    progress: 60,
    priority: "B",
    createdDate: "Jul 11, 2025 02:15 PM",
    dueDate: "Jul 26, 2025",
    assignees: [
      { name: "Sarah Miller", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" },
      { name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" },
    ],
    attachments: [
      { name: "User Interviews Transcript", size: "3.10 MB", type: "PDF" },
    ],
    subtasks: [
      { id: "st-4", title: "5 User interviews conducted", completed: true },
      { id: "st-5", title: "Synthesize affinity map", completed: false },
    ],
  },
  {
    id: "task-3",
    columnId: "todo",
    code: "3",
    tag: "Development",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    title: "Front-End Setup",
    description: "Choose tech stack (Next.js, Tailwind CSS) and setup ESLint.",
    progress: 35,
    priority: "C",
    createdDate: "Jul 14, 2025 11:00 AM",
    dueDate: "Jul 30, 2025",
    assignees: [
      { name: "David Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
      { name: "Michael Reed", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80" },
    ],
    attachments: [],
    subtasks: [
      { id: "st-6", title: "Initialize repository and husky hooks", completed: true },
      { id: "st-7", title: "Configure Tailwind design palette", completed: false },
    ],
  },
  {
    id: "task-4",
    columnId: "in_progress",
    code: "8",
    tag: "Graphic Design",
    tagColor: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80",
    title: "New BrandBook",
    description: "Develop a comprehensive BrandBook that defines and documents the visual and verbal identity of the brand. This guide will serve as a reference for all internal teams and external partners.",
    progress: 30,
    priority: "B",
    createdDate: "Jul 12, 2025 12:45 PM",
    dueDate: "Jul 28, 2025",
    assignees: [
      { name: "Amanda Black", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" },
    ],
    attachments: [
      { name: "Design Brief", size: "2.45 MB", type: "PDF" },
      { name: "Company info", size: "5.25 MB", type: "PDF" },
    ],
    subtasks: [
      {
        id: "st-8",
        title: "Define Brand Identity (Mission, Vision, Values)",
        completed: false,
        note: "Develop and finalize the core elements of the brand identity, including the brand's mission statement, and vision statement.",
        assignee: "Amanda Black",
        date: "Jul 28, 2025",
      },
      { id: "st-9", title: "Create sample brand messages and taglines.", completed: true },
      { id: "st-10", title: "Mockups for website, mobile, print, and packaging", completed: false },
    ],
  },
  {
    id: "task-5",
    columnId: "in_progress",
    code: "7",
    tag: "Project management",
    tagColor: "bg-sky-50 text-sky-700 border-sky-200/80",
    title: "New Wireframes option",
    description: "Sketch high-fidelity wireframes for customer onboarding and checkout flows.",
    progress: 55,
    previewType: "cards",
    priority: "A",
    createdDate: "Jul 15, 2025 04:00 PM",
    dueDate: "Aug 02, 2025",
    assignees: [
      { name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" },
      { name: "Sarah Miller", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" },
    ],
    attachments: [
      { name: "Wireframe Specs v2", size: "4.12 MB", type: "PDF" },
    ],
    subtasks: [
      { id: "st-11", title: "Mobile wireframe variants", completed: true },
      { id: "st-12", title: "Desktop navigation review", completed: false },
    ],
  },
];

export default function ChronoTaskDashboard() {
  const { pipeline, loading, moveLead, refetch } = usePipeline();
  const { contacts } = useContacts({ limit: 100 });

  const [activeTab, setActiveTab] = useState<"List" | "Board" | "Calendar" | "Files">("Board");
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("task-4"); // default open BrandBook as in screenshot
  const [activeDrawerTab, setActiveDrawerTab] = useState<"subtasks" | "comments" | "activities">("subtasks");

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", contact_id: "", value: "", stage: "new" });
  const [saving, setSaving] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  // Toggle subtask checkbox
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const completedCount = updatedSubtasks.filter((s) => s.completed).length;
        const newProgress = Math.round((completedCount / updatedSubtasks.length) * 100);
        return { ...t, subtasks: updatedSubtasks, progress: newProgress };
      })
    );
  };

  const handleCreate = async () => {
    if (!form.title) return;
    setSaving(true);
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      columnId: "todo",
      code: "1",
      tag: "WhatsApp Lead",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200/80",
      title: form.title,
      description: "Auto-synced WhatsApp pipeline task.",
      progress: 0,
      priority: "B",
      createdDate: "Today",
      dueDate: "Next week",
      assignees: [{ name: "Operator", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80" }],
      attachments: [],
      subtasks: [
        { id: `st-${Date.now()}-1`, title: "Qualify inquiry via AI auto-responder", completed: false },
        { id: `st-${Date.now()}-2`, title: "Dispatch WhatsApp booking link", completed: false },
      ],
    };
    setTasks((prev) => [newTask, ...prev]);
    if (form.contact_id) {
      await api.post("/crm/leads", { ...form, value: Number(form.value) || 0, source: "whatsapp" });
      refetch();
    }
    setSaving(false);
    setShowCreate(false);
    setForm({ title: "", contact_id: "", value: "", stage: "new" });
  };

  const columns: { id: "todo" | "in_progress" | "completed"; title: string; count: number }[] = [
    { id: "todo", title: "To do", count: tasks.filter((t) => t.columnId === "todo").length },
    { id: "in_progress", title: "In progress", count: tasks.filter((t) => t.columnId === "in_progress").length },
    { id: "completed", title: "Completed", count: tasks.filter((t) => t.columnId === "completed").length },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto min-h-[calc(100vh-6rem)]">
      {/* Main Board Container */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Top Header & View Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              My tasks
            </h1>
            <Button
              size="sm"
              onClick={() => setShowCreate(true)}
              className="gap-1.5 text-xs rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add task</span>
            </Button>
          </div>

          {/* ChronoTask Tabs */}
          <div className="flex items-center gap-6 border-b border-zinc-200/80 text-xs font-medium text-zinc-500 pb-2">
            {(["List", "Board", "Calendar", "Files"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative py-1 transition-colors hover:text-zinc-900",
                  activeTab === tab
                    ? "text-[#2563eb] font-semibold"
                    : "text-zinc-500"
                )}
              >
                <span>{tab}</span>
                {activeTab === tab && (
                  <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Board Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.columnId === col.id);
            return (
              <div key={col.id} className="space-y-4">
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900">{col.title}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-zinc-200/60 text-zinc-600 text-[10px] font-semibold">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <button
                      onClick={() => setShowCreate(true)}
                      className="p-1 hover:text-zinc-700 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1 hover:text-zinc-700 transition-colors">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-3.5">
                  {colTasks.map((task) => {
                    const isSelected = selectedTaskId === task.id;
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={cn(
                          "rounded-2xl border bg-white p-4 shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-3 group",
                          isSelected
                            ? "border-[#2563eb] ring-2 ring-[#2563eb]/10"
                            : "border-zinc-200/80 hover:border-zinc-300"
                        )}
                      >
                        {/* Tag Pill with Numeric Code */}
                        <div className="flex items-center gap-1.5">
                          <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-semibold border flex items-center gap-1", task.tagColor)}>
                            <span className="font-bold">{task.code}</span>
                            <span>{task.tag}</span>
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-950 group-hover:text-[#2563eb] transition-colors leading-snug">
                            {task.title}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        {/* Optional Visual Thumbnail Preview */}
                        {task.previewType === "buttons" && (
                          <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 flex items-center justify-center gap-2">
                            <span className="h-6 px-3 rounded-lg bg-zinc-900 text-white text-[9px] font-medium flex items-center shadow-xs">
                              Button
                            </span>
                            <span className="h-6 w-6 rounded-lg bg-amber-400 flex items-center justify-center text-white text-[9px] font-bold">
                              ★
                            </span>
                            <span className="h-6 w-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-[9px]">
                              ✓
                            </span>
                            <span className="h-6 w-6 rounded-lg bg-sky-500 flex items-center justify-center text-white text-[9px]">
                              ✉
                            </span>
                          </div>
                        )}
                        {task.previewType === "cards" && (
                          <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 flex items-center justify-center">
                            <div className="h-10 w-28 rounded-lg bg-white border border-zinc-200 shadow-2xs flex flex-col justify-center px-2 space-y-1">
                              <div className="h-1.5 w-12 bg-zinc-200 rounded" />
                              <div className="h-1 w-20 bg-zinc-100 rounded" />
                            </div>
                          </div>
                        )}

                        {/* Card Footer: Stacked Avatars + Progress Ring */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {task.assignees.map((a, i) => (
                              <img
                                key={i}
                                src={a.avatar}
                                alt={a.name}
                                className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                              />
                            ))}
                          </div>

                          {/* Circular Progress Gauge */}
                          <div className="flex items-center gap-1.5">
                            <div className="relative h-5 w-5 flex items-center justify-center">
                              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="14"
                                  fill="none"
                                  className="stroke-zinc-100"
                                  strokeWidth="3.5"
                                />
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="14"
                                  fill="none"
                                  className="stroke-sky-500"
                                  strokeWidth="3.5"
                                  strokeDasharray="88"
                                  strokeDashoffset={88 - (88 * task.progress) / 100}
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                            <span className="text-[10px] font-semibold text-zinc-500 font-mono">
                              {task.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Task Button at Bottom */}
                  <button
                    onClick={() => setShowCreate(true)}
                    className="w-full py-2.5 rounded-xl border border-dashed border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-500 hover:text-zinc-800 flex items-center justify-center gap-1.5 transition-all bg-white/40 hover:bg-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add task</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right ChronoTask Slide-Out Inspector Drawer */}
      {selectedTask && (
        <div className="w-full lg:w-[450px] shrink-0 rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-sm space-y-6 self-start">
          {/* Top Actions: Close, Edit, Share, More */}
          <div className="flex items-center justify-between text-zinc-400">
            <button
              onClick={() => setSelectedTaskId("")}
              className="p-1 hover:text-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:text-zinc-800 transition-colors">
                <Edit2 className="h-4 w-4" />
              </button>
              <button className="p-1 hover:text-zinc-800 transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="p-1 hover:text-zinc-800 transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              {selectedTask.title}
            </h2>
          </div>

          {/* Key-Value Properties Grid */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-zinc-50">
              <span className="text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400" />
                Priority
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200/70">
                {selectedTask.priority}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-50">
              <span className="text-zinc-400 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                Status
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-700 font-semibold border border-fuchsia-200/70 text-[11px]">
                {selectedTask.tag}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-50">
              <span className="text-zinc-400 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Created date
              </span>
              <span className="font-medium text-zinc-700">{selectedTask.createdDate}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-50">
              <span className="text-zinc-400 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                Due date
              </span>
              <span className="font-medium text-zinc-700">{selectedTask.dueDate}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-50">
              <span className="text-zinc-400 flex items-center gap-2">
                <Circle className="h-3.5 w-3.5 text-zinc-400" />
                Progress
              </span>
              <div className="flex items-center gap-3 w-40">
                <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all"
                    style={{ width: `${selectedTask.progress}%` }}
                  />
                </div>
                <span className="font-semibold text-zinc-700 text-[11px] font-mono">
                  {selectedTask.progress}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-zinc-400 flex items-center gap-2">
                <UserPlus className="h-3.5 w-3.5 text-zinc-400" />
                Assignees
              </span>
              <div className="flex items-center gap-2">
                {selectedTask.assignees.map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <img
                      src={a.avatar}
                      alt={a.name}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <span className="text-zinc-800 font-medium">{a.name}</span>
                  </div>
                ))}
                <button className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-[11px] font-medium">
                  <Plus className="h-3 w-3" />
                  <span>Invite</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description Box */}
          <div className="p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-100 text-xs text-zinc-600 leading-relaxed">
            {selectedTask.description}
          </div>

          {/* Attachments Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Paperclip className="h-3.5 w-3.5" />
                <span>Attachments</span>
              </div>
              <button className="text-[11px] font-medium text-[#2563eb] hover:underline flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>Download All</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {selectedTask.attachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50/80 transition-colors shadow-2xs"
                >
                  <div className="h-8 w-8 rounded-lg bg-rose-50 border border-rose-200/70 text-rose-600 flex items-center justify-center font-bold text-[9px]">
                    PDF
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 leading-tight">{att.name}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{att.type} • {att.size}</p>
                  </div>
                </div>
              ))}
              <button className="h-13 w-13 rounded-xl border border-dashed border-zinc-200 hover:border-zinc-300 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Subtasks Tabs */}
          <div className="space-y-4 pt-2 border-t border-zinc-100">
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 border-b border-zinc-100 pb-2">
              <button
                onClick={() => setActiveDrawerTab("subtasks")}
                className={cn(
                  "hover:text-zinc-900 transition-colors flex items-center gap-1.5",
                  activeDrawerTab === "subtasks" && "text-[#2563eb] font-semibold"
                )}
              >
                <span>Subtasks</span>
                <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-[#2563eb] text-[10px] font-bold">
                  {selectedTask.subtasks.length}
                </span>
              </button>
              <button
                onClick={() => setActiveDrawerTab("comments")}
                className={cn(
                  "hover:text-zinc-900 transition-colors flex items-center gap-1.5",
                  activeDrawerTab === "comments" && "text-[#2563eb] font-semibold"
                )}
              >
                <span>Comments</span>
                <span className="px-1.5 py-0.2 rounded-full bg-zinc-100 text-zinc-600 text-[10px]">
                  2
                </span>
              </button>
              <button
                onClick={() => setActiveDrawerTab("activities")}
                className={cn(
                  "hover:text-zinc-900 transition-colors",
                  activeDrawerTab === "activities" && "text-[#2563eb] font-semibold"
                )}
              >
                Activities
              </button>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {selectedTask.subtasks.map((st) => (
                <div key={st.id} className="space-y-2">
                  <div
                    onClick={() => toggleSubtask(selectedTask.id, st.id)}
                    className="flex items-start gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={cn(
                        "mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0",
                        st.completed
                          ? "bg-[#2563eb] border-[#2563eb] text-white"
                          : "border-zinc-300 group-hover:border-zinc-400 bg-white"
                      )}
                    >
                      {st.completed && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium leading-tight",
                        st.completed
                          ? "text-zinc-400 line-through"
                          : "text-zinc-800 group-hover:text-zinc-950"
                      )}
                    >
                      {st.title}
                    </span>
                  </div>

                  {/* Nested Card Note (if present) */}
                  {st.note && (
                    <div className="ml-6 p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-600 space-y-2">
                      <p className="leading-relaxed">{st.note}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-200/50">
                        <div className="flex items-center gap-1.5">
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                            alt="Amanda"
                            className="h-4 w-4 rounded-full object-cover"
                          />
                          <span className="text-zinc-700 font-medium">{st.assignee}</span>
                        </div>
                        <span className="text-zinc-400">{st.date}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Lead/Task Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Task or Lead"
        description="Add a task to your board or WhatsApp pipeline"
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input
            label="Task Title *"
            placeholder="e.g. Graphic BrandBook & WhatsApp Drop"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Link WhatsApp Contact</label>
            <select
              className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] bg-white"
              value={form.contact_id}
              onChange={(e) => setForm((f) => ({ ...f, contact_id: e.target.value }))}
            >
              <option value="">Select a contact (optional)…</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.phone}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Pipeline Value ($)"
            type="number"
            placeholder="0"
            value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
          />
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowCreate(false)}
              className="flex-1 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              isLoading={saving}
              className="flex-1 text-xs rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            >
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
