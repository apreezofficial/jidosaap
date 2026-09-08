"use client";

import React, { useState } from "react";
import { useApiConnections } from "@/hooks/useAutomations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Plus, Code, CheckCircle2, AlertCircle, RefreshCw, Trash2,
  Lock, Globe, Key, Clock,
} from "lucide-react";
import { api } from "@/lib/api";

const AUTH_TYPES: Record<string, { label: string; icon: any }> = {
  none:    { label: "No Auth",         icon: Globe },
  api_key: { label: "API Key",         icon: Key },
  bearer:  { label: "Bearer Token",    icon: Lock },
  basic:   { label: "Basic Auth",      icon: Lock },
};

export default function ApiIntegrationsPage() {
  const { connections, loading, refetch } = useApiConnections();
  const [showCreate, setShowCreate] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [form, setForm] = useState({
    name: "", base_url: "", auth_type: "none",
    credentials: { api_key: "", token: "", username: "", password: "" },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!form.name || !form.base_url) return;
    setSaving(true);
    setError(null);
    const payload: any = { name: form.name, base_url: form.base_url, auth_type: form.auth_type };
    if (form.auth_type !== "none") {
      payload.credentials = form.credentials;
    }
    const res = await api.post("/integrations/api", payload);
    setSaving(false);
    if (res.success) {
      setShowCreate(false);
      setForm({ name: "", base_url: "", auth_type: "none", credentials: { api_key: "", token: "", username: "", password: "" } });
      refetch();
    } else {
      setError(res.error?.message ?? "Failed to create");
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    const res = await api.post<any>(`/integrations/api/${id}/test`);
    setTestingId(null);
    if (res.success) {
      setTestResults((prev) => ({ ...prev, [id]: res.data }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this API connection?")) return;
    await api.delete(`/integrations/api/${id}`);
    refetch();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">API Integrations</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Connect external APIs to feed data into your automations
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add API Connection
        </Button>
      </div>

      {/* How it works */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-amber-900 mb-1">How API Automation Works</p>
        <p className="text-xs text-amber-700">
          Connect any REST API → parse the JSON response → pass data to AI → generate WhatsApp messages → deliver to contacts.
          Credentials are encrypted at rest and never sent back to the frontend.
        </p>
        <div className="flex items-center gap-2 mt-3 text-[11px] font-medium text-amber-800">
          <span className="bg-amber-100 px-2 py-0.5 rounded">Fetch API</span>
          <span>→</span>
          <span className="bg-amber-100 px-2 py-0.5 rounded">Extract JSON</span>
          <span>→</span>
          <span className="bg-amber-100 px-2 py-0.5 rounded">AI Transform</span>
          <span>→</span>
          <span className="bg-amber-100 px-2 py-0.5 rounded">WhatsApp</span>
        </div>
      </div>

      {/* Connections */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : connections.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl py-16 flex flex-col items-center">
          <Code className="h-10 w-10 text-zinc-200 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-700 mb-1">No API connections yet</h3>
          <p className="text-xs text-zinc-400 mb-5 max-w-xs text-center">
            Connect an external API to use its data in automations
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Connection
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => {
            const authConf = AUTH_TYPES[conn.auth_type] || AUTH_TYPES.none;
            const AuthIcon = authConf.icon;
            const result = testResults[conn.id];
            return (
              <Card key={conn.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                      <Code className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-zinc-900">{conn.name}</h3>
                        <Badge variant={conn.status === "active" ? "success" : "secondary"}>
                          {conn.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 font-mono truncate max-w-xs">{conn.base_url}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <AuthIcon className="h-3 w-3" />
                          {authConf.label}
                        </span>
                        {conn.last_tested_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Tested {formatRelativeTime(conn.last_tested_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      isLoading={testingId === conn.id}
                      onClick={() => handleTest(conn.id)}
                      className="gap-1.5 text-xs"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Test
                    </Button>
                    <button
                      onClick={() => handleDelete(conn.id)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {result && (
                  <div className={cn(
                    "mt-3 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2",
                    result.success ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                  )}>
                    {result.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                    HTTP {result.http_code} · {result.duration}ms
                    {result.error && <span>— {result.error}</span>}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setError(null); }}
        title="New API Connection"
        description="Connect an external REST API"
        maxWidth="md"
      >
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{error}</div>
          )}
          <Input
            label="Connection Name *"
            placeholder="e.g. Product Catalog API"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Base URL *"
            placeholder="https://api.example.com"
            value={form.base_url}
            onChange={(e) => setForm((f) => ({ ...f, base_url: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Authentication</label>
            <select
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              value={form.auth_type}
              onChange={(e) => setForm((f) => ({ ...f, auth_type: e.target.value }))}
            >
              {Object.entries(AUTH_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          {form.auth_type === "api_key" && (
            <Input
              label="API Key"
              type="password"
              placeholder="Your API key"
              value={form.credentials.api_key}
              onChange={(e) => setForm((f) => ({ ...f, credentials: { ...f.credentials, api_key: e.target.value } }))}
            />
          )}
          {form.auth_type === "bearer" && (
            <Input
              label="Bearer Token"
              type="password"
              placeholder="Your bearer token"
              value={form.credentials.token}
              onChange={(e) => setForm((f) => ({ ...f, credentials: { ...f.credentials, token: e.target.value } }))}
            />
          )}
          {form.auth_type === "basic" && (
            <>
              <Input
                label="Username"
                value={form.credentials.username}
                onChange={(e) => setForm((f) => ({ ...f, credentials: { ...f.credentials, username: e.target.value } }))}
              />
              <Input
                label="Password"
                type="password"
                value={form.credentials.password}
                onChange={(e) => setForm((f) => ({ ...f, credentials: { ...f.credentials, password: e.target.value } }))}
              />
            </>
          )}

          {form.auth_type !== "none" && (
            <p className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Credentials are encrypted at rest using AES-256-GCM.
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 text-sm">Cancel</Button>
            <Button onClick={handleCreate} isLoading={saving} className="flex-1 text-sm gap-1.5">
              <Code className="h-3.5 w-3.5" />
              Add Connection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
