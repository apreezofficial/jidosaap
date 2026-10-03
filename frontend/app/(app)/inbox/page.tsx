"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  Bot,
  User,
  MessageSquare,
  CheckCircle2,
  Clock,
  Filter,
  MoreVertical,
  Send,
  RefreshCw,
  UserCheck,
  AlertCircle,
  Phone,
  Mail,
  Building2,
  Inbox,
  ShieldCheck,
  CheckCheck,
  Paperclip,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Radio,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOutbound: boolean;
  isBot?: boolean;
  latency?: string;
  status?: "read" | "delivered" | "sent";
  attachment?: { title: string; link: string; type: string };
}

interface ChatContact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  tag: string;
  tagColor: string;
  mode: "autonomous" | "human";
  messages: Message[];
}

const INITIAL_CHATS: ChatContact[] = [
  {
    id: "chat-1",
    name: "Alex Rivera",
    phone: "+1 (415) 890-2311",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    unread: 0,
    lastMessage: "Our retainers start at $1,800/mo. Here is our booking link...",
    lastTime: "02:14 AM",
    tag: "Retainer Lead ($1,800/mo)",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    mode: "autonomous",
    messages: [
      {
        id: "m-1",
        sender: "Alex Rivera",
        text: "Hey! What are your retainer rates for ongoing product design & WhatsApp automation?",
        time: "02:14 AM",
        isOutbound: false,
      },
      {
        id: "m-2",
        sender: "Jido Autonomous Bot",
        text: "Hey Alex! Our design & automation retainers start at $1,800/mo. We have 2 client sprint slots opening next week. Here is our booking link to pick a 15-min discovery time: https://cal.com/onos/15min",
        time: "02:14 AM",
        isOutbound: true,
        isBot: true,
        latency: "1.2s",
        status: "read",
        attachment: {
          title: "Cal.com Discovery Call • 15 Minutes",
          link: "https://cal.com/onos/15min",
          type: "BOOKING",
        },
      },
      {
        id: "m-3",
        sender: "Alex Rivera",
        text: "Awesome, just booked for Thursday 2 PM. Looking forward!",
        time: "02:16 AM",
        isOutbound: false,
      },
    ],
  },
  {
    id: "chat-2",
    name: "Precious O.",
    phone: "+234 810 992 0184",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    unread: 1,
    lastMessage: "Bridged Issue #48 to WhatsApp Status with tracked read link.",
    lastTime: "06:12 AM",
    tag: "Newsletter Reader",
    tagColor: "bg-blue-50 text-[#2563eb] border-blue-200",
    mode: "autonomous",
    messages: [
      {
        id: "m-4",
        sender: "Precious O.",
        text: "Just published a new essay on penna.dev! Can JidoSapp bridge the story card to WhatsApp Status?",
        time: "06:11 AM",
        isOutbound: false,
      },
      {
        id: "m-5",
        sender: "Jido Autonomous Bot",
        text: 'Bridge completed! 9:16 WhatsApp Status Card generated for "The Architecture of Clean APIs" with tracked link: precious.jidosaap.xyz/read/48',
        time: "06:12 AM",
        isOutbound: true,
        isBot: true,
        latency: "1.8s",
        status: "read",
        attachment: {
          title: "The Architecture of Clean APIs (penna.dev)",
          link: "https://precious.jidosaap.xyz/read/48",
          type: "STATUS_CARD",
        },
      },
    ],
  },
  {
    id: "chat-3",
    name: "Designers Guild Community",
    phone: "Group ID: 1203630291",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    unread: 0,
    lastMessage: "🛡️ Group Shield purged unauthorized crypto link. Strike 1 issued.",
    lastTime: "04:30 AM",
    tag: "Group Shield Protected",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    mode: "autonomous",
    messages: [
      {
        id: "m-6",
        sender: "Unknown User (+1 917...)",
        text: "Join fast pump signal group t.me/freecrypto1000x guaranteed gains!!",
        time: "04:30 AM",
        isOutbound: false,
      },
      {
        id: "m-7",
        sender: "Jido Group Sentinel",
        text: "🛡️ [Group Shield] Message deleted. Unauthorized external invite links are prohibited. User muted for 24 hours (Strike 1/3).",
        time: "04:30 AM",
        isOutbound: true,
        isBot: true,
        latency: "0.8s",
        status: "read",
      },
    ],
  },
  {
    id: "chat-4",
    name: "Shola Visuals",
    phone: "+234 802 334 9102",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
    unread: 0,
    lastMessage: "The 7:00 AM drops brought 4 new client inquiries this morning!",
    lastTime: "07:30 AM",
    tag: "7 AM Drops Subscriber",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
    mode: "human",
    messages: [
      {
        id: "m-8",
        sender: "Shola Visuals",
        text: "The 7:00 AM drops brought 4 new client inquiries this morning! Loving the consistency engine.",
        time: "07:30 AM",
        isOutbound: false,
      },
      {
        id: "m-9",
        sender: "Onos E.",
        text: "That's huge! The morning drops reach clients right when they check WhatsApp over coffee.",
        time: "07:32 AM",
        isOutbound: true,
        status: "read",
      },
    ],
  },
];

export default function WhatsAppInboxPage() {
  const [chats, setChats] = useState<ChatContact[]>(INITIAL_CHATS);
  const [selectedId, setSelectedId] = useState<string>("chat-1");
  const [search, setSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const selectedChat = chats.find((c) => c.id === selectedId) || chats[0];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || messageInput;
    if (!text.trim() || !selectedChat) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "Onos E.",
      text: text.trim(),
      time: "Just now",
      isOutbound: true,
      status: "sent",
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedChat.id
          ? {
              ...c,
              lastMessage: text.trim(),
              lastTime: "Just now",
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );

    if (!textToSend) setMessageInput("");
  };

  const toggleMode = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, mode: c.mode === "autonomous" ? "human" : "autonomous" }
          : c
      )
    );
  };

  const filteredChats = chats.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-4 sm:-m-6 lg:-m-8 overflow-hidden bg-white select-none font-sans">
      {/* ─── LEFT: WhatsApp Contacts List ─── */}
      <div className="w-80 sm:w-96 border-r border-zinc-200/90 flex flex-col bg-white shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-zinc-950 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#2563eb]" />
                <span>WhatsApp Inbox</span>
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live API
              </span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:border-[#2563eb] transition-all"
              placeholder="Search chats, phone numbers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Contacts Scroll */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedId(chat.id)}
              className={cn(
                "p-3.5 cursor-pointer transition-all flex items-start gap-3 hover:bg-zinc-50/80",
                selectedChat.id === chat.id ? "bg-blue-50/40 border-l-4 border-l-[#2563eb]" : ""
              )}
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="h-11 w-11 rounded-full object-cover ring-1 ring-zinc-200 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className="text-xs font-bold text-zinc-950 truncate">{chat.name}</p>
                  <span className="text-[10px] text-zinc-400 font-mono shrink-0">{chat.lastTime}</span>
                </div>

                <p className="text-[11px] text-zinc-500 font-mono mb-1">{chat.phone}</p>

                <p className="text-xs text-zinc-600 truncate leading-snug">{chat.lastMessage}</p>

                <div className="flex items-center justify-between mt-2">
                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", chat.tagColor)}>
                    {chat.tag}
                  </span>

                  <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                    {chat.mode === "autonomous" ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                        <Bot className="h-2.5 w-2.5" /> Bot Active
                      </span>
                    ) : (
                      <span className="text-zinc-500 flex items-center gap-0.5">
                        <User className="h-2.5 w-2.5" /> Human
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT: WhatsApp Conversation Area ─── */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5]/40 min-w-0">
        {/* Chat Header */}
        <div className="h-16 border-b border-zinc-200/90 bg-white px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-950">{selectedChat.name}</h3>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  Meta Verified
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">{selectedChat.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleMode(selectedChat.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                selectedChat.mode === "autonomous"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-blue-50 text-[#2563eb] border-blue-200 hover:bg-blue-100"
              )}
            >
              {selectedChat.mode === "autonomous" ? (
                <>
                  <Bot className="h-3.5 w-3.5" />
                  <span>Autonomous Bot Mode (1.2s reply)</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Human Operator Takeover</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-center my-2">
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-zinc-200/80 text-zinc-600">
              End-to-End Encrypted via WhatsApp Cloud API • Isolated Subdomain
            </span>
          </div>

          {selectedChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex flex-col", msg.isOutbound ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "p-3.5 rounded-2xl max-w-[80%] sm:max-w-[70%] shadow-2xs space-y-1.5 relative",
                  msg.isOutbound
                    ? "bg-[#2563eb] text-white rounded-tr-xs"
                    : "bg-white text-zinc-900 border border-zinc-200/80 rounded-tl-xs"
                )}
              >
                {msg.isBot && (
                  <div className="flex items-center gap-1.5 text-[10px] text-cyan-200 font-mono font-bold pb-0.5 border-b border-white/10">
                    <Sparkles className="h-3 w-3" />
                    <span>Auto-Replied in {msg.latency || "1.2s"}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>

                {msg.attachment && (
                  <a
                    href={msg.attachment.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-2.5 rounded-xl bg-black/15 hover:bg-black/25 text-white transition-colors border border-white/20 mt-2"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{msg.attachment.title}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] opacity-80 font-mono">{msg.attachment.link}</span>
                  </a>
                )}

                <div
                  className={cn(
                    "flex items-center justify-end gap-1 text-[10px] pt-1",
                    msg.isOutbound ? "text-blue-100" : "text-zinc-400"
                  )}
                >
                  <span className="font-mono">{msg.time}</span>
                  {msg.isOutbound && <CheckCheck className="h-3.5 w-3.5 text-cyan-300" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Canned Responses Bar */}
        <div className="px-6 py-2 bg-zinc-50 border-t border-zinc-200/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">
            Quick 1-Tap:
          </span>
          <button
            onClick={() =>
              handleSendMessage(
                "Our retainers start at $1,800/mo. Here is our booking link to claim a slot: cal.com/onos/15min"
              )
            }
            className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:border-[#2563eb] text-[11px] font-semibold text-zinc-700 transition-colors shrink-0"
          >
            💵 Send Retainer Rates ($1,800/mo)
          </button>
          <button
            onClick={() =>
              handleSendMessage(
                "Here is our direct booking link for a 15-min discovery call: https://cal.com/onos/15min"
              )
            }
            className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:border-[#2563eb] text-[11px] font-semibold text-zinc-700 transition-colors shrink-0"
          >
            📅 Send Cal.com Link
          </button>
          <button
            onClick={() =>
              handleSendMessage(
                "Read our latest essay bridged from penna.dev: https://onos.jidosaap.xyz/read/48"
              )
            }
            className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 hover:border-[#2563eb] text-[11px] font-semibold text-zinc-700 transition-colors shrink-0"
          >
            📰 Send Status Bridge Link
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-zinc-200/80 flex items-center gap-3">
          <button
            title="Attach Media / Rate Card PDF"
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a WhatsApp reply or trigger automation..."
            className="flex-1 text-xs sm:text-sm bg-zinc-50 border border-zinc-200/90 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#2563eb] transition-all"
          />

          <button
            onClick={() => handleSendMessage()}
            className="h-10 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center gap-1.5 text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
