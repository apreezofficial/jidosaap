"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface WhatsAppConnection {
  id: string;
  workspace_id: string;
  business_name: string;
  phone_number: string;
  phone_number_id: string;
  waba_id: string;
  webhook_verify_token: string;
  status: "connected" | "disconnected" | "expired" | "error";
  connected_at?: string;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
}

export function useWhatsAppConnections() {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<WhatsAppConnection[]>("/integrations/whatsapp");
      if (res.success && res.data) setConnections(res.data);
      else setError(res.error?.message ?? "Failed to load connections");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const testConnection = useCallback(async (id: string) => {
    return api.post<{ success: boolean; message: string }>(`/integrations/whatsapp/${id}/test`);
  }, []);

  const disconnect = useCallback(async (id: string) => {
    const res = await api.post(`/integrations/whatsapp/${id}/disconnect`);
    if (res.success) await fetch();
    return res;
  }, [fetch]);

  const deleteConnection = useCallback(async (id: string) => {
    const res = await api.delete(`/integrations/whatsapp/${id}`);
    if (res.success) await fetch();
    return res;
  }, [fetch]);

  return { connections, loading, error, testConnection, disconnect, deleteConnection, refetch: fetch };
}

export function useBilling() {
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/plans"),
      api.get("/billing/subscription"),
      api.get("/billing/usage"),
    ]).then(([plansRes, subRes, usageRes]) => {
      if (plansRes.success) setPlans(plansRes.data as any[]);
      if (subRes.success) setSubscription(subRes.data);
      if (usageRes.success) setUsage(usageRes.data);
      setLoading(false);
    });
  }, []);

  return { subscription, plans, usage, loading };
}
