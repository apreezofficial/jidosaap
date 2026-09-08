import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Zap, Bot, Kanban, BarChart3, Sparkles, Lock, Server, ShieldCheck, Send, Building } from "lucide-react";

export default function ArchitecturePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
      <section id="architecture" className="pt-12 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-950 p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
              <span className="ml-2 text-xs text-zinc-400 font-mono">
                jidosapp://engine/pipeline.live
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Real-Time Engine</span>
            </div>
          </div>
          {/* Visual Node Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1: External API */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Server className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-zinc-200">External API</div>
              <div className="text-[11px] text-zinc-400">Fetch catalog, orders &amp; CRM data</div>
            </div>
            {/* Step 2: AI Transformation */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-zinc-200">AI Intelligence</div>
              <div className="text-[11px] text-zinc-400">OpenAI formats &amp; crafts copy</div>
            </div>
            {/* Step 3: Automation Logic */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-zinc-200">Visual Engine</div>
              <div className="text-[11px] text-zinc-400">Branching &amp; event scheduler</div>
            </div>
            {/* Step 4: Official Meta WhatsApp */}
            <div className="rounded-xl bg-zinc-900 border border-emerald-500/30 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-emerald-300">Meta Cloud API</div>
              <div className="text-[11px] text-zinc-400">Official verified delivery</div>
            </div>
            {/* Step 5: Customer */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
              <div className="h-10 w-10 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                <Send className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold text-zinc-200">Customer</div>
              <div className="text-[11px] text-zinc-400">Instant engagement &amp; reply</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
