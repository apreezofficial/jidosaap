"use client";

import React from "react";

export function BentoGridSection() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bento Card 1: Seamless Collaboration / Penna.dev Status Bridge */}
        <div className="rounded-[28px] border border-zinc-200/90 bg-white p-8 sm:p-10 space-y-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-44 bg-[#fafafa] rounded-2xl border border-zinc-100 p-4 flex flex-col justify-center relative overflow-hidden">
            <div className="bg-white rounded-xl border border-zinc-200 p-3 shadow-md w-fit max-w-[280px] space-y-1 -rotate-2">
              <div className="text-[10px] font-bold text-indigo-600">penna.dev status bridge</div>
              <div className="text-xs font-bold text-zinc-900 truncate">User Experience: the gateway...</div>
              <div className="text-[10px] text-zinc-400">1-Tap published directly to status</div>
            </div>
          </div>
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold text-zinc-950">Seamless Newsletter Publishing</h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Precious publishes on penna.dev and with a single tap, JidoSapp bridges the formatted update and tracked link to WhatsApp Status.
            </p>
          </div>
        </div>

        {/* Bento Card 2: Time Management Tools / Shola 7 AM Drops */}
        <div className="rounded-[28px] border border-zinc-200/90 bg-white p-8 sm:p-10 space-y-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-44 bg-[#fafafa] rounded-2xl border border-zinc-100 p-4 flex items-center justify-around relative overflow-hidden">
            <div className="text-center space-y-1">
              <div className="text-xl font-extrabold text-[#0284c7] font-mono">07:00 AM</div>
              <div className="text-[10px] text-zinc-400">Daily Cron Drop</div>
            </div>
            <div className="h-20 w-px bg-zinc-200"></div>
            <div className="text-center space-y-1">
              <div className="text-xl font-extrabold text-emerald-600 font-mono">+340%</div>
              <div className="text-[10px] text-zinc-400">Client Inquiries</div>
            </div>
          </div>
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold text-zinc-950">Consistency &amp; Schedule Engines</h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Optimize your workflow with scheduled morning drops. Shola queues his designs in advance, ensuring daily client visibility without waking up early.
            </p>
          </div>
        </div>

        {/* Bento Card 3: Advanced Lead Tracking & 24/7 Auto-Responder */}
        <div className="rounded-[28px] border border-zinc-200/90 bg-white p-8 sm:p-10 space-y-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-44 bg-[#fafafa] rounded-2xl border border-zinc-100 p-4 flex flex-col justify-center space-y-2 relative overflow-hidden text-left">
            <div className="bg-white p-2.5 rounded-xl border border-zinc-200 shadow-sm text-xs space-y-0.5">
              <span className="text-[10px] font-bold text-rose-600">Client Inquiry (02:14 AM)</span>
              <p className="text-[11px] text-zinc-700">"What are your retainer rates?"</p>
            </div>
            <div className="bg-[#2563eb] text-white p-2.5 rounded-xl shadow-sm text-xs space-y-0.5">
              <span className="text-[10px] font-bold text-blue-200">Auto-Responder (02:14 AM)</span>
              <p className="text-[11px]">"Our retainers start at $1,800/mo. Here is our booking link..."</p>
            </div>
          </div>
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold text-zinc-950">24/7 Zero-Latency Auto-Responder</h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Never leave potential clients on "read". Automatically answer pricing questions, send booking links, and capture qualified leads into CRM.
            </p>
          </div>
        </div>

        {/* Bento Card 4: Customizable Workspaces on *.jidosaap.xyz (Dashed Border) */}
        <div className="rounded-[28px] border-2 border-dashed border-zinc-300 bg-[#fafafa] p-8 sm:p-10 space-y-6 shadow-sm hover:border-zinc-400 transition-colors">
          <div className="h-44 flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-zinc-900 font-bold flex items-center justify-center text-lg shadow-md">
              04:21
            </div>
            <div className="text-xs font-mono font-bold text-zinc-800 bg-white border border-zinc-200 px-3 py-1 rounded-xl shadow-xs">
              https://yourbrand.jidosaap.xyz
            </div>
          </div>
          <div className="space-y-2 text-left">
            <h3 className="text-xl font-bold text-zinc-950">Dedicated Isolated Subdomains</h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
              Every client gets their own dedicated <code className="font-mono font-bold text-zinc-900">*.jidosaap.xyz</code> subdomain with an isolated WhatsApp Cloud API instance.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs font-medium text-zinc-400">
        and a lot more superpowers...
      </div>
    </section>
  );
}
