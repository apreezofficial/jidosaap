"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { JidoSappLogo, JidoSappIcon } from "@/components/ui/logo";
import {
  X,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Send,
  Zap,
} from "lucide-react";

export default function BlueMoxfitaskLoginPage() {
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
    <div className="relative rounded-[32px] sm:rounded-[36px] bg-white border border-zinc-200/90 shadow-2xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 items-center overflow-hidden">
      {/* Top-Right Close Button */}
      <Link
        href="/"
        className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-20"
        title="Close"
      >
        <X className="h-5 w-5 stroke-[2.2]" />
      </Link>

      {/* ── LEFT COLUMN: FOCUSED SENTINEL MONITORING THE FORM ── */}
      <div className="w-full md:w-1/2 rounded-[28px] bg-gradient-to-br from-blue-50/80 via-[#f0f5ff] to-[#e4edff] border border-blue-100/90 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[460px] sm:min-h-[520px] select-none shadow-xs">
        {/* Real Official JidoSapp Logo at top */}
        <div className="relative z-10 flex items-center justify-between">
          <JidoSappLogo size="lg" />
          <span className="px-2.5 py-1 rounded-full bg-white/90 border border-blue-200/80 text-[10px] font-bold text-[#2563eb] shadow-2xs font-outfit">
            v2.0 Active
          </span>
        </div>

        {/* Sentinel Character actively monitoring the login form */}
        <div className="relative z-10 my-auto pt-4 flex flex-col items-center">
          {/* Reassuring speech bubble pointing from sentinel to the form */}
          <div className="relative bg-white/95 backdrop-blur-xs border border-blue-200/90 rounded-2xl p-3.5 shadow-sm max-w-[270px] text-left mb-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2563eb] uppercase tracking-wider font-outfit mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Session Guard Active
            </div>
            <p className="text-xs text-zinc-700 font-medium leading-relaxed font-outfit">
              &ldquo;I&apos;m monitoring this login. Enter your details to access your WhatsApp workspace.&rdquo;
            </p>
            {/* Speech bubble pointer */}
            <div className="absolute -bottom-2 left-12 w-4 h-4 bg-white border-b border-r border-blue-200/90 transform rotate-45" />
          </div>

          {/* Clean Person / Sentinel SVG facing right directly at the login form */}
          <div className="w-full flex justify-center">
            <svg
              viewBox="0 0 320 270"
              className="w-full max-w-[280px] sm:max-w-[310px] drop-shadow-sm overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Soft Ambient Ground Shadow */}
              <ellipse cx="160" cy="255" rx="90" ry="12" fill="#2563eb" fillOpacity="0.12" />

              {/* Shoulders & Royal Blue Jacket */}
              <path
                d="M75 250 C75 205, 115 190, 160 190 C205 190, 245 205, 245 250"
                fill="#2563eb"
                stroke="#1d4ed8"
                strokeWidth="4"
              />
              {/* White undershirt & jacket collar */}
              <path d="M142 190 L160 218 L178 190" fill="#eff6ff" />
              <line x1="160" y1="218" x2="160" y2="250" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

              {/* Neck */}
              <rect x="146" y="160" width="28" height="34" rx="8" fill="#e0e7ff" />

              {/* Head */}
              <ellipse cx="160" cy="120" rx="54" ry="56" fill="#f8fafc" stroke="#2563eb" strokeWidth="4" />

              {/* Modern Dark Hair with Subtle Cyan Highlights */}
              <path
                d="M110 110 C106 70, 150 56, 205 66 C216 70, 218 82, 212 94 C202 82, 180 76, 160 78 C135 81, 118 94, 110 110 Z"
                fill="#0f172a"
              />
              <path
                d="M124 80 C146 66, 184 66, 210 80"
                stroke="#00b4d8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Over-ear Headset with Mic (Monitoring Communications) */}
              <path
                d="M104 116 C102 76, 218 76, 216 116"
                stroke="#0f172a"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Left & Right Ear Cushions */}
              <rect x="96" y="100" width="16" height="34" rx="8" fill="#0f172a" stroke="#2563eb" strokeWidth="2" />
              <rect x="208" y="100" width="16" height="34" rx="8" fill="#0f172a" stroke="#2563eb" strokeWidth="2" />
              <circle cx="216" cy="117" r="4" fill="#00b4d8" />

              {/* Headset boom mic pointing forward towards mouth & form */}
              <path
                d="M214 122 C214 144, 192 154, 178 150"
                stroke="#0f172a"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <rect x="170" y="146" width="10" height="7" rx="3" fill="#00b4d8" />

              {/* Eyebrows angled in alert, friendly focus */}
              <path d="M136 104 Q148 100 156 104" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <path d="M172 103 Q184 99 194 104" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

              {/* Watchful Eyes Looking Directly Right at the Form */}
              <ellipse cx="148" cy="115" rx="8.5" ry="7.5" fill="white" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="152" cy="115" r="3.8" fill="#0f172a" />
              <circle cx="154" cy="113" r="1.3" fill="white" />

              <ellipse cx="182" cy="115" rx="8.5" ry="7.5" fill="white" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="186" cy="115" r="3.8" fill="#0f172a" />
              <circle cx="188" cy="113" r="1.3" fill="white" />

              {/* Confident, Reassuring Smile */}
              <path d="M158 138 Q170 147 184 138" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

              {/* Welcoming Hand gesture directing right towards the inputs */}
              <path
                d="M226 205 C242 190, 262 195, 272 204 C276 208, 278 215, 270 222 L236 235 Z"
                fill="#f8fafc"
                stroke="#2563eb"
                strokeWidth="3"
              />
              <circle cx="266" cy="210" r="3" fill="#00b4d8" />
            </svg>
          </div>
        </div>

        {/* Clean, calm bottom note */}
        <div className="relative z-10 text-center">
          <span className="text-[11px] text-zinc-400 font-medium font-outfit">
            End-to-end encrypted session &bull; JidoSapp Meta Engine
          </span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: CLEAN OUTFIT LOGIN FORM ── */}
      <div className="w-full md:w-1/2 space-y-6 max-w-sm mx-auto">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 font-outfit">
            Login
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Access your autonomous WhatsApp dashboard
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-800">
              Email
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

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-800">
              Password
            </label>
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
            <div className="flex justify-end pt-0.5">
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-[#2563eb] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Primary Royal Blue Log In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center pt-2">
          <div className="border-t border-zinc-200/80 w-full" />
          <span className="bg-white px-3 text-[11px] text-zinc-400 uppercase tracking-wider shrink-0 font-medium">
            Or Continue With
          </span>
          <div className="border-t border-zinc-200/80 w-full" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="h-11 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-2xs flex items-center justify-center gap-2 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            className="h-11 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-2xs flex items-center justify-center gap-2 transition-all"
          >
            <svg className="w-4 h-4 fill-current text-zinc-900" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.13.64-2.82 1.45-.6.71-1.13 1.87-1.01 2.98 1.08.08 2.18-.51 2.84-1.33z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Footer Sign Up Link */}
        <p className="text-center text-xs text-zinc-500 pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/request-integration"
            className="font-bold text-[#2563eb] hover:underline"
          >
            Request Demo &amp; Setup
          </Link>
        </p>
      </div>
    </div>
  );
}
