"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useSidebar } from "@/lib/sidebar-context";
import {
  Home,
  CheckSquare,
  Mail,
  BarChart2,
  Plus,
  HelpCircle,
  Settings,
  ChevronDown,
  LogOut,
  Zap,
  Radio,
  X,
  Bot,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JidoSappLogo } from "@/components/ui/logo";

export function Sidebar() {
  const pathname = usePathname();
  const { user, workspaces, currentWorkspace, switchWorkspace, logout } = useAuth();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const [wsMenuOpen, setWsMenuOpen] = useState(false);

  const generalNav = [
    { name: "Command Center", href: "/dashboard", icon: Home },
    { name: "WhatsApp Inbox", href: "/inbox", icon: Mail, badge: 3 },
    { name: "WhatsApp Leads & CRM", href: "/crm/leads", icon: CheckSquare, badge: 8 },
    { name: "Status Drops & Broadcasts", href: "/content", icon: Radio, badge: "7 AM" },
    { name: "Automations & Sentinel", href: "/automations", icon: Zap, badge: 4 },
    { name: "Analytics & ROI", href: "/analytics", icon: BarChart2 },
  ];

  const workspaceChannels = [
    { name: "24/7 Auto-Responder", color: "bg-emerald-500", href: "/automations" },
    { name: "Group Shield Sentinel", color: "bg-amber-500", href: "/automations" },
    { name: "Newsletter Status Bridge", color: "bg-[#2563eb]", href: "/content" },
    { name: "7:00 AM Daily Drops", color: "bg-[#00b4d8]", href: "/content" },
    { name: "Subdomain: onos.jidosaap.xyz", color: "bg-purple-500", href: "/integrations/whatsapp" },
  ];

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Responsive Sidebar */}
      <aside
        className={cn(
          "bg-white flex flex-col h-screen select-none font-sans border-r border-zinc-200/80 transition-all duration-300 z-50",
          // Mobile styles: fixed sliding drawer
          "fixed inset-y-0 left-0 w-72 shadow-2xl lg:shadow-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop styles: static sidebar
          "lg:static lg:w-64 lg:shrink-0"
        )}
      >
        {/* Brand Header: Logo + Close button on mobile */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 lg:border-none">
          <JidoSappLogo href="/dashboard" size="md" />
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl lg:hidden transition-colors"
            title="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick "+ Create" Action Button */}
        <div className="px-5 pb-3">
          <Link
            href="/automations"
            onClick={handleLinkClick}
            className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 shadow-2xs transition-all active:scale-[0.98]"
          >
            <div className="w-4 h-4 rounded-full border border-zinc-400 flex items-center justify-center">
              <Plus className="h-2.5 w-2.5 text-zinc-700 stroke-[2.5]" />
            </div>
            <span>Create Automation</span>
          </Link>
        </div>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* GENERAL Section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              OPERATIONS
            </div>
            <div className="space-y-0.5">
              {generalNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                      isActive
                        ? "bg-zinc-100 text-zinc-950 font-semibold shadow-2xs"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-zinc-950 stroke-[2.2]" : "text-zinc-400 stroke-[1.8]"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium tracking-tight",
                          isActive
                            ? "bg-zinc-200/70 text-zinc-900 font-semibold"
                            : "text-zinc-400"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CORE ENGINES Section */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                CORE ENGINES
              </span>
            </div>
            <div className="space-y-0.5">
              {workspaceChannels.map((ws) => (
                <Link
                  key={ws.name}
                  href={ws.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                >
                  <span className={cn("w-2 h-2 rounded-full shrink-0", ws.color)} />
                  <span className="truncate">{ws.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Get Help & Settings */}
        <div className="px-3 py-2 space-y-0.5 border-t border-zinc-100">
          <Link
            href="/knowledge"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-zinc-400 stroke-[1.8]" />
            <span>Rate Cards &amp; Knowledge</span>
          </Link>
          <Link
            href="/settings/workspace"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            <Settings className="h-4 w-4 text-zinc-400 stroke-[1.8]" />
            <span>Settings</span>
          </Link>
        </div>

        {/* Bottom User & Workspace switcher */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/50">
          <div className="relative">
            <button
              onClick={() => setWsMenuOpen(!wsMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200/80 text-left hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="h-7 w-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user?.name?.charAt(0) || "O"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-zinc-900 truncate">
                    {currentWorkspace?.name || "JidoSapp HQ"}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate font-mono">
                    onos.jidosaap.xyz
                  </p>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            </button>

            {wsMenuOpen && (
              <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg p-1.5 z-20">
                <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase">
                  Workspaces ({workspaces.length})
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      switchWorkspace(ws.id);
                      setWsMenuOpen(false);
                      setIsMobileOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors",
                      ws.id === currentWorkspace?.id
                        ? "bg-zinc-100 text-zinc-950 font-semibold"
                        : "hover:bg-zinc-50 text-zinc-700"
                    )}
                  >
                    <span className="truncate">{ws.name}</span>
                    <span className="text-[10px] text-zinc-400 capitalize">{ws.role}</span>
                  </button>
                ))}
                <div className="pt-1 mt-1 border-t border-zinc-100">
                  <button
                    onClick={logout}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
