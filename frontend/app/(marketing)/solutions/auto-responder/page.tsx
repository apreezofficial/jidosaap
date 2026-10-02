"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

export default function AutoResponderPage() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    {
      sender: "user",
      text: "Hey! What are your rates for a 3-month brand design retainer?",
      time: "02:14 AM",
    },
    {
      sender: "bot",
      text: "Hi there! 👋 Thanks for reaching out to Studio Craft. Our monthly retainers start at $1,800/mo and include unlimited requests. Would you like to view our portfolio or book a 15-min discovery call?",
      time: "02:14 AM",
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setInputVal("");
    const newMsg = { sender: "user" as const, text: userText, time: "Just now" };
    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      let botReply = "Got it! Here is our calendar link to choose a time that fits you: cal.com/jidosaap-demo. Looking forward to connecting!";
      if (userText.toLowerCase().includes("portfolio") || userText.toLowerCase().includes("work")) {
        botReply = "You can view our latest case studies and client projects at penna.dev/apcodesphere or jidosaap.xyz. Let me know which style catches your eye!";
      } else if (userText.toLowerCase().includes("discount") || userText.toLowerCase().includes("cheap")) {
        botReply = "We offer a 15% discount for upfront quarterly commitments! Would you like me to send over our detailed pricing deck?";
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply, time: "Just now" },
      ]);
    }, 450);
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-24">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-[#2563eb]">
          <Bot className="h-3.5 w-3.5" />
          <span>24/7 AI Customer Conversations</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-tight">
          Never let a high-intent lead wait until morning.
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          Over 64% of potential clients contact businesses outside standard office hours. JidoSapp's intelligent auto-responder answers instantly, qualifies the prospect, shares your pricing deck, and books calendar calls on autopilot.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/request-integration?use_case=auto_responder">
              <button className="h-11 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
                Request Demo
              </button>
            </Link>
            <Link href="/pricing">
              <button className="h-11 px-5 rounded-xl bg-white border border-zinc-200/80 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-xs transition-all">
                Explore Pro Plan ($39/mo)
              </button>
            </Link>
          </div>
        </div>

      {/* Interactive Chat Simulator */}
      <div className="rounded-[32px] border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-xs max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Auto-Responder Assistant</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active 24/7 • Response latency &lt; 500ms</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">02:14 AM Local Time</span>
        </div>

        {/* Message Thread */}
        <div className="space-y-4 min-h-[260px] max-h-[380px] overflow-y-auto p-4 bg-zinc-50/80 rounded-2xl border border-zinc-200/60">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#2563eb] text-white rounded-br-xs shadow-xs"
                    : "bg-white text-zinc-800 rounded-bl-xs border border-zinc-200/80 shadow-xs"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Send Input */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type: 'Can I see your portfolio?' or 'Book call'..."
            className="flex-1 h-11 px-4 rounded-xl border border-zinc-200/90 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
          />
          <button
            type="submit"
            className="h-11 px-5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
            01
          </div>
          <h4 className="text-base font-bold text-zinc-950">Contextual Knowledge</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Upload your rate card, service packages, FAQs, and portfolio links. The bot replies with 100% accuracy.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
            02
          </div>
          <h4 className="text-base font-bold text-zinc-950">Cal.com &amp; Calendly Integration</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Automatically sends your live availability link as soon as a prospective lead asks for a meeting.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
            03
          </div>
          <h4 className="text-base font-bold text-zinc-950">Zero Human Takeover Friction</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Jump in at any time from your phone. JidoSapp pauses automated replies whenever you personally type.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-[32px] bg-zinc-950 p-10 sm:p-14 text-center text-white space-y-6 max-w-5xl mx-auto border border-zinc-800">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Capture client retainers while you sleep
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Provision your 24/7 smart assistant on your dedicated subdomain today.
        </p>
        <Link href="/request-integration">
          <button className="h-11 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all">
            Request Auto-Responder Integration
          </button>
        </Link>
      </div>
    </div>
  );
}
