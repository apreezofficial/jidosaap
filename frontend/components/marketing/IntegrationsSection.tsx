import React from "react";

export function IntegrationsSection() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
          Integrations
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Connect integrations you use every day
        </h2>
      </div>

      {/* Brand Center Icon with Guide Lines */}
      <div className="relative max-w-4xl mx-auto py-6">
        <div className="w-16 h-16 rounded-[22px] bg-white border border-zinc-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-10">
          <div className="grid grid-cols-2 gap-1.5 w-6 h-6 items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900"></span>
          </div>
        </div>

        {/* Staggered Floating Squircles Row 1 */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-indigo-600 font-mono">Penna</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-emerald-600">WhatsApp</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 border border-blue-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-[#0284c7]">Meta API</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-50 border border-rose-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-rose-600">Slack</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-amber-600">Gmail</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-50 border border-purple-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-purple-600">Figma</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-50 border border-sky-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-sky-600">Notion</span>
          </div>
        </div>

        {/* Staggered Floating Squircles Row 2 */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-violet-600">Stripe</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-zinc-900">OpenAI</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-teal-600">Zendesk</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-orange-500">HubSpot</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-zinc-800">Cal.com</span>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
            <span className="font-bold text-sm sm:text-base text-blue-700">Webhook</span>
          </div>
        </div>
      </div>
    </section>
  );
}
