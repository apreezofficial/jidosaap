"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface AutomationNode {
  id: string;
  type: string;
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface AutomationEdge {
  id: string;
  edge_id: string;
  source_node_id: string;
  target_node_id: string;
  label?: string;
}

export interface Automation {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  trigger_type: string;
  trigger_config: Record<string, any>;
  status: "active" | "inactive";
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  created_by_name?: string;
  nodes?: AutomationNode[];
  edges?: AutomationEdge[];
  created_at: string;
  updated_at: string;
}

export interface ApiConnection {
  id: string;
  name: string;
  base_url: string;
  auth_type: string;
  headers: Record<string, string>;
  status: string;
  last_tested_at?: string;
  created_at: string;
}

export function useAutomations(filters: Record<string, any> = {}) {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: Automation[]; meta: { total: number } }>(
        "/automations", filters
      );
      if (res.success && res.data) {
        setAutomations(res.data.data);
        setTotal(res.data.meta?.total ?? 0);
      } else {
        setError(res.error?.message ?? "Failed to load automations");
      }
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);
  return { automations, total, loading, error, refetch: fetch };
}

export function useAutomation(id: string) {
  const [automation, setAutomation] = useState<Automation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get<Automation>(`/automations/${id}`).then((res) => {
      if (res.success && res.data) setAutomation(res.data);
      setLoading(false);
    });
  }, [id]);

  return { automation, loading, refetch: () => {
    api.get<Automation>(`/automations/${id}`).then((res) => {
      if (res.success && res.data) setAutomation(res.data);
    });
  }};
}

export function useApiConnections() {
  const [connections, setConnections] = useState<ApiConnection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const res = await api.get<ApiConnection[]>("/integrations/api");
    if (res.success && res.data) setConnections(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { connections, loading, refetch: fetch };
}
