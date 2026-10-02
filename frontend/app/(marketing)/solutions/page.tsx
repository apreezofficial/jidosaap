"use client";

import React from "react";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  ShieldAlert,
  Bot,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";

export default function SolutionsHubPage() {
  const solutions = [
    {
      title: "1-Tap Newsletter Status Bridge",
      tag: "For Writers & Publishers",
      href: "/solutions/newsletter-bridge",
      icon: Newspaper,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200/80",
      description:
        "Post articles directly from penna.dev, Substack, or your custom CMS straight to WhatsApp Status in a single click with zero manual copy-pasting.",
      metric: "3x More Reads",
    },
    {
      title: "7:00 AM Scheduled Drops",
      tag: "For Designers & Creators",
      href: "/solutions/scheduled-drops",
      icon: Calendar,
      color: "bg-amber-50 text-amber-600 border-amber-200/80",
      description:
        "Build effortless consistency. Schedule your daily portfolio showcases, designs, and broadcast drops to release at 7:00 AM sharp while you sleep.",
      metric: "+85% Retainer Inquiries",
    },
    {
      title: "Group Buddy: Anti-Spam Shield",
      tag: "For Communities & Groups",
      href: "/solutions/group-shield",
      icon: ShieldAlert,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
      description:
        "24/7 automated group moderation. Instantly deletes phishing links, warns bad actors, and enforces auto-kicks on repeat offenders in under 1 second.",
      metric: "99.9% Spam Block Rate",
    },
    {
      title: "24/7 Smart Auto-Responder",
      tag: "For Agencies & Solopreneurs",
      href: "/solutions/auto-responder",
      icon: Bot,
      color: "bg-blue-50 text-blue-600 border-blue-200/80",
      description:
        "Never lose a midnight lead. Deliver rate cards, answers to frequently asked questions, and Cal.com meeting links instantly with zero human latency.",
      metric: "0s Average Latency",
    },
    {
      title: "Dedicated Subdomain Infrastructure",
      tag: "Multi-Tenant Enterprise",
      href: "/solutions/subdomains",
      icon: Globe,
      color: "bg-purple-50 text-purple-600 border-purple-200/80",
      description:
        "Every client gets their own isolated subdomain on jidosaap.xyz with dedicated Webhooks, Meta WhatsApp Cloud API credentials, and zero bot collisions.",
      metric: "100% Tenant Isolation",
    },
  ];

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/90 shadow-xs text-xs font-semibold text-zinc-700">
          <Sparkles className="h-3.5 w-3.5 text-[#2563eb]" />
          <span>Tailored WhatsApp Automations</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Solutions engineered for how you actually work.
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          Explore individual solutions built specifically to solve real bottlenecks for creators, freelance designers, community directors, and growing businesses.
        </p>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {solutions.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl border border-zinc-200/80 bg-white p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-zinc-300 transition-all hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-950 group-hover:text-[#2563eb] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {item.metric}
                </span>
                <span className="text-xs font-semibold text-[#2563eb] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-[32px] bg-zinc-950 p-10 sm:p-14 text-center text-white space-y-6 max-w-5xl mx-auto border border-zinc-800">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Want a custom WhatsApp solution for your business?
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          We provision a dedicated instance and custom subdomain on <code className="text-white font-mono">jidosaap.xyz</code> tailored to your exact workflow.
        </p>
        <div>
          <Link href="/request-integration">
            <button className="h-11 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
              Request Demo &amp; Subdomain
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
