"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, CheckCircle2, Building2, Globe, Trash2, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/modal";

const TIMEZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata",
  "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney", "America/Sao_Paulo",
];

const BUSINESS_TYPES = [
  "ecommerce", "real_estate", "education", "agency", "retail", "services",
  "healthcare", "finance", "food_beverage", "other",
];

export default function WorkspaceSettingsPage() {
  const { currentWorkspace, refreshUserData } = useAuth();
  const [form, setForm] = useState({
    name: currentWorkspace?.name ?? "",
    timezone: currentWorkspace?.timezone ?? "UTC",
    business_type: "services",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const res = await api.patch("/workspace", form);
    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await refreshUserData();
    } else {
      setError(res.error?.message ?? "Failed to update workspace");
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== currentWorkspace?.name) return;
    const res = await api.delete("/workspace");
    if (res.success) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Workspace Settings</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Configure your workspace preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Workspace Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{error}</div>
          )}

          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-sm font-bold">
              {(currentWorkspace?.name ?? "W")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">{currentWorkspace?.name}</p>
              <p className="text-xs text-zinc-400 font-mono">{currentWorkspace?.slug}</p>
            </div>
            <Badge variant="secondary" className="ml-auto">{currentWorkspace?.role}</Badge>
          </div>

          <Input
            label="Workspace Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Timezone</label>
            <select
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:border-[#2563eb] bg-white"
              value={form.timezone}
              onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <p className="text-[10px] text-zinc-400">
              All scheduled content uses this timezone. Timestamps are stored in UTC.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Business Type</label>
            <select
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:border-[#2563eb] bg-white"
              value={form.business_type}
              onChange={(e) => setForm((f) => ({ ...f, business_type: e.target.value }))}
            >
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleSave} isLoading={saving} size="sm" className="gap-1.5 text-xs">
            {saved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Saved!" : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {currentWorkspace?.role === "owner" && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900">Delete Workspace</p>
                <p className="text-xs text-zinc-500">
                  Permanently delete this workspace and all its data. This cannot be undone.
                </p>
              </div>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setShowDelete(true)}
                className="gap-1.5 text-xs shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteConfirm(""); }}
        title="Delete Workspace"
        description="This action is permanent and cannot be undone."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
            All contacts, conversations, automations, content, and data in this workspace will be permanently deleted.
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">
              Type <span className="font-mono font-bold">{currentWorkspace?.name}</span> to confirm:
            </label>
            <input
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDelete(false)} className="flex-1 text-sm">Cancel</Button>
            <Button
              variant="danger"
              disabled={deleteConfirm !== currentWorkspace?.name}
              onClick={handleDelete}
              className="flex-1 text-sm gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Forever
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
