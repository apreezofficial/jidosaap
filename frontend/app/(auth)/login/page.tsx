"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error?.message || "Invalid email or password");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-zinc-200/80 bg-white p-7 sm:p-9 shadow-xl space-y-6">
      {/* Header & Architecture Badge */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[10px] font-semibold text-[#2563eb]">
          <Globe className="h-3 w-3" />
          <span>Multi-Tenant Instance Gateway</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Sign in to your instance
        </h1>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Access your WhatsApp automations, inbox, CRM pipeline, and Meta Cloud API integration.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-800">
            Work Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200/90 bg-white text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-zinc-800">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-[#2563eb] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200/90 bg-white text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to Instance</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Instance Request Card */}
      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1.5">
        <p className="text-xs font-semibold text-zinc-800">
          Need a dedicated instance for your brand?
        </p>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Every client gets their own isolated subdomain (e.g. <code>yourbrand.jidosaap.xyz</code>) with private Webhooks and official Meta API endpoints.
        </p>
        <div className="pt-1">
          <Link
            href="/request-integration"
            className="text-xs font-bold text-[#2563eb] hover:underline inline-flex items-center gap-1"
          >
            <span>Request Demo &amp; Setup</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
