import React from "react";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="max-w-5xl mx-auto px-6">
      <div className="rounded-[32px] bg-zinc-950 p-10 sm:p-16 text-center text-white space-y-8 relative overflow-hidden border border-zinc-800">
        <div className="space-y-4 max-w-2xl mx-auto relative">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to give your WhatsApp superpowers?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Claim your custom subdomain on <code className="text-white font-mono font-bold">jidosaap.xyz</code> and let us configure your dedicated WhatsApp Business Cloud API instance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative">
          <Link href="/request-integration">
            <button className="h-12 px-8 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-sm shadow-[0_8px_20px_rgba(37,99,235,0.28)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.36)] transition-all hover:-translate-y-0.5">
              Request Your Integration &amp; Subdomain
            </button>
          </Link>
          <Link href="/register">
            <button className="h-12 px-8 rounded-xl bg-transparent border border-zinc-700 hover:bg-zinc-900 text-white font-medium text-sm transition-all">
              Self-Service Sign Up
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
