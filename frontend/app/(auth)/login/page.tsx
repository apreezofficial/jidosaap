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

      {/* ── LEFT COLUMN: COOL-HEADED MASCOT & ILLUSTRATION CARD ── */}
      <div className="w-full md:w-1/2 rounded-[28px] bg-gradient-to-br from-blue-50/90 via-[#eef4ff] to-[#e0edff] border border-blue-100/90 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[460px] sm:min-h-[540px] select-none shadow-xs">
        
        {/* Real Official JidoSapp Logo at top (Prominent & Clean) */}
        <div className="relative z-10 flex items-center justify-between">
          <JidoSappLogo size="lg" />
          <span className="px-2.5 py-1 rounded-full bg-white/90 border border-blue-200/80 text-[10px] font-bold text-[#2563eb] shadow-2xs">
            v2.0 Active
          </span>
        </div>

        {/* ── FLOATING WIDGET 1: Top-Right Analytics & Task Card ── */}
        <div className="absolute top-16 right-5 sm:right-7 w-36 bg-white/95 backdrop-blur-xs rounded-2xl shadow-[0_12px_28px_rgba(37,99,235,0.08)] border border-blue-100/80 p-3 z-0 space-y-2 transform rotate-6 hover:rotate-3 transition-transform duration-300 animate-edge-tr">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2563eb] animate-pulse" />
              <span className="text-[9px] font-bold text-zinc-700">7:00 AM Drop</span>
            </div>
            <span className="text-[8px] font-mono text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-bold">100%</span>
          </div>
          {/* Mini Bar Chart */}
          <div className="flex items-end gap-1.5 h-10 pt-1 border-b border-zinc-100">
            <div className="w-4 bg-blue-100 rounded-t h-5" />
            <div className="w-4 bg-[#2563eb] rounded-t h-10" />
            <div className="w-4 bg-[#00b4d8] rounded-t h-7" />
            <div className="w-4 bg-sky-200 rounded-t h-6" />
          </div>
          <div className="flex items-center justify-between text-[8px] text-zinc-400 font-mono">
            <span>Dispatched</span>
            <span>1,240 sent</span>
          </div>
        </div>

        {/* ── FLOATING WIDGET 2: Left Side Auto-Responder Chip ── */}
        <div className="absolute left-4 top-40 bg-white/90 backdrop-blur-xs rounded-xl shadow-sm border border-blue-100 px-3 py-1.5 z-0 flex items-center gap-2 transform -rotate-3 animate-edge-tl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-800">24/7 Auto-Responder</span>
        </div>

        {/* ── FLOATING TWINKLE STARS ── */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 pointer-events-none text-[#2563eb]/40 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute top-52 right-12 pointer-events-none text-cyan-400/60 animate-pulse [animation-delay:1s]">
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* ── COOL-HEADED CHARACTER MASCOT SVG (BIGGER, WITH HEADPHONES & ANIMATION) ── */}
        <div className="relative z-10 mt-auto pt-6 flex items-end justify-center animate-edge-bl">
          <svg
            viewBox="0 0 340 300"
            className="w-full max-w-[320px] sm:max-w-[350px] drop-shadow-md overflow-visible transition-transform duration-300 hover:scale-102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ambient Shadow under Mascot */}
            <ellipse cx="170" cy="285" rx="100" ry="12" fill="#2563eb" fillOpacity="0.12" />

            {/* ── COOL HEADPHONES: Over-ear Studio Headband ── */}
            <path
              d="M75 140 C75 60, 265 60, 265 140"
              stroke="#0f172a"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Headphone Top Cushion in Royal Blue */}
            <path
              d="M110 80 C130 70, 210 70, 230 80"
              stroke="#2563eb"
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* ── Left Ear Speaker Ear-cup (Cool Headed) ── */}
            <rect x="58" y="115" width="28" height="52" rx="14" fill="#0f172a" stroke="#2563eb" strokeWidth="3" />
            <circle cx="72" cy="141" r="7" fill="#38bdf8" />
            {/* ── Right Ear Speaker Ear-cup (Cool Headed) ── */}
            <rect x="254" y="115" width="28" height="52" rx="14" fill="#0f172a" stroke="#2563eb" strokeWidth="3" />
            <circle cx="268" cy="141" r="7" fill="#38bdf8" />

            {/* ── Mascot Face & Body Structure ── */}
            <ellipse cx="170" cy="195" rx="88" ry="76" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" />

            {/* Cyan Hair Locks on Forehead */}
            <path
              d="M125 130 C140 115, 155 125, 170 112 C185 128, 205 118, 215 132 C185 128, 150 128, 125 130 Z"
              fill="#00b4d8"
            />

            {/* ── Cool Sunglasses / Visor in Obsidian Glass with Cyan Highlights ── */}
            <rect x="105" y="148" width="130" height="42" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="3.5" />
            <rect x="112" y="154" width="52" height="30" rx="8" fill="#1e293b" />
            <rect x="176" y="154" width="52" height="30" rx="8" fill="#1e293b" />
            {/* Futuristic Cyan/Blue Light Flares across Visor */}
            <line x1="120" y1="160" x2="148" y2="178" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <line x1="184" y1="160" x2="212" y2="178" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="158" cy="169" r="2.5" fill="#00b4d8" />
            <circle cx="222" cy="169" r="2.5" fill="#00b4d8" />

            {/* Cute Nose */}
            <ellipse cx="170" cy="202" rx="6" ry="4" fill="#2563eb" />

            {/* Confident Smile */}
            <path d="M152 216 Q170 234 188 216" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M161 223 Q170 238 179 223" fill="#2563eb" />

            {/* ── Body Hoodie / Shirt in Royal Blue with Jido Badge ── */}
            <path
              d="M95 248 C115 235, 225 235, 245 248 C235 290, 105 290, 95 248 Z"
              fill="#2563eb"
              stroke="#1d4ed8"
              strokeWidth="4"
            />
            {/* White Hoodie strings */}
            <line x1="155" y1="248" x2="155" y2="272" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="185" y1="248" x2="185" y2="272" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

            {/* ── Dynamic Waving Paw / Hand with Tablet on Right ── */}
            <g className="animate-squircle-bob">
              <path
                d="M245 195 C240 160, 275 150, 285 175 C295 155, 320 165, 315 190 C325 178, 342 192, 335 212 C338 230, 320 255, 292 258 C265 262, 242 235, 245 195 Z"
                fill="#eff6ff"
                stroke="#2563eb"
                strokeWidth="3.5"
              />
              {/* Paw pads in cyan */}
              <ellipse cx="292" cy="222" rx="18" ry="14" fill="#bae6fd" />
              <circle cx="274" cy="188" r="6" fill="#bae6fd" />
              <circle cx="294" cy="180" r="6" fill="#bae6fd" />
              <circle cx="314" cy="190" r="6" fill="#bae6fd" />
            </g>
          </svg>
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
