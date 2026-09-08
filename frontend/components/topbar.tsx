"use client";

import React, { useState, useEffect } from "react";
import { Bell, Command, Sparkles, CheckCircle2, AlertCircle, Zap, Users, Bot } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { cn, formatRelativeTime } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":           "Dashboard",
  "/inbox":               "Inbox",
  "/contacts":            "Contacts",
  "/crm/leads":           "CRM Pipeline",
  "/content":             "Content Studio",
  "/calendar":            "Calendar",
  "/templates":           "Templates",
  "/automations":         "Automations",
  "/integrations/api":    "API Integrations",
  "/integrations/whatsapp": "WhatsApp",
  "/agents":              "AI Agents",
  "/knowledge":           "Knowledge Base",
  "/analytics":           "Analytics",
  "/settings/profile":    "Profile",
  "/settings/workspace":  "Workspace Settings",
  "/settings/team":       "Team",
  "/settings/billing":    "Billing",
  "/settings/security":   "Security",
};

const NOTIF_ICONS: Record<string, any> = {
  failed_automation: AlertCircle,
  new_lead:          Users,
  ai_handoff:        Bot,
  failed_whatsapp:   AlertCircle,
  api_failure:       AlertCircle,
  usage_limit:       AlertCircle,
};

export function Topbar() {
  const { currentWorkspace } = useAuth();
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Derive current page title
  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/")
  )?.[1] ?? "";

  useEffect(() => {
    // Fetch recent activity as notifications proxy
    api.get<any[]>("/analytics/activity", { limit: 5 }).then((res) => {
      if (res.success && res.data) {
        setNotifications(res.data);
        setUnreadCount(Math.min(res.data.length, 3));
      }
    });
  }, []);

  const ACTION_LABELS: Record<string, { label: string; color: string }> = {
    user_login:             { label: "New sign in detected",            color: "text-emerald-600" },
    whatsapp_connected:     { label: "WhatsApp account connected",      color: "text-blue-600" },
    whatsapp_disconnected:  { label: "WhatsApp account disconnected",   color: "text-amber-600" },
    automation_enabled:     { label: "Automation activated",            color: "text-emerald-600" },
    automation_disabled:    { label: "Automation paused",               color: "text-amber-600" },
    automation_created:     { label: "New automation created",          color: "text-zinc-700" },
    ai_agent_created:       { label: "AI agent deployed",               color: "text-violet-600" },
    ai_agent_modified:      { label: "AI agent configuration updated",  color: "text-amber-600" },
    contact_created:        { label: "New contact added",               color: "text-zinc-700" },
    api_connection_created: { label: "API integration connected",       color: "text-blue-600" },
    member_invited:         { label: "Team member invited",             color: "text-violet-600" },
    subscription_activated: { label: "Subscription upgraded",           color: "text-emerald-600" },
  };

  return (
    <header className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="font-medium text-zinc-400">{currentWorkspace?.name || "Workspace"}</span>
          {pageTitle && (
            <>
              <span className="text-zinc-300">/</span>
              <span className="font-semibold text-zinc-800">{pageTitle}</span>
            </>
          )}
        </div>

        {/* WhatsApp Connection status */}
        <Link
          href="/integrations/whatsapp"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200/80 hover:bg-emerald-100/70 transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Meta Cloud API
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Cmd+K trigger */}
        <button
          onClick={() => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
          }}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-400 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
        >
          <Command className="h-3.5 w-3.5" />
          <span>Search…</span>
          <kbd className="text-[10px] bg-white border border-zinc-200 rounded px-1.5 py-0.5 font-mono text-zinc-400">⌘K</kbd>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-zinc-500 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 border border-white" />
            )}
          </button>

          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl z-40 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                  <p className="text-xs font-semibold text-zinc-900">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="divide-y divide-zinc-50 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <CheckCircle2 className="h-6 w-6 text-zinc-200 mx-auto mb-2" />
                      <p className="text-xs text-zinc-400">No recent activity</p>
                    </div>
                  ) : (
                    notifications.map((n, idx) => {
                      const conf = ACTION_LABELS[n.action] || { label: n.action, color: "text-zinc-600" };
                      return (
                        <div key={idx} className={cn("px-4 py-3 hover:bg-zinc-50 transition-colors", idx < unreadCount && "bg-rose-50/30")}>
                          <div className="flex items-start gap-2.5">
                            <div className={cn("h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 bg-current", conf.color)} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-zinc-900 leading-snug">{conf.label}</p>
                              {n.user_name && (
                                <p className="text-[10px] text-zinc-400 mt-0.5">by {n.user_name}</p>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400 shrink-0">
                              {formatRelativeTime(n.created_at)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="px-4 py-2 border-t border-zinc-100">
                  <Link
                    href="/analytics"
                    className="text-[10px] text-rose-600 hover:text-rose-700 font-medium"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    View all activity →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
