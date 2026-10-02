"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 15,
      yearlyPrice: 12, // $144/year
      description: "Essential WhatsApp automation for solopreneurs & small businesses.",
      features: [
        "1 Official WhatsApp Connection",
        "1,000 Messages / month",
        "1 AI Customer Service Agent",
        "5 Active Automations",
        "Basic CRM Pipeline",
        "Community Support",
      ],
      cta: "Start 14-Day Trial",
      popular: false,
    },
    {
      name: "Business",
      monthlyPrice: 39,
      yearlyPrice: 31,
      description: "Complete AI intelligence and API automations for growing teams.",
      features: [
        "2 Official WhatsApp Connections",
        "5,000 Messages / month",
        "3 AI Agents with Custom Tone",
        "Unlimited Automations",
        "External API Connectors & AI Transformers",
        "Knowledge Base (up to 20 documents)",
        "Standard Support",
      ],
      cta: "Get Business Plan",
      popular: true,
    },
    {
      name: "Pro",
      monthlyPrice: 99,
      yearlyPrice: 79,
      description: "High-volume operations with team collaboration and vector search.",
      features: [
        "5 Official WhatsApp Connections",
        "25,000 Messages / month",
        "10 AI Agents with Tool Calling",
        "Unlimited Automations & API Recipes",
        "Full Knowledge Base & Vector Embeddings",
        "Team Members & Role-Based Access",
        "Priority Support & Webhook SLA",
      ],
      cta: "Scale with Pro",
      popular: false,
    },
    {
      name: "Agency",
      monthlyPrice: 249,
      yearlyPrice: 199,
      description: "Multi-client architecture and enterprise performance.",
      features: [
        "Unlimited WhatsApp Connections",
        "100,000+ Messages / month",
        "Unlimited AI Agents & Knowledge Bases",
        "Custom API Integrations & Webhooks",
        "Dedicated Queue Worker Isolation",
        "Custom Billing & Multi-workspace Admin",
        "Dedicated Account Executive",
      ],
      cta: "Contact Enterprise",
      popular: false,
    },
  ];

  return (
    <div className="py-16 px-6 lg:px-12 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          <span>Your WhatsApp Can Do More Than You Think</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950">
          Simple, Transparent Pricing
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          Every plan includes your dedicated <code className="font-mono font-bold text-zinc-900">*.jidosaap.xyz</code> subdomain, official Meta WhatsApp Cloud API connection, and automated bridge engine.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-zinc-900" : "text-zinc-400"}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative h-6 w-11 rounded-full bg-zinc-200 transition-colors focus:outline-none p-0.5"
          >
            <span
              className={`block h-5 w-5 rounded-full bg-rose-600 transition-transform ${
                billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold ${billingCycle === "yearly" ? "text-zinc-900" : "text-zinc-400"}`}>
              Annual Billing
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          return (
            <div
              key={plan.name}
              className={`rounded-2xl border bg-white p-6 flex flex-col justify-between transition-all ${
                plan.popular
                  ? "border-rose-600 ring-2 ring-rose-600 shadow-lg relative"
                  : "border-zinc-200 shadow-xs hover:border-zinc-300"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-bold tracking-wider uppercase">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">{plan.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 border-b border-zinc-100 pb-4">
                  <span className="text-3xl font-extrabold text-zinc-950">${price}</span>
                  <span className="text-xs text-zinc-500 font-medium">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-600 pt-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Link href="/register">
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full text-xs font-semibold"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto pt-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-zinc-900">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-1">
            <h4 className="font-semibold text-zinc-900">Do you support unofficial WhatsApp web sessions?</h4>
            <p className="text-zinc-600">
              No. JidoSapp strictly uses the official Meta WhatsApp Business Platform / Cloud API. This ensures guaranteed uptime, prevents account bans, and provides real message delivery receipts.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-1">
            <h4 className="font-semibold text-zinc-900">Can I bring my own OpenAI API key?</h4>
            <p className="text-zinc-600">
              Yes. Workspace admins can configure custom OpenAI API credentials in the AI settings panel or use JidoSapp&apos;s managed credits.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-1">
            <h4 className="font-semibold text-zinc-900">Can multiple team members manage the inbox?</h4>
            <p className="text-zinc-600">
              Yes. JidoSapp provides multi-tenant team access with Owner, Admin, Member, and Viewer roles, allowing your sales and support agents to collaborate seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
