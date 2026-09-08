"use client";

import React, { useState } from "react";
import { useConversations, useConversation } from "@/hooks/useConversations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime, initials } from "@/lib/utils";
import {
  Search, Bot, User, MessageSquare, CheckCircle2, Clock,
  Filter, MoreVertical, Send, RefreshCw, UserCheck, AlertCircle,
  ChevronRight, Phone, Mail, Building2, Inbox,
} from "lucide-react";
import { api } from "@/lib/api";

const STATUS_COLORS = {
  open: "success",
  resolved: "secondary",
  pending: "warning",
} as const;

const HANDLER_ICONS = {
  ai: <Bot className="h-3 w-3 text-rose-500" />,
  human: <User className="h-3 w-3 text-blue-500" />,
  hybrid: <UserCheck className="h-3 w-3 text-amber-500" />,
};

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [modeFilter, setModeFilter] = useState<string>("");
  const [messageInput, setMessageInput] = useState("");

  const { conversations, loading, refetch } = useConversations({
    search: search || undefined,
    status: statusFilter || undefined,
    handler_mode: modeFilter || undefined,
  });

  const {
    conversation,
    messages,
    loading: msgLoading,
    sending,
    sendMessage,
    handoff,
    updateStatus,
  } = useConversation(selectedId ?? "");

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedId) return;
    await sendMessage(messageInput.trim());
    setMessageInput("");
    refetch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full -m-8 overflow-hidden">
      {/* ─── Conversation List ─────────────────────────── */}
      <div className="w-80 border-r border-zinc-200 flex flex-col bg-white shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Inbox
            </h2>
            <button onClick={() => refetch()} className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              className="w-full h-8 pl-8 pr-3 text-xs rounded-md border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-zinc-50"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {["", "open", "resolved", "pending"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-2 py-1 text-[10px] rounded-full font-medium border transition-colors",
                  statusFilter === s
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                )}
              >
                {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-zinc-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-100 rounded w-2/3" />
                    <div className="h-2.5 bg-zinc-100 rounded w-full" />
                  </div>
                </div>
              </div>
            ))
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs text-zinc-400">No conversations yet</p>
              <p className="text-[10px] text-zinc-300 mt-1">Messages from WhatsApp will appear here</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={cn(
                  "w-full text-left p-4 hover:bg-zinc-50 transition-colors",
                  selectedId === conv.id && "bg-rose-50/60 border-r-2 border-rose-500"
                )}
              >
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {initials(conv.contact_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-zinc-900 truncate">{conv.contact_name}</span>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        {conv.last_message_at ? formatRelativeTime(conv.last_message_at) : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {HANDLER_ICONS[conv.handler_mode]}
                      <p className="text-[11px] text-zinc-500 truncate flex-1">
                        {conv.last_message_content || conv.contact_phone}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="ml-1 flex items-center justify-center h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant={STATUS_COLORS[conv.status as keyof typeof STATUS_COLORS] || "secondary"}>
                        {conv.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ─── Conversation Thread ────────────────────────── */}
      {selectedId && conversation ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Thread header */}
          <div className="px-6 py-3 border-b border-zinc-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                {initials(conversation.contact_name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">{conversation.contact_name}</p>
                <p className="text-xs text-zinc-400">{conversation.contact_phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Handler mode toggle */}
              <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1">
                {(["ai", "human", "hybrid"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handoff(mode)}
                    className={cn(
                      "px-2 py-1 text-[10px] rounded-md font-medium transition-colors",
                      conversation.handler_mode === mode
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-700"
                    )}
                  >
                    {mode === "ai" ? "🤖 AI" : mode === "human" ? "👤 Human" : "🔀 Hybrid"}
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus("resolved")}
                className="text-xs gap-1"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Resolve
              </Button>
            </div>
          </div>

          {/* Handler indicator */}
          <div className={cn(
            "px-4 py-1.5 text-[11px] font-medium flex items-center gap-1.5",
            conversation.handler_mode === "ai"
              ? "bg-rose-50 text-rose-700 border-b border-rose-100"
              : conversation.handler_mode === "human"
              ? "bg-blue-50 text-blue-700 border-b border-blue-100"
              : "bg-amber-50 text-amber-700 border-b border-amber-100"
          )}>
            {HANDLER_ICONS[conversation.handler_mode]}
            {conversation.handler_mode === "ai" && "🤖 AI is handling this conversation"}
            {conversation.handler_mode === "human" && "👤 Human agent is handling this conversation"}
            {conversation.handler_mode === "hybrid" && "🔀 Hybrid mode — AI + human collaboration"}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
            {msgLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">No messages yet</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.direction === "outbound" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.direction === "inbound" && (
                    <div className="h-7 w-7 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-600 mr-2 shrink-0 mt-1">
                      {initials(conversation.contact_name)}
                    </div>
                  )}
                  <div className={cn(
                    "max-w-xs lg:max-w-md rounded-2xl px-3.5 py-2.5 shadow-sm",
                    msg.direction === "outbound"
                      ? "bg-rose-600 text-white rounded-tr-sm"
                      : msg.type === "note"
                      ? "bg-amber-50 text-amber-900 border border-amber-200 rounded-tl-sm"
                      : "bg-white text-zinc-900 border border-zinc-100 rounded-tl-sm"
                  )}>
                    {msg.type === "note" && (
                      <p className="text-[9px] font-semibold text-amber-600 uppercase mb-1">Internal Note</p>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <div className={cn(
                      "flex items-center justify-end gap-1 mt-1",
                      msg.direction === "outbound" ? "text-rose-200" : "text-zinc-400"
                    )}>
                      <span className="text-[9px]">{formatRelativeTime(msg.created_at)}</span>
                      {msg.direction === "outbound" && (
                        <span className="text-[9px]">
                          {msg.status === "read" ? "✓✓" : msg.status === "delivered" ? "✓✓" : msg.status === "sent" ? "✓" : msg.status === "failed" ? "✗" : "⏳"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-zinc-100 bg-white">
            {conversation.handler_mode === "ai" && (
              <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
                <Bot className="h-3.5 w-3.5 text-rose-500" />
                <span>AI is handling this. Switch to Human to reply manually.</span>
              </div>
            )}
            <div className="flex gap-2">
              <textarea
                className="flex-1 resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 min-h-[40px] max-h-32"
                placeholder={conversation.handler_mode === "ai" ? "AI is handling this conversation…" : "Type a message…"}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={conversation.handler_mode === "ai"}
                rows={1}
              />
              <Button
                onClick={handleSend}
                isLoading={sending}
                disabled={!messageInput.trim() || conversation.handler_mode === "ai"}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/40">
          <div className="text-center">
            <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-zinc-300" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-1">Select a conversation</h3>
            <p className="text-xs text-zinc-400 max-w-xs">
              Choose a conversation from the left to view messages and respond.
            </p>
          </div>
        </div>
      )}

      {/* ─── Contact Panel ──────────────────────────────── */}
      {selectedId && conversation && (
        <div className="w-64 border-l border-zinc-200 bg-white p-4 overflow-y-auto shrink-0">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">
                {initials(conversation.contact_name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">{conversation.contact_name}</p>
                <Badge variant="secondary">{conversation.contact_status || "active"}</Badge>
              </div>
            </div>
            <div className="space-y-2 pt-1 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <Phone className="h-3.5 w-3.5 text-zinc-400" />
                <span>{conversation.contact_phone}</span>
              </div>
              {conversation.contact_email && (
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="truncate">{conversation.contact_email}</span>
                </div>
              )}
              {conversation.contact_company && (
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{conversation.contact_company}</span>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-zinc-100 space-y-1.5">
              <h4 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Actions</h4>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs gap-2">
                <User className="h-3.5 w-3.5" />
                View Contact
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs gap-2">
                <ChevronRight className="h-3.5 w-3.5" />
                Create Lead
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
