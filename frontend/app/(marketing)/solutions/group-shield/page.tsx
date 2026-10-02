"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  CheckCircle2,
  RotateCcw,
  Zap,
} from "lucide-react";

export default function GroupShieldPage() {
  const [spamCount, setSpamCount] = useState(0);
  const [logs, setLogs] = useState<Array<{ id: number; text: string; type: "normal" | "warning" | "kicked" }>>([
    { id: 1, text: "Sarah: Has anyone reviewed the new React 19 documentation?", type: "normal" },
    { id: 2, text: "David: Yes! Server actions are much simpler now.", type: "normal" },
  ]);

  const handleSimulateSpam = () => {
    const next = spamCount + 1;
    setSpamCount(next);

    if (next === 1) {
      setLogs((prev) => [
        ...prev,
        { id: Date.now(), text: "ScamBot: 🚨 FREE CRYPTO AIRDROP! Claim at http://scam-airdrop.xyz/bonus", type: "warning" },
        { id: Date.now() + 1, text: "🛡️ JidoSapp Sentinel: Link deleted. Strike 1/2 issued to ScamBot.", type: "warning" },
      ]);
    } else if (next === 2) {
      setLogs((prev) => [
        ...prev,
        { id: Date.now(), text: "ScamBot: 🚨 Guaranteed 200x returns register now: http://pump-token.io", type: "warning" },
        { id: Date.now() + 1, text: "🚨 JidoSapp Sentinel: Repeat spam violation. ScamBot has been REMOVED from group.", type: "kicked" },
      ]);
    } else {
      setSpamCount(0);
      setLogs([
        { id: 1, text: "Sarah: Has anyone reviewed the new React 19 documentation?", type: "normal" },
        { id: 2, text: "David: Yes! Server actions are much simpler now.", type: "normal" },
      ]);
    }
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-24">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-700">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Automated Group Moderation &amp; Anti-Spam</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Protect your WhatsApp Groups 24/7. Zero manual policing.
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          Running developer groups, masterminds, or customer communities shouldn't mean staying awake 24/7 to delete phishing links. JidoSapp deletes spam in milliseconds, issues warning strikes, and kicks malicious bots automatically.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/request-integration">
            <button className="h-11 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
              Protect Your Community
            </button>
          </Link>
          <Link href="/pricing">
            <button className="h-11 px-5 rounded-xl bg-white border border-zinc-200/80 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-xs transition-all">
              View Plans ($15/mo)
            </button>
          </Link>
        </div>
      </div>

      {/* Interactive Live Demo */}
      <div className="rounded-[32px] border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-bold text-zinc-900">Michael's Tech Community (3,280 Members)</h3>
          </div>
          <button
            onClick={handleSimulateSpam}
            className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>
              {spamCount === 0
                ? "Simulate Spam Attack"
                : spamCount === 1
                ? "Simulate 2nd Spam Violation (Auto-Kick)"
                : "Reset Simulator"}
            </span>
          </button>
        </div>

        {/* Chat Feed */}
        <div className="bg-zinc-950 rounded-2xl p-5 font-mono text-xs space-y-3 min-h-[260px] max-h-[360px] overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg transition-all ${
                log.type === "warning"
                  ? "bg-amber-950/40 text-amber-300 border border-amber-800/50"
                  : log.type === "kicked"
                  ? "bg-rose-950/50 text-rose-300 border border-rose-800/60 font-bold"
                  : "bg-zinc-900/60 text-zinc-300 border border-zinc-800/40"
              }`}
            >
              {log.text}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <ShieldCheck className="h-4 w-4" /> Sentinel Active: Zero human admin delay
          </span>
          <span className="font-mono">Strike Threshold: 2 Strikes = Auto-Kick</span>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">
            01
          </div>
          <h4 className="text-base font-bold text-zinc-950">Intelligent Link Scanner</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Detects suspicious domains, shortened scam URLs, and crypto airdrop patterns in under 120 milliseconds.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">
            02
          </div>
          <h4 className="text-base font-bold text-zinc-950">Customizable Strike Policy</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Choose whether bad actors receive a warning DM, a temporary mute, or an immediate permanent group expulsion.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">
            03
          </div>
          <h4 className="text-base font-bold text-zinc-950">Multi-Group Coordination</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Protect 1 group or 50 groups simultaneously. When a scam bot is flagged in one room, it's blacklisted everywhere.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-[32px] bg-zinc-950 p-10 sm:p-14 text-center text-white space-y-6 max-w-5xl mx-auto border border-zinc-800">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Keep your community safe and spam-free
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Provision your dedicated sentinel on <code className="text-white font-mono">jidosaap.xyz</code> today.
        </p>
        <Link href="/request-integration">
          <button className="h-11 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
            Request Group Sentinel Integration
          </button>
        </Link>
      </div>
    </div>
  );
}
