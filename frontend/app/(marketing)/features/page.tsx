import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Zap, Bot, Kanban, BarChart3, Sparkles, Lock, Server, ShieldCheck, Send } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
      <section id="features" className="grid md:grid-cols-3 gap-8">
        {/* Card 1: Content Scheduling */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Calendar className="h-5 w-5" /></div>
          <h3 className="font-semibold text-zinc-900">Content Studio &amp; Calendar</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Compose rich WhatsApp updates, apply approved templates, and schedule recurring broadcasts respecting your workspace timezone.
          </p>
        </div>
        {/* Card 2: AI Agents */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Bot className="h-5 w-5" /></div>
          <h3 className="font-semibold text-zinc-900">Autonomous AI Agents</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Train AI agents on your business knowledge base with vector embeddings, execute explicit tools, and seamlessly escalate to human teammates.
          </p>
        </div>
        {/* Card 3: API Automations */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Zap className="h-5 w-5" /></div>
          <h3 className="font-semibold text-zinc-900">API Integration &amp; Transformers</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Connect external REST APIs with encrypted secrets. Extract JSON fields and let AI generate dynamic, personalized WhatsApp notifications.
          </p>
        </div>
        {/* Card 4: Visual Workflows */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Sparkles className="h-5 w-5" /></div>
          <h3 className="font-semibold text-zinc-900">Visual Flow Builder</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Construct multi-branch automation trees with triggers, filters, delays, and WhatsApp actions without writing a single line of code.
          </p>
        </div>
        {/* Card 5: CRM Pipeline */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Kanban className="h-5 w-5" /></div>
          <h3 className="font-semibold text-zinc-900">Embedded CRM &amp; Leads</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Automatically capture contacts from incoming messages, qualify leads into a Kanban pipeline, and track conversions.
          </p>
        </div>
        {/* Card 6: Analytics */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><BarChart3 className="h-5 w-5" /></div>
          <h3 className="font-semibold text-zinc-900">Unified Analytics &amp; Audit</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Monitor messages sent, AI resolution rate, lead velocity, and complete immutable security audit trails.
          </p>
        </div>
      </section>
    </div>
  );
}
