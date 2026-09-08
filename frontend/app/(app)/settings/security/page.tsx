"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { Shield, Monitor, Clock, MapPin, LogOut, Activity } from "lucide-react";
import { api } from "@/lib/api";

export default function SecurityPage() {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any[]>("/analytics/activity", { limit: 30 }).then((res) => {
      if (res.success && res.data) setActivity(res.data);
      setLoading(false);
    });
  }, []);

  const handleRevokeAllSessions = async () => {
    if (!confirm("This will log you out of all sessions. Continue?")) return;
    await api.post("/auth/logout");
    window.location.href = "/login";
  };

  const ACTION_LABELS: Record<string, { label: string; color: string }> = {
    user_login:            { label: "Sign in",               color: "text-emerald-600" },
    user_registered:       { label: "Registration",          color: "text-blue-600" },
    workspace_created:     { label: "Workspace created",     color: "text-violet-600" },
    whatsapp_connected:    { label: "WhatsApp connected",    color: "text-emerald-600" },
    whatsapp_disconnected: { label: "WhatsApp disconnected", color: "text-amber-600" },
    automation_created:    { label: "Automation created",    color: "text-blue-600" },
    automation_enabled:    { label: "Automation enabled",    color: "text-emerald-600" },
    automation_disabled:   { label: "Automation disabled",   color: "text-amber-600" },
    ai_agent_created:      { label: "AI agent created",      color: "text-violet-600" },
    ai_agent_modified:     { label: "AI agent modified",     color: "text-amber-600" },
    api_connection_created:{ label: "API connection added",  color: "text-blue-600" },
    subscription_activated:{ label: "Subscription upgraded", color: "text-emerald-600" },
    contact_created:       { label: "Contact added",         color: "text-zinc-600" },
    contact_deleted:       { label: "Contact deleted",       color: "text-red-600" },
    member_invited:        { label: "Member invited",        color: "text-blue-600" },
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Security</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Audit logs and session management</p>
      </div>

      {/* Security status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {[
            { label: "Password hashing",     desc: "Argon2id (secure)",          status: "good" },
            { label: "Session tokens",        desc: "HS256 JWT, 7-day expiry",    status: "good" },
            { label: "API credentials",       desc: "AES-256-GCM encrypted",      status: "good" },
            { label: "Webhook signatures",    desc: "HMAC-SHA256 verified",        status: "good" },
            { label: "Tenant isolation",      desc: "Row-level workspace scoping", status: "good" },
            { label: "Rate limiting",         desc: "Active on auth endpoints",    status: "good" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-zinc-900">{item.label}</p>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
              <Badge variant="success">Enabled</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Active Sessions
            </CardTitle>
            <Button
              size="sm"
              variant="danger"
              onClick={handleRevokeAllSessions}
              className="gap-1.5 text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              Revoke All Sessions
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-zinc-500">
            Session tokens expire after 7 days. Use "Revoke All Sessions" to force re-authentication on all devices.
          </p>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse py-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-100 mt-1 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-zinc-100 rounded w-1/3" />
                    <div className="h-2.5 bg-zinc-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="text-xs text-zinc-400 py-4 text-center">No audit events recorded yet</p>
          ) : (
            <div className="divide-y divide-zinc-100 max-h-96 overflow-y-auto">
              {activity.map((event, idx) => {
                const conf = ACTION_LABELS[event.action] || { label: event.action, color: "text-zinc-600" };
                return (
                  <div key={idx} className="flex items-start gap-3 py-3">
                    <div className={`h-2 w-2 rounded-full bg-current mt-1.5 shrink-0 ${conf.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${conf.color}`}>{conf.label}</p>
                      {event.resource_type && (
                        <p className="text-[10px] text-zinc-500">
                          {event.resource_type}
                          {event.user_name && <> · by {event.user_name}</>}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 shrink-0">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(event.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
