"use client";

import React, { useState } from "react";
import { useKnowledgeBases, useDocuments } from "@/hooks/useAgents";
import { useAgents } from "@/hooks/useAgents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Plus, BookOpen, FileText, Upload, Trash2,
  CheckCircle2, Clock, AlertCircle, ChevronRight, Bot,
} from "lucide-react";
import { api } from "@/lib/api";

const STATUS_CONFIG: Record<string, { label: string; icon: any; variant: any }> = {
  ready:      { label: "Ready",      icon: CheckCircle2, variant: "success" },
  processing: { label: "Processing", icon: Clock,        variant: "warning" },
  failed:     { label: "Failed",     icon: AlertCircle,  variant: "destructive" },
};

function DocumentsList({ kbId }: { kbId: string }) {
  const { documents, loading, refetch } = useDocuments(kbId);
  const [addingDoc, setAddingDoc] = useState(false);
  const [docForm, setDocForm] = useState({ file_name: "", file_url: "", file_type: "text/plain" });

  const handleAdd = async () => {
    if (!docForm.file_name) return;
    const res = await api.post(`/knowledge-bases/${kbId}/documents`, docForm);
    if (res.success) {
      setAddingDoc(false);
      setDocForm({ file_name: "", file_url: "", file_type: "text/plain" });
      refetch();
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {loading ? (
        <div className="h-8 bg-zinc-100 rounded animate-pulse" />
      ) : documents.length === 0 ? (
        <p className="text-xs text-zinc-400 py-2 text-center">No documents yet</p>
      ) : (
        documents.map((doc) => {
          const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.processing;
          const StatusIcon = statusConf.icon;
          return (
            <div key={doc.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-zinc-400" />
                <div>
                  <p className="text-xs font-medium text-zinc-900">{doc.file_name}</p>
                  <p className="text-[10px] text-zinc-400">
                    {doc.chunk_count} chunks · {formatRelativeTime(doc.created_at)}
                  </p>
                </div>
              </div>
              <Badge variant={statusConf.variant}>
                <StatusIcon className="h-2.5 w-2.5 mr-1" />
                {statusConf.label}
              </Badge>
            </div>
          );
        })
      )}

      {addingDoc ? (
        <div className="space-y-2 pt-2">
          <Input
            placeholder="Document name"
            value={docForm.file_name}
            onChange={(e) => setDocForm((f) => ({ ...f, file_name: e.target.value }))}
          />
          <Input
            placeholder="File URL (S3 / public URL)"
            value={docForm.file_url}
            onChange={(e) => setDocForm((f) => ({ ...f, file_url: e.target.value }))}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setAddingDoc(false)} className="flex-1 text-xs">Cancel</Button>
            <Button size="sm" onClick={handleAdd} className="flex-1 text-xs">Add Document</Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingDoc(true)}
          className="flex items-center gap-1.5 text-xs text-[#2563eb] hover:text-[#1d4ed8] font-medium pt-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Document
        </button>
      )}
    </div>
  );
}

export default function KnowledgePage() {
  const { kbs, loading, refetch } = useKnowledgeBases();
  const { agents } = useAgents();
  const [showCreate, setShowCreate] = useState(false);
  const [expandedKb, setExpandedKb] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", agent_id: "" });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.name) return;
    setSaving(true);
    const res = await api.post("/knowledge-bases", form);
    setSaving(false);
    if (res.success) {
      setShowCreate(false);
      setForm({ name: "", description: "", agent_id: "" });
      refetch();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Knowledge Base</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Upload documents for your AI agents to search and reference
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          New Knowledge Base
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-indigo-900">How knowledge bases work</p>
          <p className="text-xs text-indigo-600 mt-0.5">
            Documents are processed, chunked, and embedded as vectors. AI agents use semantic search to
            find relevant content when answering customer questions. Documents are tenant-isolated —
            agents can only access knowledge bases in your workspace.
          </p>
        </div>
      </div>

      {/* Knowledge bases */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : kbs.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl py-20 flex flex-col items-center">
          <BookOpen className="h-10 w-10 text-zinc-200 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-700 mb-1">No knowledge bases</h3>
          <p className="text-xs text-zinc-400 mb-5 max-w-xs text-center">
            Upload PDFs, text files, FAQs, or product catalogs for your AI to reference
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Create Knowledge Base
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {kbs.map((kb) => (
            <Card key={kb.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-zinc-900">{kb.name}</h3>
                      <Badge variant={kb.status === "active" ? "success" : "secondary"}>
                        {kb.status}
                      </Badge>
                    </div>
                    {kb.description && (
                      <p className="text-xs text-zinc-500 mb-2">{kb.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {kb.document_count} documents
                      </span>
                      {kb.agent_name && (
                        <span className="flex items-center gap-1">
                          <Bot className="h-3 w-3" />
                          {kb.agent_name}
                        </span>
                      )}
                      <span>{formatRelativeTime(kb.created_at)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedKb(expandedKb === kb.id ? null : kb.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", expandedKb === kb.id && "rotate-90")} />
                  {expandedKb === kb.id ? "Collapse" : "Documents"}
                </button>
              </div>

              {expandedKb === kb.id && (
                <div className="mt-3 pt-3 border-t border-zinc-100">
                  <DocumentsList kbId={kb.id} />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Knowledge Base"
        description="Create a knowledge base to store documents for your AI agents"
        maxWidth="md"
      >
        <div className="space-y-3">
          <Input
            label="Name *"
            placeholder="e.g. Product FAQ"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Description</label>
            <textarea
              className="w-full h-20 resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
              placeholder="What kind of information is in this knowledge base?"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Assign to Agent (optional)</label>
            <select
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563eb] bg-white"
              value={form.agent_id}
              onChange={(e) => setForm((f) => ({ ...f, agent_id: e.target.value }))}
            >
              <option value="">No agent assigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 text-sm">Cancel</Button>
            <Button onClick={handleCreate} isLoading={saving} className="flex-1 text-sm gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
