"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAutomation } from "@/hooks/useAutomations";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  Panel,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Save, Play, Pause, Trash2, Plus, Zap,
  MessageSquare, Clock, Webhook, Users, Bot,
  GitBranch, Timer, Phone, Code, ChevronDown,
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

// ─── Node type configs ─────────────────────────────────────────
const NODE_TYPES_CONFIG = [
  {
    category: "Triggers",
    nodes: [
      { type: "trigger_message",  label: "Incoming Message", icon: MessageSquare, color: "bg-blue-50 border-blue-200 text-blue-700" },
      { type: "trigger_schedule", label: "Schedule",         icon: Clock,         color: "bg-violet-50 border-violet-200 text-violet-700" },
      { type: "trigger_webhook",  label: "Webhook",          icon: Webhook,       color: "bg-amber-50 border-amber-200 text-amber-700" },
      { type: "trigger_contact",  label: "New Contact",      icon: Users,         color: "bg-teal-50 border-teal-200 text-teal-700" },
    ],
  },
  {
    category: "Actions",
    nodes: [
      { type: "action_message",   label: "Send Message",    icon: MessageSquare, color: "bg-rose-50 border-rose-200 text-rose-700" },
      { type: "action_ai",        label: "AI Generation",   icon: Bot,           color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
      { type: "action_http",      label: "HTTP Request",    icon: Code,          color: "bg-zinc-50 border-zinc-200 text-zinc-700" },
      { type: "action_delay",     label: "Delay",           icon: Timer,         color: "bg-amber-50 border-amber-200 text-amber-700" },
      { type: "action_handoff",   label: "Human Handoff",   icon: Phone,         color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    ],
  },
  {
    category: "Logic",
    nodes: [
      { type: "logic_condition",  label: "Condition",       icon: GitBranch,     color: "bg-orange-50 border-orange-200 text-orange-700" },
    ],
  },
];

// Custom node renderer
function CustomNode({ data }: { data: any }) {
  const config = NODE_TYPES_CONFIG.flatMap((c) => c.nodes).find((n) => n.type === data.nodeType);
  const Icon = config?.icon || Zap;
  return (
    <div className={cn(
      "min-w-[160px] max-w-[220px] rounded-xl border-2 bg-white shadow-md px-3 py-2.5 cursor-default",
      config?.color || "border-zinc-200"
    )}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-semibold">{data.label}</span>
      </div>
      {data.description && (
        <p className="text-[10px] text-zinc-500 mt-1 leading-tight">{data.description}</p>
      )}
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

const defaultNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 80 },
    data: { label: "Incoming Message", nodeType: "trigger_message", description: "When a WhatsApp message arrives" },
  },
];

const defaultEdges: Edge[] = [];

export default function AutomationBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const automationId = params.id as string;
  const isNew = automationId === "new";

  const { automation, loading } = useAutomation(isNew ? "" : automationId);

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load existing automation nodes/edges
  useEffect(() => {
    if (automation?.nodes && automation.nodes.length > 0) {
      const loadedNodes: Node[] = automation.nodes.map((n: any) => ({
        id: n.node_id,
        type: "custom",
        position: n.position || { x: 0, y: 0 },
        data: { label: n.label, nodeType: n.type, ...(n.config || {}) },
      }));
      setNodes(loadedNodes);
    }
    if (automation?.edges && automation.edges.length > 0) {
      const loadedEdges: Edge[] = automation.edges.map((e: any) => ({
        id: e.edge_id,
        source: e.source_node_id,
        target: e.target_node_id,
        label: e.label,
        markerEnd: { type: MarkerType.ArrowClosed },
      }));
      setEdges(loadedEdges);
    }
  }, [automation]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  const addNode = (nodeConfig: typeof NODE_TYPES_CONFIG[0]["nodes"][0]) => {
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: "custom",
      position: { x: 200 + Math.random() * 200, y: 100 + nodes.length * 120 },
      data: { label: nodeConfig.label, nodeType: nodeConfig.type },
    };
    setNodes((ns) => [...ns, newNode]);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: (n.data as any).nodeType || "custom",
        label: (n.data as any).label || "",
        data: n.data,
        position: n.position,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        data: {},
      })),
    };

    let res;
    if (isNew) {
      res = await api.post("/automations", {
        name: "New Automation",
        trigger_type: "incoming_message",
        ...payload,
      });
      if (res.success && res.data) {
        router.replace(`/automations/${(res.data as any).id}`);
      }
    } else {
      res = await api.patch(`/automations/${automationId}`, payload);
    }

    setSaving(false);
    if (res?.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full -m-8 overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/automations">
            <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              {isNew ? "New Automation" : automation?.name || "Loading…"}
            </h2>
            {automation && (
              <Badge variant={automation.status === "active" ? "success" : "secondary"}>
                {automation.status}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {automation?.status === "active" ? (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs text-amber-600 border-amber-200"
              onClick={async () => { await api.post(`/automations/${automationId}/disable`); }}
            >
              <Pause className="h-3.5 w-3.5" />
              Disable
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs text-emerald-600 border-emerald-200"
              onClick={async () => { await api.post(`/automations/${automationId}/enable`); }}
            >
              <Play className="h-3.5 w-3.5" />
              Enable
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            className={cn("gap-1.5 text-xs", saved && "bg-emerald-600 hover:bg-emerald-700")}
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? "Saved!" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Node sidebar */}
        <div className={cn(
          "border-r border-zinc-200 bg-white overflow-y-auto transition-all shrink-0",
          sidebarOpen ? "w-52" : "w-0"
        )}>
          <div className="p-3 space-y-4">
            {NODE_TYPES_CONFIG.map((cat) => (
              <div key={cat.category}>
                <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  {cat.category}
                </h3>
                <div className="space-y-1.5">
                  {cat.nodes.map((n) => {
                    const Icon = n.icon;
                    return (
                      <button
                        key={n.type}
                        onClick={() => addNode(n)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs font-medium transition-colors hover:shadow-sm",
                          n.color
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {n.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flow canvas */}
        <div className="flex-1 overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-zinc-50"
          >
            <Background color="#e4e4e7" gap={20} />
            <Controls className="!bg-white !border-zinc-200 !shadow-sm" />
            <MiniMap
              className="!bg-white !border-zinc-200 !shadow-sm"
              nodeColor="#e11d48"
              maskColor="rgba(0,0,0,0.02)"
            />
            <Panel position="top-left">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="bg-white border border-zinc-200 rounded-lg p-2 shadow-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </Panel>
          </ReactFlow>
          {!automation && !isNew && loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/80">
              <div className="h-8 w-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
