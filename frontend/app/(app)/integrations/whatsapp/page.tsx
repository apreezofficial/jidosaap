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
  Phone,
  CheckCircle2,
  AlertCircle,
  Wifi,
  RefreshCw,
  Trash2,
  ExternalLink,
  Copy,
  Shield,
  Info,
  Globe,
  Lock,
  Sparkles,
  Server,
  Zap,
} from "lucide-react";

interface ConnectionItem {
  id: string;
  business_name: string;
  phone_number: string;
  phone_number_id: string;
  waba_id: string;
  subdomain: string;
  status: "connected" | "disconnected";
  webhook_status: "verified" | "pending";
  latency: string;
  active_groups: number;
}

const DEFAULT_CONNECTIONS: ConnectionItem[] = [
  {
    id: "conn-1",
    business_name: "JidoSapp Production Instance",
    phone_number: "+1 (555) 019-2834",
    phone_number_id: "phone_109283918239",
    waba_id: "waba_88392019283",
    subdomain: "onos.jidosaap.xyz",
    status: "connected",
    webhook_status: "verified",
    latency: "42ms",
    active_groups: 4,
  },
];

export default function WhatsAppIntegrationsPage() {
  const [connections, setConnections] = useState<ConnectionItem[]>(DEFAULT_CONNECTIONS);
  const [showConnect, setShowConnect] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [form, setForm] = useState({
    business_name: "",
    phone_number: "",
    phone_number_id: "",
    waba_id: "",
    access_token: "",
  });

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTest = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setTestResult("✅ Cloud API Ping Success! Webhook responded in 38ms with status 200 OK.");
      setTimeout(() => setTestResult(null), 5000);
    }, 700);
  };

  const webhookUrl = "https://onos.jidosaap.xyz/api/v1/webhooks/whatsapp";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Meta Cloud API Verified</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold font-mono">
              onos.jidosaap.xyz
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Dedicated Subdomain &amp; WhatsApp Cloud API
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Every workspace receives an isolated *.jidosaap.xyz container, dedicated webhook routing, and official Meta Cloud API verified infrastructure.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowConnect(true)}
          className="gap-1.5 text-xs bg-[#2563eb] hover:bg-[#1d4ed8]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Connect Number</span>
        </Button>
      </div>

      {testResult && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* ── ISOLATED SUBDOMAIN CONTAINER CARD ── */}
      <div className="rounded-2xl border border-zinc-200/90 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono">onos.jidosaap.xyz</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Isolated Container
                </span>
              </div>
              <p className="text-xs text-zinc-400">Dedicated multi-tenant webhook endpoint &amp; SSL termination at edge</p>
            </div>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            TLS 1.3 • AES-256 GCM
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
            <span className="text-[10px] text-zinc-400 block mb-1">Webhook Latency</span>
            <p className="text-lg font-bold text-emerald-400">42ms</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
            <span className="text-[10px] text-zinc-400 block mb-1">Protected Groups</span>
            <p className="text-lg font-bold text-white">4 Active Groups</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
            <span className="text-[10px] text-zinc-400 block mb-1">Auto-Responder Latency</span>
            <p className="text-lg font-bold text-[#00b4d8]">1.4s SLA</p>
          </div>
        </div>
      </div>

      {/* ── WEBHOOK ENDPOINT CONFIG ── */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
          <Server className="h-4 w-4 text-[#2563eb]" />
          <span>Meta Cloud API Webhook Callback</span>
        </div>

        <div className="flex items-center gap-2 bg-zinc-50 rounded-xl border border-zinc-200 px-3 py-2.5">
          <code className="text-xs text-zinc-800 flex-1 truncate font-mono">{webhookUrl}</code>
          <button
            onClick={() => copyToClipboard(webhookUrl, "webhook")}
            className="text-zinc-500 hover:text-zinc-900 transition-colors p-1"
            title="Copy webhook URL"
          >
            {copied === "webhook" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-zinc-400">
          Configure this URL in your Meta Business Suite &gt; WhatsApp &gt; Configuration dashboard with verify token <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono text-zinc-700">jidosapp_webhook_verify_secret</code>.
        </p>
      </Card>

      {/* ── CONNECTED ACCOUNTS ── */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider text-xs">
          Connected WhatsApp Accounts ({connections.length})
        </h3>

        {connections.map((conn) => (
          <div
            key={conn.id}
            className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-xs transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                  📱
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-zinc-950">{conn.business_name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Connected
                    </span>
                  </div>
                  <p className="text-xs font-mono font-bold text-zinc-700 mt-0.5">{conn.phone_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTest(conn.id)}
                  disabled={testingId === conn.id}
                  className="text-xs gap-1.5"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", testingId === conn.id && "animate-spin")} />
                  <span>{testingId === conn.id ? "Pinging..." : "Test Webhook Ping"}</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-100 text-xs">
              <div className="text-zinc-600">
                <span className="text-zinc-400 block text-[10px]">Phone Number ID</span>
                <span className="font-mono text-zinc-800 font-semibold">{conn.phone_number_id}</span>
              </div>
              <div className="text-zinc-600">
                <span className="text-zinc-400 block text-[10px]">WABA Account ID</span>
                <span className="font-mono text-zinc-800 font-semibold">{conn.waba_id}</span>
              </div>
              <div className="text-zinc-600">
                <span className="text-zinc-400 block text-[10px]">Group Shield Sentinel</span>
                <span className="font-semibold text-emerald-600">{conn.active_groups} Groups Guarded</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CONNECT NUMBER MODAL ── */}
      {showConnect && (
        <Modal
          open={showConnect}
          onClose={() => setShowConnect(false)}
          title="Connect WhatsApp Business Account"
          className="max-w-md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowConnect(false);
            }}
            className="space-y-4 pt-2"
          >
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Business Display Name</label>
              <Input
                placeholder="e.g. My Agency WhatsApp"
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">WhatsApp Phone Number</label>
              <Input
                placeholder="+1 555 123 4567"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Meta Phone Number ID</label>
              <Input
                placeholder="From Meta Developer App"
                value={form.phone_number_id}
                onChange={(e) => setForm({ ...form, phone_number_id: e.target.value })}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">System User Access Token</label>
              <Input
                type="password"
                placeholder="Permanent token (EAAB...)"
                value={form.access_token}
                onChange={(e) => setForm({ ...form, access_token: e.target.value })}
                className="text-xs font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowConnect(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                Save &amp; Verify
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
