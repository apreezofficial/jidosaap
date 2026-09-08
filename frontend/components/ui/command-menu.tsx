"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageSquare,
  Bot,
  Zap,
  Users,
  Settings,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commands = [
    {
      group: "Quick Actions",
      items: [
        {
          name: "Create Scheduled Post",
          icon: Calendar,
          href: "/content/new",
        },
        {
          name: "Create Automation Workflow",
          icon: Zap,
          href: "/automations/new",
        },
        {
          name: "Configure AI Agent",
          icon: Bot,
          href: "/agents/new",
        },
        {
          name: "Add Contact",
          icon: Users,
          href: "/contacts",
        },
      ],
    },
    {
      group: "Navigation",
      items: [
        { name: "WhatsApp Inbox", icon: MessageSquare, href: "/inbox" },
        { name: "CRM Pipeline & Leads", icon: Layers, href: "/crm/leads" },
        { name: "API Integrations", icon: Zap, href: "/integrations/api" },
        { name: "Workspace Settings", icon: Settings, href: "/settings/workspace" },
      ],
    },
  ];

  const filteredCommands = commands
    .map((g) => ({
      ...g,
      items: g.items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-24 animate-in fade-in duration-100">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl border border-zinc-200 overflow-hidden z-10">
        <div className="flex items-center border-b border-zinc-100 px-4">
          <Search className="h-4 w-4 text-zinc-400 mr-2" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-500 font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching commands or destinations found.
            </div>
          ) : (
            filteredCommands.map((group) => (
              <div key={group.group} className="mb-2">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setOpen(false);
                        router.push(item.href);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 group-hover:border-zinc-300">
                          <Icon className="h-4 w-4 text-zinc-600" />
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
