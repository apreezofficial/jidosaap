"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Newspaper,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Share2,
  Zap,
  Globe,
} from "lucide-react";

export default function NewsletterBridgePage() {
  const [published, setPublished] = useState(false);
  const [statusViews, setStatusViews] = useState(412);

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-24">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-700">
          <Newspaper className="h-3.5 w-3.5" />
          <span>Publishing &amp; Distribution Bridge</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Publish from Penna.dev directly to WhatsApp Status.
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          No copy-pasting links. No uploading manual screenshots. Click "Publish" on your blog or newsletter, and JidoSapp automatically formats and drops the card straight onto your official WhatsApp Status.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/request-integration">
            <button className="h-11 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
              Request Newsletter Integration
            </button>
          </Link>
          <a
            href="https://www.penna.dev/apcodesphere/8078b477-011e-4b6b-bcf1-30414d28faf7"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-5 rounded-xl bg-white border border-zinc-200/80 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>Read Precious's Article on Penna</span>
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Interactive Live Demo */}
      <div className="rounded-[32px] border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-xs max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
              Live Simulation
            </span>
            <h3 className="text-xl font-bold text-zinc-900 mt-1">
              Try the 1-Tap Penna.dev Status Bridge
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Webhook: 200 OK
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Article Card on penna.dev */}
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span className="font-bold text-indigo-600">penna.dev/apcodesphere</span>
              <span>Published Today</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-zinc-900 leading-snug">
                User Experience: the gateway to the users heart
              </h4>
              <p className="text-xs text-zinc-500 line-clamp-3">
                Why human-centric UX is the most understated competitive advantage in software engineering, and why every interaction should spark joy.
              </p>
            </div>

            <button
              onClick={() => {
                setPublished(true);
                setStatusViews((prev) => prev + 48);
              }}
              className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{published ? "Re-sync to WhatsApp Status" : "Tap to Sync to WhatsApp Status"}</span>
            </button>
          </div>

          {/* WhatsApp Status Phone Preview */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>WhatsApp Status Preview</span>
              </div>
              <span className="font-mono text-zinc-500">{statusViews} views</span>
            </div>

            {published ? (
              <div className="bg-white rounded-xl p-5 border border-emerald-100 shadow-sm space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] font-bold text-zinc-700">Precious • Just now</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 text-white space-y-1">
                  <div className="text-xs font-bold text-emerald-400">✨ NEW ARTICLE ON PENNA.DEV</div>
                  <div className="text-sm font-bold">User Experience: the gateway to the users heart</div>
                  <div className="text-[11px] text-zinc-400 truncate">https://www.penna.dev/apcodesphere/8078b477-011e-4b6b...</div>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Successfully posted to WhatsApp Status via JidoSapp webhook</span>
                </div>
              </div>
            ) : (
              <div className="h-36 rounded-xl border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center text-center p-4 text-emerald-700/70 text-xs">
                <span>Click "Tap to Sync to WhatsApp Status" to trigger the webhook simulation</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works 3-Step Section */}
      <div className="space-y-10 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            How the Penna &amp; Newsletter Bridge works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Simple 3-step setup with zero complex SDKs required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
              01
            </div>
            <h4 className="text-base font-bold text-zinc-950">Connect Webhook</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Add your dedicated JidoSapp webhook URL (e.g. <code>precious.jidosaap.xyz/api/status</code>) to your Penna, Substack, or CMS publish event.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
              02
            </div>
            <h4 className="text-base font-bold text-zinc-950">Auto-Format Rich Media</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              JidoSapp automatically generates a tailored status card, rich preview, and shortlink optimized for mobile WhatsApp readers.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
              03
            </div>
            <h4 className="text-base font-bold text-zinc-950">Instant Status Delivery</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Dispatched straight to your official WhatsApp Status via Meta Cloud API within 250ms of hitting publish.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-[32px] bg-zinc-950 p-10 sm:p-14 text-center text-white space-y-6 max-w-5xl mx-auto border border-zinc-800">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to bridge your writing to WhatsApp Status?
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Claim your custom subdomain and get your dedicated status webhook provisioned in minutes.
        </p>
        <Link href="/request-integration">
          <button className="h-11 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
            Get Your Subdomain &amp; Setup Status Bridge
          </button>
        </Link>
      </div>
    </div>
  );
}
