import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Column: Form */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-sm relative">
              <span className="font-serif">自</span>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
            </div>
            <span className="font-bold text-base tracking-tight text-zinc-900">
              JidoSapp
            </span>
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto my-8">{children}</div>

        <div className="text-xs text-zinc-400">
          © {new Date().getFullYear()} JidoSapp Inc. Put WhatsApp on Autopilot.
        </div>
      </div>

      {/* Right Column: Hero Visual & Value Proposition */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-16 text-white relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20">
            Enterprise WhatsApp Automation
          </span>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Put your business WhatsApp on autopilot with official Meta API & AI intelligence.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Connect your official Meta WhatsApp Business Cloud account, automate customer support, sync with external APIs, schedule broadcasts, and qualify leads into your CRM pipeline without unofficial hacks.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-zinc-500 border-t border-zinc-800/80 pt-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span>Official Meta Cloud API</span>
          </div>
          <span>•</span>
          <div>Argon2id & AES-256-GCM Secure</div>
          <span>•</span>
          <div>Multi-tenant Isolation</div>
        </div>
      </div>
    </div>
  );
}
