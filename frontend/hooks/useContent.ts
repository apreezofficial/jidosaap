"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface ContentItem {
  id: string;
  workspace_id: string;
  title: string;
  content: string;
  destination: string;
  status: "draft" | "scheduled" | "processing" | "sent" | "failed" | "cancelled";
  created_by?: string;
  created_by_name?: string;
  media: Array<{ id: string; media_type: string; media_url: string; caption?: string }>;
  next_run_at?: string;
  schedule_type?: string;
  schedule_status?: string;
  scheduled_post_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  language: string;
  body: string;
  header?: string;
  footer?: string;
  variables: string[];
  buttons: any[];
  status: string;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  content_id: string;
  title: string;
  content_body: string;
  destination: string;
  next_run_at: string;
  schedule_type: string;
  status: string;
  phone_number?: string;
  business_name?: string;
}

export function useContent(filters: Record<string, any> = {}) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: ContentItem[]; meta: { total: number } }>(
        "/content", filters
      );
      if (res.success && res.data) {
        setContent(res.data.data);
        setTotal(res.data.meta?.total ?? 0);
      } else {
        setError(res.error?.message ?? "Failed to load content");
      }
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);
  return { content, total, loading, error, refetch: fetch };
}

export function useCalendar(start: string, end: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const res = await api.get<CalendarEvent[]>("/content/calendar", { start, end });
    if (res.success && res.data) setEvents(res.data);
    setLoading(false);
  }, [start, end]);

  useEffect(() => { fetch(); }, [fetch]);
  return { events, loading, refetch: fetch };
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const res = await api.get<Template[]>("/content/templates");
    if (res.success && res.data) setTemplates(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { templates, loading, refetch: fetch };
}
