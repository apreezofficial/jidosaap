"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Server,
  Zap,
  ShieldCheck,
  Send,
  Globe,
  ArrowRight,
  Database,
  Lock,
} from "lucide-react";

export default function ArchitecturePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#2563eb] text-xs font-semibold border border-blue-200">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Multi-Tenant Subdomain Topology</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950">
          Your WhatsApp can do more than you think.
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">
          How JidoSapp isolates every client onto their own dedicated <code className="font-mono font-bold text-zinc-900">*.jidosaap.xyz</code> subdomain, routing incoming webhooks and outgoing WhatsApp Cloud API messages through dedicated containers.
        </p>
      </div>

      <section id="architecture" className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-950 p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
              <span className="ml-2 text-xs text-zinc-400 font-mono">
                jidosaap://topology/*.jidosaap.xyz
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Isolated Subdomain Routing</span>
            </div>
          </div>

          {/* Visual Node Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1: Subdomain Ingress */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-zinc-200">Subdomain Ingress</div>
              <div className="text-[11px] text-zinc-400">client.jidosaap.xyz resolves tenant workspace</div>
            </div>

            {/* Step 2: Trigger / Bridge */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <Server className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-zinc-200">Bridge Trigger</div>
              <div className="text-[11px] text-zinc-400">Webhook / CRM event / Inbound WhatsApp</div>
            </div>

            {/* Step 3: Automation Logic */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-zinc-200">JidoSapp Engine</div>
              <div className="text-[11px] text-zinc-400">Filter, format status card, strike counter</div>
            </div>

            {/* Step 4: Official Meta WhatsApp */}
            <div className="rounded-xl bg-zinc-900 border border-emerald-500/30 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-emerald-300">Meta Cloud API</div>
              <div className="text-[11px] text-zinc-400">Isolated token &amp; verified encryption</div>
            </div>

            {/* Step 5: WhatsApp Audience / Group */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                <Send className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-zinc-200">WhatsApp Audience</div>
              <div className="text-[11px] text-zinc-400">Status update, client inquiry or group shield</div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center pt-4">
        <Link href="/request-integration">
          <Button size="lg" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold gap-2">
            <span>Claim Your Subdomain &amp; Setup Account</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
