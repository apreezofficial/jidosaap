"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface Lead {
  id: string;
  workspace_id: string;
  contact_id: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  title: string;
  value: number;
  currency: string;
  stage: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  assigned_user_id?: string;
  assigned_user_name?: string;
  source: string;
  probability: number;
  expected_close_date?: string;
  activities?: any[];
  notes?: any[];
  created_at: string;
  updated_at: string;
}

export interface PipelineColumn {
  stage: string;
  leads: Lead[];
  count: number;
  value: number;
}

export function useLeads(filters: Record<string, any> = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Lead[]>("/crm/leads", filters);
      if (res.success && res.data) setLeads(res.data);
      else setError(res.error?.message ?? "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);
  return { leads, loading, error, refetch: fetch };
}

export function usePipeline() {
  const [pipeline, setPipeline] = useState<PipelineColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PipelineColumn[]>("/crm/pipeline");
      if (res.success && res.data) setPipeline(res.data);
      else setError(res.error?.message ?? "Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const moveLead = useCallback(async (leadId: string, newStage: string) => {
    const res = await api.patch(`/crm/leads/${leadId}`, { stage: newStage });
    if (res.success) await fetch();
    return res;
  }, [fetch]);

  return { pipeline, loading, error, moveLead, refetch: fetch };
}

export function useLead(id: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get<Lead>(`/crm/leads/${id}`).then((res) => {
      if (res.success && res.data) setLead(res.data);
      setLoading(false);
    });
  }, [id]);

  return { lead, loading };
}
