"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface DashboardStats {
  period: string;
  messages_received: number;
  messages_sent: number;
  total_conversations: number;
  ai_conversations: number;
  human_conversations: number;
  open_conversations: number;
  ai_resolution_rate: number;
  total_leads: number;
  won_leads: number;
  won_value: number;
  automation_runs: number;
  successful_runs: number;
  failed_runs: number;
}

export interface MessageSeries {
  date: string;
  received: number;
  sent: number;
}

export interface LeadSeries {
  date: string;
  total: number;
  won: number;
}

export interface PipelineStage {
  stage: string;
  count: number;
  total_value: number;
}

export function useDashboardStats(period = "7d") {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<DashboardStats>("/analytics/dashboard", { period });
      if (res.success && res.data) setStats(res.data);
      else setError(res.error?.message ?? "Failed to load stats");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { fetch(); }, [fetch]);
  return { stats, loading, error, refetch: fetch };
}

export function useMessageSeries(period = "7d") {
  const [series, setSeries] = useState<MessageSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<MessageSeries[]>("/analytics/messages", { period }).then((res) => {
      if (res.success && res.data) setSeries(res.data);
      setLoading(false);
    });
  }, [period]);

  return { series, loading };
}

export function useLeadAnalytics(period = "30d") {
  const [series, setSeries] = useState<LeadSeries[]>([]);
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ series: LeadSeries[]; pipeline: PipelineStage[] }>("/analytics/leads", { period }).then((res) => {
      if (res.success && res.data) {
        setSeries(res.data.series);
        setPipeline(res.data.pipeline);
      }
      setLoading(false);
    });
  }, [period]);

  return { series, pipeline, loading };
}

export function useAutomationSeries(period = "7d") {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any[]>("/analytics/automations", { period }).then((res) => {
      if (res.success && res.data) setSeries(res.data);
      setLoading(false);
    });
  }, [period]);

  return { series, loading };
}

export function useRecentActivity(limit = 20) {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any[]>("/analytics/activity", { limit }).then((res) => {
      if (res.success && res.data) setActivity(res.data);
      setLoading(false);
    });
  }, [limit]);

  return { activity, loading };
}
