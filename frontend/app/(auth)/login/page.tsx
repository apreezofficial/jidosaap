"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { JidoSappLogo } from "@/components/ui/logo";
import {
  X,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
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
    <div className="relative rounded-[32px] sm:rounded-[36px] bg-white border border-zinc-200/90 shadow-2xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 lg:gap-10 items-center overflow-hidden">
      {/* Top-Right Close Button */}
      <Link
        href="/"
        className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-20"
        title="Close"
      >
        <X className="h-5 w-5 stroke-[2.2]" />
      </Link>

      {/* Left Column: Mascot & Illustration Card in JidoSapp Royal Blue Theme */}
      <div className="w-full md:w-1/2 rounded-[28px] bg-gradient-to-br from-blue-50/90 via-[#eef4ff] to-[#e0edff] border border-blue-100/90 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[380px] sm:min-h-[470px] select-none">
        {/* Brand Logo at top */}
        <div className="relative z-10 flex items-center">
          <JidoSappLogo size="md" />
        </div>

        {/* Floating Sheet of Paper / Analytics Report in Blue/Cyan Theme */}
        <div className="absolute top-8 right-8 w-28 sm:w-32 bg-white rounded-xl shadow-md border border-blue-100 p-3 transform rotate-12 z-0 space-y-2 opacity-95">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-[#2563eb]" />
            <div className="h-1.5 w-10 bg-zinc-200 rounded" />
          </div>
          <div className="flex items-end gap-1.5 h-12 pt-2 border-b border-zinc-100">
            <div className="w-3 bg-blue-100 rounded-t h-6" />
            <div className="w-3 bg-[#2563eb] rounded-t h-12" />
            <div className="w-3 bg-[#00b4d8] rounded-t h-9" />
            <div className="w-3 bg-sky-200 rounded-t h-7" />
          </div>
          <div className="h-1 w-full bg-zinc-100 rounded" />
        </div>

        {/* Floating Decorative Pill Bars & Dots in Blue Theme */}
        <div className="absolute right-10 top-40 flex flex-col gap-2 z-0 opacity-70">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
            <span className="w-12 h-2.5 rounded-full bg-[#2563eb]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00b4d8]" />
            <span className="w-12 h-2.5 rounded-full bg-[#00b4d8]" />
          </div>
        </div>

        {/* Character Illustration in JidoSapp Blue Theme */}
        <div className="relative z-10 mt-auto pt-16 flex items-end justify-center">
          <svg
            viewBox="0 0 320 280"
            className="w-full max-w-[280px] drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Waving Paw / Hand */}
            <path
              d="M210 180 C205 140, 245 130, 255 160 C265 135, 290 145, 285 175 C295 160, 315 175, 305 200 C310 220, 290 250, 260 255 C230 260, 205 230, 210 180 Z"
              fill="#e0e7ff"
              stroke="#2563eb"
              strokeWidth="3.5"
            />
            {/* Paw pads */}
            <ellipse cx="260" cy="215" rx="22" ry="18" fill="#c7d2fe" />
            <circle cx="238" cy="175" r="7" fill="#c7d2fe" />
            <circle cx="262" cy="165" r="7" fill="#c7d2fe" />
            <circle cx="285" cy="178" r="7" fill="#c7d2fe" />

            {/* Character Face & Body */}
            <ellipse cx="140" cy="210" rx="90" ry="75" fill="#e0e7ff" stroke="#2563eb" strokeWidth="4" />
            {/* Left Ear */}
            <circle cx="65" cy="165" r="28" fill="#e0e7ff" stroke="#2563eb" strokeWidth="4" />
            <circle cx="65" cy="165" r="16" fill="#c7d2fe" />
            {/* Right Ear */}
            <circle cx="215" cy="165" r="28" fill="#e0e7ff" stroke="#2563eb" strokeWidth="4" />
            <circle cx="215" cy="165" r="16" fill="#c7d2fe" />

            {/* Cyan Hair */}
            <path
              d="M75 160 C90 140, 110 155, 120 135 C135 155, 155 140, 170 150 C180 135, 200 150, 205 165 C170 160, 130 160, 75 160 Z"
              fill="#67e8f9"
              stroke="#0891b2"
              strokeWidth="3.5"
            />

            {/* Aviator Helmet in Gold & Blue */}
            <path
              d="M70 130 C70 70, 210 70, 210 130 C205 145, 75 145, 70 130 Z"
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth="4"
            />
            {/* Goggles Royal Blue Strap & Glass */}
            <rect x="80" y="85" width="120" height="42" rx="14" fill="#2563eb" stroke="#1d4ed8" strokeWidth="4" />
            <rect x="95" y="92" width="40" height="28" rx="8" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
            <rect x="145" y="92" width="40" height="28" rx="8" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
            <line x1="105" y1="96" x2="125" y2="116" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
            <line x1="155" y1="96" x2="175" y2="116" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />

            {/* Happy Eyes */}
            <path d="M105 195 Q115 180 125 195" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <path d="M155 195 Q165 180 175 195" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Cute Nose */}
            <ellipse cx="140" cy="202" rx="6" ry="4" fill="#3b82f6" />

            {/* Playful Smile */}
            <path d="M125 215 Q140 232 155 215" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M132 222 Q140 236 148 222" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />

            {/* Shirt in Royal Blue with 'J' Logo */}
            <path
              d="M75 255 C90 240, 190 240, 205 255 C190 290, 90 290, 75 255 Z"
              fill="#2563eb"
              stroke="#1e40af"
              strokeWidth="4"
            />
            <rect x="132" y="260" width="16" height="18" rx="4" fill="white" />
            <path d="M142 264 V270 A2 2 0 0 1 138 270" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Right Column: Clean Login Form in JidoSapp Theme */}
      <div className="w-full md:w-1/2 space-y-6 max-w-sm mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 font-sans">
            Login
          </h1>
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

        {/* Or Continue With Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-zinc-400 font-medium tracking-tight whitespace-nowrap">
            Or Continue With
          </span>
          <div className="border-t border-zinc-200 w-full" />
        </div>

        {/* Social Round Buttons: Google, Facebook, Apple */}
        <div className="flex items-center justify-center gap-3">
          {/* Google */}
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-zinc-200/80 bg-white hover:bg-zinc-50 shadow-2xs flex items-center justify-center transition-all"
            title="Sign in with Google"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
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
          </button>

          {/* Facebook */}
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-zinc-200/80 bg-white hover:bg-zinc-50 shadow-2xs flex items-center justify-center transition-all text-[#1877F2]"
            title="Sign in with Facebook"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* Apple */}
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-zinc-200/80 bg-white hover:bg-zinc-50 shadow-2xs flex items-center justify-center transition-all text-zinc-900"
            title="Sign in with Apple"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.89.04-2 .6-2.64 1.35-.57.65-1.07 1.73-.93 2.77 1 .08 2-.54 2.56-1.25z" />
            </svg>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-zinc-500 pt-1">
          Don&apos;t have an instance yet?{" "}
          <Link
            href="/request-integration"
            className="text-[#2563eb] hover:underline font-bold"
          >
            Request Demo here
          </Link>
        </div>
      </div>
    </div>
  );
}
