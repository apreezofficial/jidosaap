import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Calendar,
  Zap,
  Kanban,
  BarChart3,
  CheckCircle2,
  Lock,
  Sparkles,
  Server,
  ChevronRight,
  ShieldCheck,
  Send,
  Building,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="pt-20 lg:pt-28 px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200/60 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-rose-600" />
          <span>Jidō (自動) — Intelligent Business Automation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 max-w-4xl mx-auto leading-[1.08]">
          Put WhatsApp on <span className="text-rose-600">Autopilot</span>.
        </h1>

        <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Create, automate, schedule, and manage your WhatsApp business with AI.
          Connect your official Meta Cloud API and scale conversations into revenue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8 text-sm gap-2">
              <span>Start For Free</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#architecture">
            <Button variant="outline" size="lg" className="h-12 px-8 text-sm">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Hero Visual Flow: API -> AI -> Automation -> WhatsApp -> Customer */}
        <div id="architecture" className="pt-12 max-w-5xl mx-auto">
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
                <div className="text-[11px] text-zinc-400">Fetch catalog, orders & CRM data</div>
              </div>

              {/* Step 2: AI Transformation */}
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
                <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold text-zinc-200">AI Intelligence</div>
                <div className="text-[11px] text-zinc-400">OpenAI formats & crafts copy</div>
              </div>

              {/* Step 3: Automation Logic */}
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center text-center space-y-2">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold text-zinc-200">Visual Engine</div>
                <div className="text-[11px] text-zinc-400">Branching & event scheduler</div>
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
                <div className="text-[11px] text-zinc-400">Instant engagement & reply</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            Enterprise Architecture. Built for WhatsApp.
          </h2>
          <p className="text-sm text-zinc-500">
            Think WhatsApp + Zapier + Buffer + CRM + AI Agent, engineered natively for high-velocity businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Content Scheduling */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Content Studio & Calendar</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Compose rich WhatsApp updates, apply approved templates, and schedule recurring broadcasts respecting your workspace timezone.
            </p>
          </div>

          {/* Card 2: AI Agents */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Autonomous AI Agents</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Train AI agents on your business knowledge base with vector embeddings, execute explicit tools, and seamlessly escalate to human teammates.
            </p>
          </div>

          {/* Card 3: API Automations */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">API Integration & Transformers</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Connect external REST APIs with encrypted secrets. Extract JSON fields and let AI generate dynamic, personalized WhatsApp notifications.
            </p>
          </div>

          {/* Card 4: Visual Workflows */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Visual Flow Builder</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Construct multi-branch automation trees with triggers, filters, delays, and WhatsApp actions without writing a single line of code.
            </p>
          </div>

          {/* Card 5: CRM Pipeline */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Kanban className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Embedded CRM & Leads</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Automatically capture contacts from incoming messages, qualify leads into a Kanban pipeline, and track conversions.
            </p>
          </div>

          {/* Card 6: Analytics */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-900">Unified Analytics & Audit</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Monitor messages sent, AI resolution rate, lead velocity, and complete immutable security audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-2xl bg-zinc-900 p-8 sm:p-12 text-center text-white space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to put your WhatsApp operations on autopilot?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Join hundreds of forward-thinking businesses using JidoSapp to automate customer conversations and workflows.
          </p>
          <Link href="/register">
            <Button size="lg" className="h-11 px-8 text-sm">
              Create Your Free Workspace
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
