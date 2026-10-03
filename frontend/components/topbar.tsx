"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar as CalendarIcon,
  ChevronDown,
  CheckCircle2,
  Menu,
  PanelLeftClose,
  Search,
  Globe,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/lib/sidebar-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { cn, formatRelativeTime } from "@/lib/utils";

export function Topbar() {
  const { currentWorkspace } = useAuth();
  const { toggleMobile } = useSidebar();
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Formatted date
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(now);
    setFormattedDate(formatted);
  }, []);

  useEffect(() => {
    api.get<any[]>("/analytics/activity", { limit: 5 }).then((res) => {
      if (res.success && res.data) {
        setNotifications(res.data);
        setUnreadCount(Math.min(res.data.length, 3));
      }
    });
  }, []);

  const ACTION_LABELS: Record<string, { label: string; color: string }> = {
    user_login:            { label: "New sign in detected",          color: "text-emerald-600" },
    whatsapp_connected:    { label: "WhatsApp account connected",    color: "text-blue-600" },
    whatsapp_disconnected: { label: "WhatsApp account disconnected", color: "text-amber-600" },
    automation_enabled:    { label: "Automation activated",          color: "text-emerald-600" },
    automation_disabled:   { label: "Automation paused",             color: "text-amber-600" },
    automation_created:    { label: "New automation created",        color: "text-zinc-700" },
    ai_agent_created:      { label: "AI agent deployed",             color: "text-violet-600" },
    contact_created:       { label: "New contact added",             color: "text-zinc-700" },
  };

  return (
    <header className="h-14 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none font-sans">
      {/* Left: Mobile Hamburger Toggle + Calendar Trigger + Connection Pill */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={toggleMobile}
          title="Toggle Navigation Menu"
          className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl transition-colors lg:hidden shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs font-medium text-zinc-700 cursor-pointer hover:bg-zinc-100/70 transition-colors shrink-0">
          <CalendarIcon className="h-3.5 w-3.5 text-zinc-400" />
          <span>{formattedDate || "Today"}</span>
        </div>

        {/* WhatsApp Connection status pill */}
        <Link
          href="/integrations/whatsapp"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200/80 hover:bg-emerald-100/70 transition-colors shrink-0"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden xs:inline">Meta API</span>
          <span className="xs:hidden">Live</span>
        </Link>

        {/* Subdomain indicator */}
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 truncate">
          <Globe className="h-3 w-3 shrink-0" />
          <span className="truncate">onos.jidosaap.xyz</span>
        </span>
      </div>

      {/* Right side: Search + Notifications */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Cmd+K trigger */}
        <button
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
            );
          }}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-zinc-400 bg-zinc-50 border border-zinc-200/80 rounded-xl hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="text-[10px] bg-white border border-zinc-200 rounded px-1.5 py-0.5 font-mono text-zinc-400 hidden sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-zinc-500 hover:text-zinc-800 rounded-xl hover:bg-zinc-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#2563eb] border-2 border-white" />
            )}
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-zinc-200/90 rounded-2xl shadow-xl z-40 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                  <p className="text-xs font-semibold text-zinc-900">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#2563eb] text-white px-2 py-0.5 rounded-full font-bold">
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
                      const conf = ACTION_LABELS[n.action] || {
                        label: n.action,
                        color: "text-zinc-600",
                      };
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "px-4 py-3 hover:bg-zinc-50 transition-colors",
                            idx < unreadCount && "bg-blue-50/20"
                          )}
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={cn(
                                "h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 bg-current",
                                conf.color
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-zinc-900 leading-snug">
                                {conf.label}
                              </p>
                              {n.user_name && (
                                <p className="text-[10px] text-zinc-400 mt-0.5">
                                  by {n.user_name}
                                </p>
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
                    className="text-[10px] text-[#2563eb] hover:text-[#1d4ed8] font-semibold"
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
