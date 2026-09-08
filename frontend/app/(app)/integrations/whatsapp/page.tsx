"use client";

import React, { useState } from "react";
import { useWhatsAppConnections } from "@/hooks/useWhatsApp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Plus, Phone, CheckCircle2, AlertCircle, Wifi, WifiOff,
  RefreshCw, Trash2, ExternalLink, Copy, Shield, Info,
} from "lucide-react";
import { api } from "@/lib/api";

const STATUS_CONFIG: Record<string, { label: string; variant: any; icon: any }> = {
  connected:    { label: "Connected",    variant: "success",     icon: CheckCircle2 },
  disconnected: { label: "Disconnected", variant: "secondary",   icon: WifiOff },
  expired:      { label: "Expired",      variant: "warning",     icon: AlertCircle },
  error:        { label: "Error",        variant: "destructive", icon: AlertCircle },
};

export default function WhatsAppIntegrationsPage() {
  const { connections, loading, testConnection, disconnect, deleteConnection, refetch } = useWhatsAppConnections();
  const [showConnect, setShowConnect] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, any>>({});
  const [form, setForm] = useState({
    business_name: "", phone_number: "", phone_number_id: "",
    waba_id: "", access_token: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleConnect = async () => {
    const { business_name, phone_number, phone_number_id, waba_id, access_token } = form;
    if (!business_name || !phone_number || !phone_number_id || !waba_id || !access_token) {
      setError("All fields are required");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await api.post("/integrations/whatsapp", form);
    setSaving(false);
    if (res.success) {
      setShowConnect(false);
      setForm({ business_name: "", phone_number: "", phone_number_id: "", waba_id: "", access_token: "" });
      refetch();
    } else {
      setError(res.error?.message ?? "Failed to connect");
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    const res = await testConnection(id);
    setTestingId(null);
    if (res.success) {
      setTestResult((prev) => ({ ...prev, [id]: res.data }));
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname.replace("3000", "8000")}/api/webhooks/whatsapp`
    : "https://api.yourdomain.com/api/webhooks/whatsapp";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">WhatsApp Connections</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Connect your WhatsApp Business accounts via the official Meta Cloud API
          </p>
        </div>
        <Button size="sm" onClick={() => setShowConnect(true)} className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Connect Account
        </Button>
      </div>

      {/* Official API notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Official Meta WhatsApp Business Cloud API</p>
          <p className="text-xs text-blue-600 mt-0.5">
            JidoSapp uses only the official Meta WhatsApp Business Platform API. This requires a verified
            WhatsApp Business account and Meta Developer App. All credentials are encrypted at rest.
            Access tokens are never exposed to the frontend.
          </p>
          <a
            href="https://developers.facebook.com/docs/whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-700 underline mt-1 inline-flex items-center gap-1"
          >
            Meta WhatsApp Business Docs
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Webhook URL */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-700 mb-1">Webhook URL (configure in Meta Developer Dashboard)</p>
            <div className="flex items-center gap-2 bg-zinc-50 rounded-lg border border-zinc-200 px-3 py-2">
              <code className="text-xs text-zinc-700 flex-1 truncate font-mono">{webhookUrl}</code>
              <button
                onClick={() => copyToClipboard(webhookUrl, "webhook")}
                className="text-zinc-400 hover:text-zinc-700 transition-colors shrink-0"
              >
                {copied === "webhook" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">
              The verify token for each connection is shown in its details card below.
            </p>
          </div>
        </div>
      </Card>

      {/* Connections */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 animate-pulse h-32" />
          ))}
        </div>
      ) : connections.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl py-16 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
            <Phone className="h-7 w-7 text-zinc-300" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-700 mb-1">No WhatsApp accounts connected</h3>
          <p className="text-xs text-zinc-400 mb-5 max-w-xs text-center">
            Connect your WhatsApp Business account to start sending and receiving messages
          </p>
          <Button size="sm" onClick={() => setShowConnect(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Connect WhatsApp
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map((conn) => {
            const statusConf = STATUS_CONFIG[conn.status] || STATUS_CONFIG.error;
            const StatusIcon = statusConf.icon;
            const result = testResult[conn.id];
            return (
              <Card key={conn.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center text-xl shrink-0",
                      conn.status === "connected" ? "bg-emerald-50" : "bg-zinc-100"
                    )}>
                      📱
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-zinc-900">{conn.business_name}</h3>
                        <Badge variant={statusConf.variant}>
                          <StatusIcon className="h-2.5 w-2.5 mr-1" />
                          {statusConf.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-600 font-medium">{conn.phone_number}</p>
                      <div className="flex items-center gap-4 mt-1 text-[11px] text-zinc-400">
                        <span>Phone ID: <span className="font-mono">{conn.phone_number_id}</span></span>
                        <span>WABA: <span className="font-mono">{conn.waba_id}</span></span>
                      </div>
                      {conn.last_active_at && (
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Last active: {formatRelativeTime(conn.last_active_at)}
                        </p>
                      )}
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => disconnect(conn.id)}
                      className="gap-1.5 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
                    >
                      <WifiOff className="h-3.5 w-3.5" />
                      Disconnect
                    </Button>
                    <button
                      onClick={() => deleteConnection(conn.id)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Verify token */}
                <div className="mt-3 pt-3 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-zinc-400 font-medium">Webhook Verify Token:</p>
                    <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1">
                      <code className="text-[10px] font-mono text-zinc-600">{conn.webhook_verify_token}</code>
                      <button
                        onClick={() => copyToClipboard(conn.webhook_verify_token, `token-${conn.id}`)}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        {copied === `token-${conn.id}` ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Test result */}
                {result && (
                  <div className={cn(
                    "mt-2 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2",
                    result.success ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                  )}>
                    {result.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                    {result.message}
                    {result.duration && <span className="opacity-60">({result.duration}ms)</span>}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Connect Modal */}
      <Modal
        isOpen={showConnect}
        onClose={() => { setShowConnect(false); setError(null); }}
        title="Connect WhatsApp Business"
        description="Enter your Meta WhatsApp Business API credentials"
        maxWidth="md"
      >
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{error}</div>
          )}
          <Input
            label="Business Name *"
            placeholder="Your Business Name"
            value={form.business_name}
            onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
          />
          <Input
            label="Phone Number *"
            placeholder="+1 (555) 000-0000"
            value={form.phone_number}
            onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
          />
          <Input
            label="Phone Number ID *"
            placeholder="From Meta Developer Dashboard"
            value={form.phone_number_id}
            onChange={(e) => setForm((f) => ({ ...f, phone_number_id: e.target.value }))}
          />
          <Input
            label="WhatsApp Business Account ID *"
            placeholder="WABA ID from Meta Business Manager"
            value={form.waba_id}
            onChange={(e) => setForm((f) => ({ ...f, waba_id: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Access Token *</label>
            <input
              type="password"
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder="Permanent access token from Meta"
              value={form.access_token}
              onChange={(e) => setForm((f) => ({ ...f, access_token: e.target.value }))}
            />
            <p className="text-[10px] text-zinc-400">
              Token is encrypted at rest and never exposed in API responses.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowConnect(false)} className="flex-1 text-sm">Cancel</Button>
            <Button onClick={handleConnect} isLoading={saving} className="flex-1 text-sm gap-1.5">
              <Wifi className="h-3.5 w-3.5" />
              Connect Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
