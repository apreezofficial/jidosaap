"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";

export interface Message {
  id: string;
  conversation_id: string;
  external_message_id?: string;
  direction: "inbound" | "outbound";
  type: string;
  content?: string;
  media_url?: string;
  status: "queued" | "sending" | "sent" | "delivered" | "read" | "failed" | "received";
  sender?: string;
  recipient?: string;
  attachments: any[];
  metadata?: any;
  created_at: string;
}

export interface Conversation {
  id: string;
  workspace_id: string;
  contact_id: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  contact_company?: string;
  contact_avatar?: string;
  contact_status?: string;
  connection_id?: string;
  status: "open" | "resolved" | "pending";
  handler_mode: "ai" | "human" | "hybrid";
  assigned_user_id?: string;
  assigned_user_name?: string;
  last_message_at?: string;
  last_message_content?: string;
  last_message_type?: string;
  last_message_direction?: string;
  unread_count: number;
  priority: string;
  created_at: string;
  updated_at: string;
}

export function useConversations(filters: Record<string, any> = {}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ data: Conversation[]; meta: { total: number } }>(
        "/conversations",
        filters
      );
      if (res.success && res.data) {
        setConversations(res.data.data);
        setTotal(res.data.meta?.total ?? 0);
      } else {
        setError(res.error?.message ?? "Failed to load conversations");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { conversations, total, loading, error, refetch: fetch };
}

export function useConversation(id: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchConversation = useCallback(async () => {
    if (!id) return;
    const res = await api.get<Conversation>(`/conversations/${id}`);
    if (res.success && res.data) setConversation(res.data);
  }, [id]);

  const fetchMessages = useCallback(async (silent = false) => {
    if (!id) return;
    if (!silent) setLoading(true);
    const res = await api.get<{ data: Message[] }>(`/conversations/${id}/messages`);
    if (res.success && res.data) setMessages(res.data.data);
    if (!silent) setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchConversation(), fetchMessages()]);

    // Poll for new messages every 5 seconds
    pollingRef.current = setInterval(() => {
      fetchConversation();
      fetchMessages(true);
    }, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [id, fetchConversation, fetchMessages]);

  const sendMessage = useCallback(async (content: string, type = "text") => {
    if (!id || !content.trim()) return;
    setSending(true);
    try {
      const res = await api.post<Message>(`/conversations/${id}/messages`, { content, type });
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data!]);
      }
    } finally {
      setSending(false);
    }
  }, [id]);

  const handoff = useCallback(async (mode: "ai" | "human" | "hybrid") => {
    if (!id) return;
    const res = await api.post<Conversation>(`/conversations/${id}/handoff`, { mode });
    if (res.success && res.data) setConversation(res.data);
  }, [id]);

  const updateStatus = useCallback(async (status: "open" | "resolved" | "pending") => {
    if (!id) return;
    const res = await api.patch<Conversation>(`/conversations/${id}/status`, { status });
    if (res.success && res.data) setConversation(res.data);
  }, [id]);

  return {
    conversation, messages, loading, sending,
    sendMessage, handoff, updateStatus,
    refetch: () => { fetchConversation(); fetchMessages(true); },
  };
}
