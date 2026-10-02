"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Bot,
  Zap,
  ArrowRight,
  Send,
  Phone,
  Check,
  Server,
  Lock,
} from "lucide-react";
import { api } from "@/lib/api";

const RESERVED_SUBDOMAINS = [
  "admin", "administrator", "api", "app", "apps", "auth", "billing", "bot", "bots",
  "cdn", "dashboard", "dev", "developer", "developers", "docs", "help", "jido",
  "jidosaap", "login", "mail", "meta", "null", "portal", "register", "root",
  "secure", "server", "smtp", "ssl", "staging", "static", "status", "support",
  "system", "test", "testing", "undefined", "user", "users", "web", "webhook",
  "webhooks", "whatsapp", "www"
];

const USE_CASES = [
  {
    id: "group_buddy",
    title: "Group Buddy (Community Anti-Spam & Moderation)",
    desc: "24/7 intelligent group sentinel that detects and deletes spam/phishing links, issues warning strikes, and auto-kicks repeat offenders to keep community chats clean.",
    icon: ShieldCheck,
    accent: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
  },
  {
    id: "auto_responder",
    title: "24/7 Smart AI Auto-Responder (Support & Inquiries)",
    desc: "Zero-latency customer support and lead qualification. Automatically answers customer FAQs, delivers rate cards, and books calendar meetings around the clock.",
    icon: Bot,
    accent: "bg-blue-50 text-blue-600 border-blue-200/80",
  },
  {
    id: "custom",
    title: "Custom Automation / Bespoke Workflow",
    desc: "Tell us what you want to automate. Describe your custom WhatsApp flow, CRM connector, or multi-agent pipeline in the request notes below.",
    icon: Zap,
    accent: "bg-purple-50 text-purple-600 border-purple-200/80",
  },
];

function RequestIntegrationForm() {
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brandName, setBrandName] = useState("");
  const [subdomain, setSubdomain] = useState(searchParams.get("subdomain") || "");
  const [selectedUseCase, setSelectedUseCase] = useState(
    searchParams.get("use_case") === "group_buddy" || searchParams.get("use_case") === "auto_responder"
      ? searchParams.get("use_case")!
      : "group_buddy"
  );
  const [deploymentType, setDeploymentType] = useState<"managed" | "self_host">("managed");
  const [notes, setNotes] = useState("");

  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [subdomainError, setSubdomainError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = searchParams.get("subdomain");
    if (raw) {
      setSubdomain(raw);
      checkSubdomainDebounced(raw);
    }
    const uc = searchParams.get("use_case");
    if (uc) {
      if (uc === "group_buddy" || uc === "auto_responder" || uc === "custom") {
        setSelectedUseCase(uc);
      }
    }
  }, [searchParams]);

  const checkSubdomainDebounced = async (val: string) => {
    const clean = val.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!clean || clean.length < 3) {
      setSubdomainAvailable(null);
      setSubdomainError(clean ? "Subdomain must be at least 3 characters" : null);
      return;
    }

    // Instant Client-Side Reserved Subdomains Check
    if (RESERVED_SUBDOMAINS.includes(clean)) {
      setCheckingSubdomain(false);
      setSubdomainAvailable(false);
      setSubdomainError(`"${clean}.jidosaap.xyz" is a reserved system subdomain and cannot be claimed.`);
      return;
    }

    setCheckingSubdomain(true);
    setSubdomainError(null);

    try {
      const res = await api.get<any>(`/subdomains/check?subdomain=${clean}`);
      setCheckingSubdomain(false);
      if (res.success && res.data) {
        setSubdomainAvailable(res.data.available);
        if (!res.data.available) {
          setSubdomainError(res.data.reason || "Subdomain is already claimed");
        } else {
          setSubdomainError(null);
        }
      } else {
        setSubdomainAvailable(true);
      }
    } catch {
      setCheckingSubdomain(false);
      setSubdomainAvailable(true);
    }
  };

  const handleSubdomainChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(clean);
    checkSubdomainDebounced(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = subdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");

    if (!clean || clean.length < 3) {
      setError("Please specify a valid subdomain (at least 3 characters).");
      return;
    }

    if (RESERVED_SUBDOMAINS.includes(clean)) {
      setError(`"${clean}.jidosaap.xyz" is a reserved system subdomain and cannot be claimed.`);
      return;
    }

    if (selectedUseCase === "custom" && !notes.trim()) {
      setError("Please briefly describe your custom automation requirements in the notes field.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        email,
        phone_number: phone,
        brand_name: brandName || fullName,
        subdomain: clean,
        use_case: selectedUseCase,
        notes: deploymentType === "self_host" ? `[Self-Host Request] ${notes}` : notes,
      };

      const res = await api.post("/subdomains/request", payload);
      setLoading(false);

      if (res.success && res.data) {
        setResultData(res.data);
        setSubmitted(true);
      } else {
        setError(res.error?.message || "Failed to submit request. Please verify your details.");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (submitted && resultData) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="h-16 w-16 bg-emerald-50 text-emerald-600 border border-emerald-200/80 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
            Integration Request Received
          </h1>
          <p className="text-zinc-600 text-sm max-w-md mx-auto leading-relaxed">
            Your dedicated instance has been queued for provisioning. We will verify your official Meta WhatsApp connection and notify you directly.
          </p>
        </div>

        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 text-left space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs text-zinc-500 font-mono">Assigned Subdomain</span>
            <span className="text-sm font-bold text-[#2563eb] font-mono">
              https://{resultData.subdomain}.jidosaap.xyz
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block mb-0.5">Workspace / Brand</span>
              <span className="font-semibold text-zinc-900">{resultData.brand_name}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">WhatsApp Number</span>
              <span className="font-semibold text-zinc-900">{resultData.phone_number}</span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Selected Use Case</span>
              <span className="font-semibold text-emerald-600 capitalize">
                {resultData.use_case === "group_buddy"
                  ? "Group Buddy"
                  : resultData.use_case === "auto_responder"
                  ? "24/7 Smart Auto-Responder"
                  : "Custom Workflow"}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Status</span>
              <span className="font-semibold text-amber-600">Queued for Provisioning</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Link href="/">
            <button className="h-11 px-8 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs transition-all">
              Back to Home
            </button>
          </Link>
          <Link href="/solutions">
            <button className="h-11 px-6 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium text-xs transition-all">
              Explore Solutions
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/90 text-xs font-semibold text-zinc-700 shadow-2xs">
          <Server className="h-3.5 w-3.5 text-[#2563eb]" />
          <span>Dedicated Instance Onboarding</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Request Your Dedicated WhatsApp Integration
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-xl mx-auto">
          Every client receives an isolated environment, custom subdomain on <code className="font-mono text-zinc-800 font-bold">jidosaap.xyz</code>, and an official Meta WhatsApp Cloud API connection tailored to your exact workflow.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200/90 rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.04)] space-y-8">
        
        {/* Step 1: Select Primary Flow (Group Buddy vs Auto-Responder vs Custom) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
              1. Select Primary Automation Workflow
            </label>
            <span className="text-[11px] text-zinc-400">Choose a primary or specify custom</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {USE_CASES.map((uc) => {
              const Icon = uc.icon;
              const isSelected = selectedUseCase === uc.id;
              return (
                <div
                  key={uc.id}
                  onClick={() => setSelectedUseCase(uc.id)}
                  className={`cursor-pointer rounded-2xl border p-4.5 transition-all text-left relative flex items-start gap-4 ${
                    isSelected
                      ? "border-[#2563eb] bg-blue-50/30 ring-1 ring-[#2563eb] shadow-2xs"
                      : "border-zinc-200/80 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${uc.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-zinc-900 leading-snug">{uc.title}</div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{uc.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Deployment Type */}
        <div className="space-y-3 pt-2 border-t border-zinc-100">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
            2. Deployment Preference
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setDeploymentType("managed")}
              className={`cursor-pointer rounded-2xl border p-4 transition-all text-left flex items-start gap-3 ${
                deploymentType === "managed"
                  ? "border-[#2563eb] bg-blue-50/30 ring-1 ring-[#2563eb]"
                  : "border-zinc-200/80 bg-white hover:border-zinc-300"
              }`}
            >
              <Globe className="h-5 w-5 text-[#2563eb] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-zinc-900">Managed Cloud Subdomain</div>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                  Automated SSL, managed DNS on jidosaap.xyz, zero server setup required.
                </p>
              </div>
            </div>

            <div
              onClick={() => setDeploymentType("self_host")}
              className={`cursor-pointer rounded-2xl border p-4 transition-all text-left flex items-start gap-3 ${
                deploymentType === "self_host"
                  ? "border-[#2563eb] bg-blue-50/30 ring-1 ring-[#2563eb]"
                  : "border-zinc-200/80 bg-white hover:border-zinc-300"
              }`}
            >
              <Server className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-zinc-900">100% Self-Hosted (VPS / Docker)</div>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                  Deploy on your own server with full data sovereignty.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Choose Subdomain with Strict Reserved Word Blocking */}
        <div className="space-y-3 pt-2 border-t border-zinc-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
              3. Choose Your Subdomain on jidosaap.xyz
            </label>
            <span className="text-[11px] text-zinc-400 font-mono">*.jidosaap.xyz</span>
          </div>

          <div className="relative">
            <div className="flex items-center rounded-xl border border-zinc-200/90 bg-zinc-50/60 focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2563eb]/20 transition-all overflow-hidden">
              <span className="text-xs font-mono text-zinc-400 pl-4 pr-1 select-none">https://</span>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                placeholder="yourbrand, studio, or community"
                required
                className="flex-1 h-12 bg-transparent text-xs sm:text-sm font-semibold text-zinc-900 focus:outline-none font-mono"
              />
              <span className="text-xs font-bold text-zinc-600 font-mono pr-4 pl-2 select-none">
                .jidosaap.xyz
              </span>
            </div>
          </div>

          {checkingSubdomain && (
            <div className="text-xs text-zinc-400 font-mono animate-pulse">
              Checking subdomain availability...
            </div>
          )}
          {subdomainAvailable === true && !checkingSubdomain && (
            <div className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Available! Your dedicated instance will live at <strong>{subdomain}.jidosaap.xyz</strong></span>
            </div>
          )}
          {subdomainError && (
            <div className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{subdomainError}</span>
            </div>
          )}
        </div>

        {/* Step 4: Contact Details (Generic, Professional Placeholders - Zero mention of penna.dev) */}
        <div className="space-y-4 pt-2 border-t border-zinc-100">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
            4. Your Contact &amp; WhatsApp Information
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Johnson"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-zinc-200/90 text-xs sm:text-sm focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-zinc-200/90 text-xs sm:text-sm focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">WhatsApp Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-zinc-200/90 text-xs sm:text-sm focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">Brand / Company Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your Brand or Company Name"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-zinc-200/90 text-xs sm:text-sm focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-700">
                {selectedUseCase === "custom"
                  ? "Describe Your Custom Workflow Requirements"
                  : "Specific Requirements or Notes (Optional)"}
              </label>
              {selectedUseCase === "custom" && (
                <span className="text-[11px] text-[#2563eb] font-semibold">Required for custom</span>
              )}
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                selectedUseCase === "custom"
                  ? "Describe the WhatsApp automation you need (e.g. trigger message on Stripe payment, sync group members to Notion, custom CRM webhooks)..."
                  : "Describe your community size, expected message volume, or any custom integrations..."
              }
              className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 ${
                selectedUseCase === "custom"
                  ? "border-[#2563eb] bg-blue-50/10"
                  : "border-zinc-200/90"
              }`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs sm:text-sm shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Submitting integration request...</span>
            ) : (
              <>
                <span>Submit Integration Request</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="text-[11px] text-zinc-400 text-center mt-2.5">
            We will verify your WhatsApp Cloud API keys and activate your instance within 24 hours.
          </p>
        </div>
      </form>
    </div>
  );
}

export default function RequestIntegrationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading request form...</div>}>
      <RequestIntegrationForm />
    </Suspense>
  );
}
