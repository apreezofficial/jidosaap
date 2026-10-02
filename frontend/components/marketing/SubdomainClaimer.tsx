"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function SubdomainClaimer() {
  const [subdomainQuery, setSubdomainQuery] = useState("");
  const [checkStatus, setCheckStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [checkMessage, setCheckMessage] = useState("");

  const handleCheckSubdomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = subdomainQuery.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!clean || clean.length < 3) {
      setCheckStatus("taken");
      setCheckMessage("Subdomain must be at least 3 characters");
      return;
    }
    setCheckStatus("checking");
    setTimeout(() => {
      const reserved = ["api", "admin", "www", "app", "root"];
      if (reserved.includes(clean)) {
        setCheckStatus("taken");
        setCheckMessage(`${clean}.jidosaap.xyz is reserved by system.`);
      } else {
        setCheckStatus("available");
        setCheckMessage(`Available! Your dedicated instance will live at ${clean}.jidosaap.xyz`);
      }
    }, 350);
  };

  return (
    <section id="subdomains" className="max-w-2xl mx-auto px-6 text-center space-y-4">
      <div className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
        Every Client Gets Their Own Dedicated Subdomain
      </div>

      <form onSubmit={handleCheckSubdomain} className="bg-white border-2 border-zinc-900 rounded-2xl p-1.5 shadow-xl flex flex-col sm:flex-row items-center gap-2">
        <div className="flex-1 flex items-center px-3 w-full">
          <span className="text-xs font-semibold text-zinc-400 mr-1">https://</span>
          <input
            type="text"
            placeholder="precious, shola, michael, or yourbrand"
            value={subdomainQuery}
            onChange={(e) => {
              setSubdomainQuery(e.target.value);
              setCheckStatus("idle");
            }}
            className="w-full text-sm font-semibold text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
          />
          <span className="text-xs font-bold text-[#0284c7] font-mono bg-sky-50 px-2 py-0.5 rounded">.jidosaap.xyz</span>
        </div>
        <Button type="submit" size="sm" className="w-full sm:w-auto px-6 h-10 bg-zinc-950 hover:bg-zinc-800 text-white font-medium shrink-0">
          Claim Subdomain
        </Button>
      </form>

      {checkStatus !== "idle" && (
        <div className={`text-xs flex items-center justify-center gap-1.5 font-medium ${checkStatus === "available" ? "text-emerald-600" : checkStatus === "checking" ? "text-zinc-500" : "text-rose-600"}`}>
          {checkStatus === "checking" && <span>Checking availability on jidosaap.xyz…</span>}
          {checkStatus === "available" && (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{checkMessage}</span>
              <Link href={`/request-integration?subdomain=${subdomainQuery}`} className="ml-2 font-bold underline text-emerald-700">
                Provision Account &rarr;
              </Link>
            </>
          )}
          {checkStatus === "taken" && (
            <>
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>{checkMessage}</span>
            </>
          )}
        </div>
      )}
    </section>
  );
}
