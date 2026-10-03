"use client";

import React, { useState } from "react";
import { useContacts, useTags } from "@/hooks/useContacts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatRelativeTime, initials, phoneDisplay } from "@/lib/utils";
import {
  Search, Plus, Upload, Download, Phone, Mail, Building2,
  MoreVertical, Trash2, Edit, Tag, Users, Filter, X,
} from "lucide-react";
import { api } from "@/lib/api";

const SOURCE_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  import: "Import",
  manual: "Manual",
  api: "API",
  crm: "CRM",
};

const DEFAULT_CONTACTS: any[] = [
  {
    id: "c-1",
    name: "Alex Rivera",
    phone: "+1 (415) 890-2311",
    email: "alex@scalestudio.io",
    company: "SaaS Scale Studio",
    source: "whatsapp",
    status: "active",
    tags: [{ id: "t-1", name: "VIP Retainer ($1,800/mo)", color: "#10b981" }],
    created_at: new Date().toISOString(),
  },
  {
    id: "c-2",
    name: "Precious O.",
    phone: "+234 810 992 0184",
    email: "precious@penna.dev",
    company: "Penna Essayist",
    source: "whatsapp",
    status: "active",
    tags: [{ id: "t-2", name: "Newsletter Reader", color: "#2563eb" }],
    created_at: new Date().toISOString(),
  },
  {
    id: "c-3",
    name: "Elena Rostova",
    phone: "+44 7911 123456",
    email: "elena@cryptobuilders.xyz",
    company: "Crypto Builders DAO",
    source: "whatsapp",
    status: "active",
    tags: [{ id: "t-3", name: "Group Shield Admin", color: "#f59e0b" }],
    created_at: new Date().toISOString(),
  },
  {
    id: "c-4",
    name: "Shola Visuals",
    phone: "+234 802 334 9102",
    email: "shola@visuals.design",
    company: "Brand Identity Studio",
    source: "whatsapp",
    status: "active",
    tags: [{ id: "t-4", name: "7 AM Drops Subscriber", color: "#8b5cf6" }],
    created_at: new Date().toISOString(),
  },
];

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contacts: apiContacts, total, loading, refetch } = useContacts({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    limit: 20,
  });
  const contacts = apiContacts.length > 0 ? apiContacts : DEFAULT_CONTACTS;
  const { tags } = useTags();

  const totalPages = Math.ceil(total / 20);

  const handleCreate = async () => {
    if (!form.name || !form.phone) return;
    setSaving(true);
    setError(null);
    const res = await api.post("/contacts", form);
    setSaving(false);
    if (res.success) {
      setShowCreate(false);
      setForm({ name: "", phone: "", email: "", company: "", notes: "" });
      refetch();
    } else {
      setError(res.error?.message ?? "Failed to create contact");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    await api.delete(`/contacts/${id}`);
    refetch();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Contacts</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {total.toLocaleString()} contacts in your workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Upload className="h-3.5 w-3.5" />
            Import CSV
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            New Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#2563eb] bg-white"
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {["", "active", "lead", "customer"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors",
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

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 w-8">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Company</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Source</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Tags</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Added</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-zinc-100 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center">
                    <Users className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-zinc-400">No contacts found</p>
                    <p className="text-xs text-zinc-300 mt-1">
                      {search ? "Try a different search" : "Add your first contact or connect WhatsApp"}
                    </p>
                    {!search && (
                      <Button size="sm" onClick={() => setShowCreate(true)} className="mt-4 gap-1.5 text-xs">
                        <Plus className="h-3.5 w-3.5" />
                        Add Contact
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors group">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                          {initials(c.name)}
                        </div>
                        <span className="font-medium text-zinc-900 text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`tel:${c.phone}`} className="text-zinc-600 hover:text-[#2563eb] text-xs flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {c.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {c.email ? (
                        <span className="text-zinc-500 text-xs truncate max-w-[160px] block">{c.email}</span>
                      ) : (
                        <span className="text-zinc-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.company ? (
                        <span className="text-zinc-600 text-xs">{c.company}</span>
                      ) : (
                        <span className="text-zinc-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{SOURCE_LABELS[c.source] || c.source}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.tags?.slice(0, 2).map((t) => (
                          <span
                            key={t.id}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                            style={{ backgroundColor: t.color + "20", color: t.color }}
                          >
                            {t.name}
                          </span>
                        ))}
                        {c.tags?.length > 2 && (
                          <span className="text-[10px] text-zinc-400">+{c.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.status === "active" ? "success" : c.status === "lead" ? "warning" : "secondary"}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {formatRelativeTime(c.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-xs h-7"
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-xs text-zinc-600">{page} / {totalPages}</span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-xs h-7"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); setError(null); }}
        title="New Contact"
        description="Add a contact to your workspace"
        maxWidth="md"
      >
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
          <Input
            label="Name *"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Phone *"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Company"
            placeholder="Company name"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Notes</label>
            <textarea
              className="w-full h-20 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
              placeholder="Optional notes…"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 text-sm">
              Cancel
            </Button>
            <Button onClick={handleCreate} isLoading={saving} className="flex-1 text-sm">
              Create Contact
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
