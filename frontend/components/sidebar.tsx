"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Kanban,
  PenTool,
  Calendar,
  FileText,
  Workflow,
  Webhook,
  Bot,
  BookOpen,
  BarChart3,
  Settings,
  ChevronDown,
  Building,
  LogOut,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { user, workspaces, currentWorkspace, switchWorkspace, logout } = useAuth();
  const [wsMenuOpen, setWsMenuOpen] = React.useState(false);

  const navigation = [
    {
      group: "Overview",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      group: "Workspace",
      items: [
        { name: "Inbox", href: "/inbox", icon: MessageSquare, badge: "WhatsApp" },
        { name: "Contacts", href: "/contacts", icon: Users },
        { name: "CRM Pipeline", href: "/crm/leads", icon: Kanban },
      ],
    },
    {
      group: "Content",
      items: [
        { name: "Content Studio", href: "/content", icon: PenTool },
        { name: "Calendar", href: "/calendar", icon: Calendar },
        { name: "Templates", href: "/templates", icon: FileText },
      ],
    },
    {
      group: "Automation",
      items: [
        { name: "Automations",      href: "/automations",          icon: Workflow },
        { name: "API Integrations", href: "/integrations/api",     icon: Webhook },
        { name: "WhatsApp",         href: "/integrations/whatsapp", icon: MessageSquare, badge: "Meta API" },
      ],
    },
    {
      group: "AI Intelligence",
      items: [
        { name: "AI Agents", href: "/agents", icon: Bot },
        { name: "Knowledge Base", href: "/knowledge", icon: BookOpen },
      ],
    },
    {
      group: "System",
      items: [
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Settings", href: "/settings/workspace", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col h-screen select-none shrink-0">
      {/* Brand Header with subtle Japanese mark */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-sm shadow-sm relative overflow-hidden group-hover:bg-rose-600 transition-colors">
            {/* Japanese Kanji symbol for Jidō: 自 */}
            <span className="font-serif text-sm">自</span>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900">JidoSapp</span>
              <span className="text-[10px] uppercase font-semibold px-1 py-0.2 bg-rose-50 text-rose-600 rounded border border-rose-100">
                AI
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium tracking-tight">Put WhatsApp on Autopilot</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.group}>
            <div className="px-3 mb-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              {section.group}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group",
                      isActive
                        ? "bg-rose-50/80 text-rose-700 font-semibold shadow-xs"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-rose-600" : "text-zinc-400 group-hover:text-zinc-700"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-100">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile & Multi-tenant Workspace Switcher */}
      <div className="border-t border-zinc-100 p-3 bg-zinc-50/50 space-y-2">
        {/* Workspace selector */}
        <div className="relative">
          <button
            onClick={() => setWsMenuOpen(!wsMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-zinc-200 text-left hover:bg-zinc-50 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-6 w-6 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0">
                <Building className="h-3.5 w-3.5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-zinc-900 truncate">
                  {currentWorkspace?.name || "Select Workspace"}
                </p>
                <p className="text-[10px] text-zinc-400 capitalize">
                  {currentWorkspace?.role || "Member"}
                </p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          </button>

          {wsMenuOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-zinc-200 rounded-lg shadow-lg p-1 z-20">
              <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase">
                Workspaces ({workspaces.length})
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(ws.id);
                    setWsMenuOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors",
                    ws.id === currentWorkspace?.id
                      ? "bg-rose-50 text-rose-700 font-medium"
                      : "hover:bg-zinc-100 text-zinc-700"
                  )}
                >
                  <span className="truncate">{ws.name}</span>
                  <span className="text-[10px] text-zinc-400 capitalize">{ws.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Card with Logout */}
        <div className="flex items-center justify-between p-1.5 rounded-lg">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-7 w-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-zinc-800 truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 text-zinc-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
