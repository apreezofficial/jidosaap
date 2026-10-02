"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Newspaper,
  Palette,
  ShieldAlert,
  ArrowRight,
  Send,
  Zap,
  Phone,
  Check,
} from "lucide-react";
import { api } from "@/lib/api";

const USE_CASES = [
  {
    id: "newsletter_bridge",
    title: "Precious's Setup: Newsletter ➔ Status Bridge",
    desc: "1-Tap publish bridge from penna.dev, Substack, or RSS directly to your WhatsApp Status and reader broadcasts.",
    icon: Newspaper,
    color: "border-indigo-200 bg-indigo-50/50 hover:border-indigo-400 text-indigo-700",
  },
  {
    id: "graphic_scheduler",
    title: "Shola's Setup: Daily 7:00 AM Portfolio Drop",
    desc: "Consistent daily morning auto-posting of graphics/portfolio pieces to keep clients constantly engaged and booking.",
    icon: Palette,
    color: "border-amber-200 bg-amber-50/50 hover:border-amber-400 text-amber-700",
  },
  {
    id: "group_spam_guardian",
    title: "Michael's Setup: Group Spam & Strike Sentinel",
    desc: "24/7 intelligent group shield that detects spam links, issues automated strike warnings, and auto-exits repeat offenders.",
    icon: ShieldAlert,
    color: "border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 text-emerald-700",
  },
  {
    id: "custom",
    title: "Custom WhatsApp Superpower",
    desc: "Bespoke automation, CRM connector, or multi-agent pipeline tailored to your company's operational workflow.",
    icon: Zap,
    color: "border-rose-200 bg-rose-50/50 hover:border-rose-400 text-rose-700",
  },
];

function RequestIntegrationForm() {
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brandName, setBrandName] = useState("");
  const [subdomain, setSubdomain] = useState(searchParams.get("subdomain") || "");
  const [selectedUseCase, setSelectedUseCase] = useState(searchParams.get("use_case") || "newsletter_bridge");
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
      setSelectedUseCase(uc);
    }
  }, [searchParams]);

  const checkSubdomainDebounced = async (val: string) => {
    const clean = val.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!clean || clean.length < 3) {
      setSubdomainAvailable(null);
      setSubdomainError(clean ? "Must be at least 3 characters" : null);
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
          setSubdomainError(res.data.reason || "Subdomain is unavailable");
        } else {
          setSubdomainError(null);
        }
      } else {
        // fallback
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

    if (!subdomain || subdomain.length < 3) {
      setError("Please choose a valid subdomain (at least 3 characters).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        email,
        phone_number: phone,
        brand_name: brandName || fullName,
        subdomain,
        use_case: selectedUseCase,
        notes,
      };

      const res = await api.post("/subdomains/request", payload);
      setLoading(false);

      if (res.success && res.data) {
        setResultData(res.data);
        setSubmitted(true);
      } else {
        setError(res.error?.message || "Failed to submit request. Please verify details.");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (submitted && resultData) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-zinc-950">
            Dedicated WhatsApp Instance Reserved!
          </h1>
          <p className="text-zinc-600 text-sm max-w-md mx-auto">
            Your custom domain has been assigned. Our provisioning engine is setting up your dedicated Meta WhatsApp connection.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs text-zinc-400 font-mono">Assigned Domain:</span>
            <span className="text-sm font-bold text-rose-400 font-mono">
              https://{resultData.subdomain}.jidosaap.xyz
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-500 block">Workspace / Brand:</span>
              <span className="font-semibold text-zinc-200">{resultData.brand_name}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">WhatsApp Number:</span>
              <span className="font-semibold text-zinc-200">{resultData.phone_number}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Selected Use Case:</span>
              <span className="font-semibold text-emerald-400 capitalize">
                {resultData.use_case.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block">Status:</span>
              <span className="font-semibold text-amber-400">Queued for Setup</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/register">
            <Button size="lg" className="h-11 px-8 bg-zinc-950 text-white font-semibold">
              Go To Console
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="h-11 px-8">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Dedicated Instance Onboarding</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950">
          Claim Your Subdomain &amp; Setup Your WhatsApp Account
        </h1>
        <p className="text-sm sm:text-base text-zinc-600">
          Every client gets their own dedicated <code className="font-mono font-semibold text-rose-600">*.jidosaap.xyz</code> subdomain with an isolated Meta Cloud API instance configured for your exact use case.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1: Choose Use Case */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-zinc-900 block">
            1. Select Your Top WhatsApp Use Case
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {USE_CASES.map((uc) => {
              const Icon = uc.icon;
              const isSelected = selectedUseCase === uc.id;
              return (
                <div
                  key={uc.id}
                  onClick={() => setSelectedUseCase(uc.id)}
                  className={`cursor-pointer rounded-2xl border p-4.5 transition-all text-left relative ${
                    isSelected
                      ? "border-zinc-950 bg-zinc-50/80 ring-2 ring-zinc-950 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                      <Icon className="h-4 w-4 text-zinc-900" />
                    </div>
                    {isSelected && (
                      <span className="h-5 w-5 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 mb-1">{uc.title}</h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{uc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Choose Subdomain */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-zinc-900 block">
            2. Choose Your Dedicated Subdomain on jidosaap.xyz
          </label>
          <div className="relative">
            <div className="flex items-center rounded-xl border border-zinc-300 bg-white px-3 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
              <span className="text-xs font-semibold text-zinc-400">https://</span>
              <input
                type="text"
                placeholder="precious or shola or yourbrand"
                value={subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                className="w-full h-11 px-2 text-sm font-bold text-zinc-900 focus:outline-none"
                required
              />
              <span className="text-xs font-bold text-rose-600 font-mono bg-rose-50 px-2.5 py-1 rounded">
                .jidosaap.xyz
              </span>
            </div>

            {checkingSubdomain && (
              <span className="text-[11px] text-zinc-500 mt-1 block">Checking availability…</span>
            )}

            {subdomainAvailable === true && !checkingSubdomain && (
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <Check className="h-3 w-3" /> Available! Your isolated workspace will be hosted at {subdomain}.jidosaap.xyz
              </span>
            )}

            {subdomainError && (
              <span className="text-[11px] text-rose-600 font-medium mt-1 block">
                {subdomainError}
              </span>
            )}
          </div>
        </div>

        {/* Step 3: Contact & Business Info */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-zinc-900 block">
            3. Account &amp; WhatsApp Details
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Precious / Shola / Michael"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Work Email"
              type="email"
              placeholder="founder@yourbrand.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Company / Project Name"
              type="text"
              placeholder="penna.dev / Studio / Community"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />
            <Input
              label="WhatsApp Business Phone Number"
              type="text"
              placeholder="+234 800 000 0000 or +1 555 019 283"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
              Specific Requirements / Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Please configure status bridge to trigger whenever I publish a new newsletter issue on penna.dev..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs rounded-xl border border-zinc-200 p-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 bg-white"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md"
          isLoading={loading}
        >
          <span>Claim Subdomain &amp; Provision WhatsApp Account</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </form>
    </div>
  );
}

export default function RequestIntegrationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-3">
          <div className="h-8 w-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-zinc-500 font-medium">Loading integration onboarding…</p>
        </div>
      }
    >
      <RequestIntegrationForm />
    </Suspense>
  );
}

