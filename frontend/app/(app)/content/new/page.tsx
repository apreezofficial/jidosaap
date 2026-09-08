"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWhatsAppConnections } from "@/hooks/useWhatsApp";
import { useTemplates } from "@/hooks/useContent";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Sparkles, Send, Calendar, FileText,
  Image, Clock, CheckCircle2, AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "friendly",     label: "Friendly" },
  { value: "sales",        label: "Sales-Focused" },
  { value: "educational",  label: "Educational" },
  { value: "urgent",       label: "Urgent" },
];

export default function NewContentPage() {
  const router = useRouter();
  const { connections } = useWhatsAppConnections();
  const { templates } = useTemplates();

  const [form, setForm] = useState({
    title: "",
    content: "",
    destination: "whatsapp",
    status: "draft",
    connection_id: "",
    schedule_at: "",
    timezone: "UTC",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("professional");
  const [generatingAi, setGeneratingAi] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const handleContentChange = (val: string) => {
    setForm((f) => ({ ...f, content: val }));
    setCharCount(val.length);
  };

  // Resolve template variables with placeholders
  const applyTemplate = (body: string) => {
    setForm((f) => ({ ...f, content: body }));
    setCharCount(body.length);
  };

  const handleSave = async (schedule = false) => {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    setError(null);

    const payload: any = { ...form };
    if (schedule && form.schedule_at) {
      payload.status = "scheduled";
    }

    const res = await api.post("/content", payload);
    setSaving(false);

    if (res.success && res.data) {
      const contentId = (res.data as any).id;
      // If scheduling was requested, create the scheduled post
      if (schedule && form.schedule_at && contentId) {
        await api.post(`/content/${contentId}/schedule`, {
          schedule_at: form.schedule_at,
          connection_id: form.connection_id || undefined,
          timezone: form.timezone,
        });
      }
      setSaved(true);
      setTimeout(() => router.push("/content"), 1000);
    } else {
      setError(res.error?.message ?? "Failed to save content");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/content">
            <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">New Content</h1>
            <p className="text-xs text-zinc-400">Compose a WhatsApp message or campaign</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSave(false)}
            isLoading={saving && form.status === "draft"}
            className="gap-1.5 text-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave(true)}
            isLoading={saving && form.status === "scheduled"}
            className={cn("gap-1.5 text-xs", saved && "bg-emerald-600 hover:bg-emerald-700")}
          >
            {saved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
            {saved ? "Saved!" : form.schedule_at ? "Schedule" : "Publish"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main composer */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Message Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                placeholder="e.g. Weekly Product Update — July"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-zinc-700">Message Body</label>
                  <span className={cn("text-[10px] font-medium", charCount > 1600 ? "text-red-500" : "text-zinc-400")}>
                    {charCount} / 4096 chars
                  </span>
                </div>
                <textarea
                  className="w-full h-52 resize-none rounded-md border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed"
                  placeholder={"Hello {{customer.name}},\n\nWe have exciting new arrivals this week!\n\n🔥 {{product_name}} — Now ${{price}}\n📦 Only {{stock}} remaining.\n\nReply YES to order now."}
                  value={form.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                />
                <p className="text-[10px] text-zinc-400">
                  Supported variables: {`{{customer.name}}`} {`{{product_name}}`} {`{{price}}`} {`{{current_date}}`} {`{{ai.content}}`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-500" />
                AI Writing Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700">Describe what you want</label>
                <textarea
                  className="w-full h-20 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="Write a promotional WhatsApp message about our summer sale with 30% off all electronics..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-medium text-zinc-700">Tone</label>
                  <select
                    className="w-full h-8 rounded-md border border-zinc-200 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                  >
                    {TONE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-5">
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={generatingAi}
                    disabled={!aiPrompt.trim()}
                    onClick={async () => {
                      setGeneratingAi(true);
                      // AI generation would call the backend AI endpoint
                      // For now, simulate with a template
                      await new Promise((r) => setTimeout(r, 800));
                      const generated = `✨ Special Announcement!\n\n${aiPrompt.slice(0, 120)}...\n\nReply YES to learn more or visit our website.\n\n_Powered by JidoSapp AI_`;
                      handleContentChange(generated);
                      setGeneratingAi(false);
                    }}
                    className="gap-1.5 text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: settings */}
        <div className="space-y-5">
          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700">Send At</label>
                <input
                  type="datetime-local"
                  className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  value={form.schedule_at}
                  onChange={(e) => setForm((f) => ({ ...f, schedule_at: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700">Timezone</label>
                <select
                  className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  value={form.timezone}
                  onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
                >
                  {["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo"].map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              {form.schedule_at && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>Scheduled for {new Date(form.schedule_at).toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* WhatsApp Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">WhatsApp Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {connections.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                  <p className="font-semibold mb-1">No WhatsApp connected</p>
                  <Link href="/integrations/whatsapp" className="underline">
                    Connect an account →
                  </Link>
                </div>
              ) : (
                <>
                  <select
                    className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                    value={form.connection_id}
                    onChange={(e) => setForm((f) => ({ ...f, connection_id: e.target.value }))}
                  >
                    <option value="">Select connection…</option>
                    {connections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.business_name} ({c.phone_number})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-zinc-400">
                    Content is delivered through the official Meta Cloud API only.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Templates */}
          {templates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {templates.slice(0, 5).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => applyTemplate(tmpl.body)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs transition-colors"
                  >
                    <p className="font-medium text-zinc-800 truncate">{tmpl.name}</p>
                    <p className="text-zinc-400 truncate mt-0.5">{tmpl.body.slice(0, 50)}…</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
