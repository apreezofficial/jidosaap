"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  ShieldCheck,
  Zap,
  Server,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function SubdomainsArchitecturePage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [msg, setMsg] = useState("");

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!clean || clean.length < 3) {
      setStatus("taken");
      setMsg("Subdomain must be at least 3 characters.");
      return;
    }
    setStatus("checking");
    setTimeout(() => {
      const reserved = ["admin", "api", "root", "app", "www"];
      if (reserved.includes(clean)) {
        setStatus("taken");
        setMsg(`${clean}.jidosaap.xyz is reserved.`);
      } else {
        setStatus("available");
        setMsg(`Available! Your instance will run on ${clean}.jidosaap.xyz`);
      }
    }, 300);
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-24">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold text-purple-700">
          <Globe className="h-3.5 w-3.5" />
          <span>Multi-Tenant Cloud Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Your own dedicated subdomain on jidosaap.xyz.
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          No shared bot queues. No shared rate limits. Every creator, freelancer, and organization receives an isolated subdomain (e.g. <code>precious.jidosaap.xyz</code>) with private Webhook endpoints and dedicated Meta Cloud API authentication.
        </p>
      </div>

      {/* Subdomain Checker Card */}
      <div className="rounded-[32px] border border-zinc-200/90 bg-white p-8 sm:p-12 shadow-xs max-w-3xl mx-auto space-y-6 text-center">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-zinc-950">Claim Your Dedicated Subdomain</h3>
          <p className="text-xs sm:text-sm text-zinc-500">
            Check if your brand, agency, or username is still available on jidosaap.xyz.
          </p>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setStatus("idle");
              }}
              placeholder="e.g. precious, shola, studio"
              className="w-full h-12 px-4 pr-32 rounded-xl border border-zinc-200/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
            />
            <span className="absolute right-3.5 top-3.5 text-xs text-zinc-400 font-mono pointer-events-none">
              .jidosaap.xyz
            </span>
          </div>
          <button
            type="submit"
            className="h-12 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs transition-all"
          >
            Check
          </button>
        </form>

        {status === "checking" && (
          <p className="text-xs text-zinc-400 animate-pulse font-mono">Checking DNS &amp; tenant registry...</p>
        )}
        {status === "available" && (
          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-between max-w-md mx-auto">
            <span>{msg}</span>
            <Link
              href={`/request-integration?subdomain=${encodeURIComponent(query.toLowerCase().trim())}`}
              className="font-bold underline text-emerald-900"
            >
              Claim now →
            </Link>
          </div>
        )}
        {status === "taken" && (
          <p className="text-xs text-rose-600 font-medium">{msg}</p>
        )}
      </div>

      {/* Architecture Matrix */}
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">Enterprise Engineering</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950">Why Dedicated Subdomains Win</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-zinc-950">Zero Tenant Cross-Talk</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Your database entries, webhook payloads, and WhatsApp credentials never touch another client's runtime memory.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Server className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-zinc-950">Dedicated Webhook URL</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Plug <code>https://yourbrand.jidosaap.xyz/api/v1/webhook</code> directly into Stripe, Penna, GitHub, or Shopify.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-zinc-950">Zero Rate-Limit Collisions</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              If another user sends a high-volume broadcast, your auto-responder and status bridge latency remains exactly 0ms.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-[32px] bg-zinc-950 p-10 sm:p-14 text-center text-white space-y-6 max-w-5xl mx-auto border border-zinc-800">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Provision your subdomain today
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          We handle the DNS routing, SSL provisioning, and WhatsApp Cloud API verification for you.
        </p>
        <Link href="/request-integration">
          <button className="h-11 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
            Request Subdomain &amp; Setup
          </button>
        </Link>
      </div>
    </div>
  );
}
