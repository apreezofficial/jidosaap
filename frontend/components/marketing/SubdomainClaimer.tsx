"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Cpu,
  Lock,
  Sparkles,
  Zap,
  Copy,
  Check,
} from "lucide-react";

export function SubdomainClaimer() {
  const [subdomainQuery, setSubdomainQuery] = useState("");
  const [checkStatus, setCheckStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [checkMessage, setCheckMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"managed" | "selfhost">("managed");
  const [copiedCmd, setCopiedCmd] = useState(false);

  const presets = ["precious", "shola", "michael", "agency", "creator"];

  const handleSelectPreset = (name: string) => {
    setSubdomainQuery(name);
    validateSubdomain(name);
  };

  const validateSubdomain = (name: string) => {
    const clean = name.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!clean || clean.length < 3) {
      setCheckStatus("taken");
      setCheckMessage("Subdomain must be at least 3 characters");
      return;
    }
    setCheckStatus("checking");
    setTimeout(() => {
      const reserved = ["api", "admin", "www", "app", "root"];
      if (reserved.includes(clean)) {
        setCheckStatus("taken");
        setCheckMessage(`${clean}.jidosaap.xyz is reserved by system.`);
      } else {
        setCheckStatus("available");
        setCheckMessage(`Available! Your dedicated instance will live at ${clean}.jidosaap.xyz`);
      }
    }, 280);
  };

  const handleCheckSubdomain = (e: React.FormEvent) => {
    e.preventDefault();
    validateSubdomain(subdomainQuery);
  };

  const copyDockerCmd = () => {
    navigator.clipboard.writeText("curl -fsSL https://jidosaap.xyz/install.sh | bash");
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <section id="subdomains" className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header with Explanatory Context */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200/90 shadow-xs text-xs font-semibold text-zinc-700">
          <Globe className="h-3.5 w-3.5 text-[#2563eb]" />
          <span>Multi-Tenant Cloud or 100% Self-Hosted</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Your own dedicated instance. Zero shared bottlenecks.
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          Unlike ordinary shared bots where one outage takes down everyone, every JidoSapp client gets their own isolated environment. Claim a managed subdomain on <code className="font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">jidosaap.xyz</code> or self-host the entire stack on your own VPS.
        </p>
      </div>

      {/* Tab Switcher: Managed Subdomain vs Self-Hosted */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-zinc-200/60 border border-zinc-200">
          <button
            onClick={() => setActiveTab("managed")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "managed"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            🚀 Managed Subdomain (jidosaap.xyz)
          </button>
          <button
            onClick={() => setActiveTab("selfhost")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "selfhost"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            💻 100% Self-Hostable (Docker / VPS)
          </button>
        </div>
      </div>

      {/* Main Interactive Showcase Card */}
      <div className="relative rounded-[32px] sm:rounded-[40px] border border-zinc-200/90 bg-white p-6 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] max-w-5xl mx-auto space-y-10 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {activeTab === "managed" ? (
          /* ── TAB 1: MANAGED SUBDOMAIN CLAIMER & PREVIEW ── */
          <div className="relative z-10 space-y-8">
            {/* Interactive Browser Address Bar Simulation */}
            <div className="rounded-2xl border border-zinc-200/90 bg-zinc-950 text-white p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <span>https://{subdomainQuery.trim() ? subdomainQuery.toLowerCase().trim() : "yourbrand"}.jidosaap.xyz</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  SSL Active
                </span>
              </div>

              {/* Subdomain Input Form */}
              <form onSubmit={handleCheckSubdomain} className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 w-full focus-within:border-[#2563eb] transition-colors">
                  <span className="text-xs font-mono text-zinc-500 select-none mr-1.5">https://</span>
                  <input
                    type="text"
                    placeholder="precious, shola, michael, or yourbrand"
                    value={subdomainQuery}
                    onChange={(e) => {
                      setSubdomainQuery(e.target.value);
                      setCheckStatus("idle");
                    }}
                    className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-zinc-600 focus:outline-none font-mono"
                  />
                  <span className="text-xs font-bold text-sky-400 font-mono bg-sky-950/80 border border-sky-800/50 px-2.5 py-1 rounded select-none">
                    .jidosaap.xyz
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md transition-all shrink-0 hover:-translate-y-0.5"
                >
                  Check &amp; Claim
                </button>
              </form>

              {/* Quick Select Preset Suggestions */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400">
                <span className="text-[11px] text-zinc-500">Try examples:</span>
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] transition-colors border border-zinc-700/60"
                  >
                    {preset}.jidosaap.xyz
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Status Notification */}
            {checkStatus !== "idle" && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all ${
                  checkStatus === "available"
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    : checkStatus === "checking"
                    ? "bg-zinc-50 text-zinc-600 border-zinc-200 animate-pulse text-center"
                    : "bg-rose-50 text-rose-800 border-rose-200 flex items-center gap-2"
                }`}
              >
                {checkStatus === "checking" && <span>Checking tenant DNS and database allocation…</span>}

                {checkStatus === "available" && (
                  <>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span>{checkMessage}</span>
                    </div>
                    <Link
                      href={`/request-integration?subdomain=${encodeURIComponent(subdomainQuery.toLowerCase().trim())}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all shrink-0"
                    >
                      <span>Provision This Subdomain</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                )}

                {checkStatus === "taken" && (
                  <>
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{checkMessage}</span>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ── TAB 2: 100% SELF-HOSTABLE ARCHITECTURE ── */
          <div className="relative z-10 space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 text-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#2563eb]" />
                  <span className="text-xs font-bold text-zinc-300">Self-Host Anywhere in 60 Seconds</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Docker • VPS • Coolify</span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Prefer full ownership of your data? You can run JidoSapp on your own server (DigitalOcean, AWS, Hetzner, or a Raspberry Pi) and optionally bind it to your own custom domain or get a managed reverse-proxy with us.
              </p>

              {/* Terminal Snippet */}
              <div className="bg-zinc-900/90 rounded-xl p-3.5 border border-zinc-800 flex items-center justify-between font-mono text-xs text-emerald-400">
                <code className="truncate max-w-[80%]">curl -fsSL https://jidosaap.xyz/install.sh | bash</code>
                <button
                  onClick={copyDockerCmd}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-sans flex items-center gap-1.5 transition-colors"
                >
                  {copiedCmd ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  SQLite or PostgreSQL backend
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Your own Meta Cloud API keys
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Zero telemetry / 100% private
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4 Multi-Tenant Superpower Badges */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-zinc-100">
          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 space-y-1.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-zinc-900">Isolated Meta API Keys</div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Your WhatsApp Business token is isolated from other clients. No shared rate limits.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 space-y-1.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-zinc-900">Private Webhook Ingress</div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Every subdomain receives dedicated HTTP endpoints for Stripe, Penna, and custom triggers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 space-y-1.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Server className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-zinc-900">Dedicated Tenant DB</div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Your contacts, scheduled drops, and message logs reside in private workspace records.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 space-y-1.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cpu className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-zinc-900">Self-Hostable Freedom</div>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Deploy our prebuilt container on your own infrastructure whenever you choose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
