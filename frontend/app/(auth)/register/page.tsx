"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Server } from "lucide-react";

export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect users to request integration
    router.replace("/request-integration");
  }, [router]);

  return (
    <div className="space-y-6 text-center py-6">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563eb] border border-blue-200/80 flex items-center justify-center mx-auto shadow-2xs">
        <Server className="h-6 w-6" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          Integrations Are Request-Only
        </h1>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
          Every client receives a dedicated WhatsApp Business Cloud API instance and custom subdomain on <code className="font-mono font-bold text-zinc-800">jidosaap.xyz</code>.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/request-integration">
          <button className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-all">
            <span>Continue to Request Integration</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
