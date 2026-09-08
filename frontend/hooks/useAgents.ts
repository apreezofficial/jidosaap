"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface AgentTool {
  id: string;
  tool_name: string;
  enabled: number;
  config: Record<string, any>;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  agent_id?: string;
  agent_name?: string;
  status: string;
  document_count: number;
  created_at: string;
}

export interface Document {
  id: string;
  knowledge_base_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  status: "processing" | "ready" | "failed";
  chunk_count: number;
  created_at: string;
}

export interface Agent {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  personality: string;
  tone: string;
  language: string;
  business_info?: string;
  instructions?: string;
  status: "active" | "inactive";
  working_hours?: any;
  escalation_rules?: any[];
  tool_count: number;
  knowledge_base_count: number;
  tools?: AgentTool[];
  knowledge_bases?: KnowledgeBase[];
  created_at: string;
  updated_at: string;
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Agent[]>("/agents");
      if (res.success && res.data) setAgents(res.data);
      else setError(res.error?.message ?? "Failed to load agents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { agents, loading, error, refetch: fetch };
}

export function useAgent(id: string) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get<Agent>(`/agents/${id}`).then((res) => {
      if (res.success && res.data) setAgent(res.data);
      setLoading(false);
    });
  }, [id]);

  return { agent, loading };
}

export function useKnowledgeBases() {
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const res = await api.get<KnowledgeBase[]>("/knowledge-bases");
    if (res.success && res.data) setKbs(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { kbs, loading, refetch: fetch };
}

export function useDocuments(kbId: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!kbId) return;
    const res = await api.get<Document[]>(`/knowledge-bases/${kbId}/documents`);
    if (res.success && res.data) setDocuments(res.data);
    setLoading(false);
  }, [kbId]);

  useEffect(() => { fetch(); }, [fetch]);
  return { documents, loading, refetch: fetch };
}
