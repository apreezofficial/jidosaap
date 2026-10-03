import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JidoSappIcon } from "@/components/ui/logo";
import {
  ProformsLogo,
  PennaLogo,
  WhatsAppLogo,
  MetaLogo,
  SlackLogo,
  GmailLogo,
  FigmaLogo,
  NotionLogo,
  StripeLogo,
  OpenAILogo,
  ZendeskLogo,
  HubSpotLogo,
  CalLogo,
  WebhookLogo,
} from "./IntegrationLogos";

interface IntegrationItem {
  name: string;
  category: string;
  logo: React.ReactNode;
  popular?: boolean;
}

export function IntegrationsSection() {
  const integrations: IntegrationItem[] = [
    {
      name: "Proforms",
      category: "Forms & Surveys",
      logo: <ProformsLogo className="w-8 h-8" />,
      popular: true,
    },
    {
      name: "Penna",
      category: "AI & Docs",
      logo: <PennaLogo className="w-8 h-8" />,
    },
    {
      name: "WhatsApp",
      category: "Direct Messaging",
      logo: <WhatsAppLogo className="w-8 h-8" />,
      popular: true,
    },
    {
      name: "Meta API",
      category: "Platform Infra",
      logo: <MetaLogo className="w-8 h-8" />,
    },
    {
      name: "Slack",
      category: "Internal Comms",
      logo: <SlackLogo className="w-8 h-8" />,
    },
    {
      name: "Gmail",
      category: "Email Sync",
      logo: <GmailLogo className="w-8 h-8" />,
    },
    {
      name: "Figma",
      category: "Design Sync",
      logo: <FigmaLogo className="w-8 h-8" />,
    },
    {
      name: "Notion",
      category: "Knowledge Base",
      logo: <NotionLogo className="w-8 h-8" />,
    },
    {
      name: "Stripe",
      category: "Billing & Invoicing",
      logo: <StripeLogo className="w-8 h-8" />,
      popular: true,
    },
    {
      name: "OpenAI",
      category: "LLM Orchestration",
      logo: <OpenAILogo className="w-8 h-8" />,
      popular: true,
    },
    {
      name: "Zendesk",
      category: "Customer Support",
      logo: <ZendeskLogo className="w-8 h-8" />,
    },
    {
      name: "HubSpot",
      category: "CRM & Pipelines",
      logo: <HubSpotLogo className="w-8 h-8" />,
    },
    {
      name: "Cal.com",
      category: "Scheduling",
      logo: <CalLogo className="w-8 h-8" />,
    },
    {
      name: "Webhook",
      category: "REST & Realtime",
      logo: <WebhookLogo className="w-8 h-8" />,
      popular: true,
    },
  ];

  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
          <span>Ecosystem &amp; Integrations</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-normal leading-[1.05] max-w-4xl mx-auto font-outfit"
          style={{ letterSpacing: "-2px", fontWeight: 400 }}
        >
          <span className="block text-zinc-950 font-normal">
            Connect the tools you rely on
          </span>
          <span className="block text-[#9ca3af] mt-1 sm:mt-1.5 font-normal">
            every single day.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Plug your WhatsApp business channel directly into your existing CRM, billing engines, design platforms, and AI models with zero hassle.
        </p>
      </div>

      {/* Centerpiece Constellation with JidoSapp Brand Hub */}
      <div className="relative max-w-5xl mx-auto bg-radial from-blue-50/50 via-zinc-50/20 to-transparent p-6 sm:p-10 rounded-[36px] border border-zinc-200/70 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.06)]">
        {/* Central JidoSapp Automation Core */}
        <div className="flex flex-col items-center justify-center mb-12 sm:mb-16 relative">
          <div className="relative group">
            {/* Glow Aura */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#2563eb]/20 to-[#00b4d8]/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
            
            {/* Logo Squircle Badge */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[26px] bg-white border border-blue-200/90 shadow-[0_12px_36px_rgba(37,99,235,0.18)] flex items-center justify-center p-3.5 transition-transform hover:scale-105">
              <JidoSappIcon className="w-full h-full" />
            </div>

            {/* Pulse Indicator */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-zinc-950 text-white text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-ping" />
              <span>JidoSapp Core</span>
            </div>
          </div>
        </div>

        {/* 14 High-Fidelity Integrations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:border-[#2563eb]/40 hover:shadow-[0_10px_25px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-200"
            >
              {item.popular && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#2563eb]" title="Popular Integration" />
              )}
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-2 mb-2.5 group-hover:scale-110 transition-transform">
                {item.logo}
              </div>
              <span className="font-semibold text-xs sm:text-sm text-zinc-900 tracking-tight text-center">
                {item.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium text-center line-clamp-1">
                {item.category}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Fast Integration Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563eb]">
              <WebhookLogo className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">
                Need a custom proprietary integration?
              </p>
              <p className="text-[11px] text-zinc-500 font-normal">
                Connect your in-house database or ERP via our high-speed Webhook and REST API.
              </p>
            </div>
          </div>
          <Link
            href="/request-integration"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs shrink-0"
          >
            <span>Request Integration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
