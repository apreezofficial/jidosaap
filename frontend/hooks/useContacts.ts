"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface Contact {
  id: string;
  workspace_id: string;
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  source: string;
  status: string;
  notes?: string | null;
  avatar_url?: string | null;
  tags: Array<{ id: string; name: string; color: string }>;
  created_at: string;
  updated_at: string;
}

export interface ContactFilters {
  search?: string;
  status?: string;
  source?: string;
  page?: number;
  limit?: number;
}

export function useContacts(filters: ContactFilters = {}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ data: Contact[]; meta: { total: number } }>(
        "/contacts",
        { ...filters } as Record<string, string | number | boolean>
      );
      if (res.success && res.data) {
        setContacts(res.data.data);
        setTotal(res.data.meta?.total ?? 0);
      } else {
        setError(res.error?.message ?? "Failed to load contacts");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { contacts, total, loading, error, refetch: fetch };
}

export function useContact(id: string) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get<Contact>(`/contacts/${id}`).then((res) => {
      if (res.success && res.data) setContact(res.data);
      else setError(res.error?.message ?? "Not found");
      setLoading(false);
    });
  }, [id]);

  return { contact, loading, error };
}

export function useTags() {
  const [tags, setTags] = useState<Array<{ id: string; name: string; color: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Array<{ id: string; name: string; color: string }>>("/contacts/tags").then((res) => {
      if (res.success && res.data) setTags(res.data);
      setLoading(false);
    });
  }, []);

  return { tags, loading };
}
