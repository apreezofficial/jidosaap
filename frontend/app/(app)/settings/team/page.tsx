"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { initials, formatRelativeTime } from "@/lib/utils";
import { Users, Plus, Trash2, ChevronDown, Crown, Shield, User, Eye } from "lucide-react";
import { api } from "@/lib/api";

const ROLE_CONFIG: Record<string, { label: string; icon: any; variant: any; desc: string }> = {
  owner:  { label: "Owner",  icon: Crown,  variant: "default",   desc: "Full access + billing + deletion" },
  admin:  { label: "Admin",  icon: Shield, variant: "secondary", desc: "Manage users, integrations, automations" },
  member: { label: "Member", icon: User,   variant: "secondary", desc: "Create content, manage conversations" },
  viewer: { label: "Viewer", icon: Eye,    variant: "secondary", desc: "Read-only access" },
};

interface Member {
  membership_id: string;
  role: string;
  joined_at: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export default function TeamPage() {
  const { currentWorkspace, user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "member" });
  const [inviting, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    const res = await api.get<Member[]>("/workspace/members");
    if (res.success && res.data) setMembers(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleInvite = async () => {
    if (!inviteForm.email) return;
    setSending(true);
    setError(null);
    const res = await api.post("/workspace/members", inviteForm);
    setSending(false);
    if (res.success) {
      setSuccess(`Invitation sent to ${inviteForm.email}`);
      setInviteForm({ email: "", role: "member" });
      setShowInvite(false);
      fetchMembers();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(res.error?.message ?? "Failed to invite member");
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    await api.patch(`/workspace/members/${userId}`, { role: newRole });
    fetchMembers();
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this member from the workspace?")) return;
    await api.delete(`/workspace/members/${userId}`);
    fetchMembers();
  };

  const isOwner = currentWorkspace?.role === "owner";
  const isAdmin = currentWorkspace?.role === "admin" || isOwner;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Team Members</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage who has access to your workspace
          </p>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={() => setShowInvite(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Invite Member
          </Button>
        )}
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-xs text-emerald-700 font-medium">
          {success}
        </div>
      )}

      {/* Role guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(ROLE_CONFIG).map(([role, conf]) => {
              const Icon = conf.icon;
              return (
                <div key={role} className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                  <Icon className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">{conf.label}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{conf.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Members list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="h-9 w-9 rounded-full bg-zinc-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-100 rounded w-1/3" />
                    <div className="h-2.5 bg-zinc-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {members.map((member) => {
                const roleConf = ROLE_CONFIG[member.role] || ROLE_CONFIG.member;
                const RoleIcon = roleConf.icon;
                const isCurrentUser = member.user_id === user?.id;
                return (
                  <div key={member.membership_id} className="flex items-center gap-3 py-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {initials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-900">{member.name}</p>
                        {isCurrentUser && (
                          <span className="text-[10px] text-zinc-400">(you)</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">{member.email}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Joined {formatRelativeTime(member.joined_at)}
                      </p>
                    </div>

                    {/* Role selector */}
                    {isAdmin && member.role !== "owner" && !isCurrentUser ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.user_id, e.target.value)}
                        className="h-7 rounded-md border border-zinc-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                      >
                        {["admin", "member", "viewer"].map((r) => (
                          <option key={r} value={r}>{ROLE_CONFIG[r]?.label || r}</option>
                        ))}
                      </select>
                    ) : (
                      <Badge variant={roleConf.variant}>
                        <RoleIcon className="h-2.5 w-2.5 mr-1" />
                        {roleConf.label}
                      </Badge>
                    )}

                    {/* Remove */}
                    {isOwner && member.role !== "owner" && !isCurrentUser && (
                      <button
                        onClick={() => handleRemove(member.user_id)}
                        className="p-1.5 rounded text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInvite}
        onClose={() => { setShowInvite(false); setError(null); }}
        title="Invite Team Member"
        description="They must already have a JidoSapp account"
        maxWidth="sm"
      >
        <div className="space-y-3">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{error}</div>
          )}
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteForm.email}
            onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
          />
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">Role</label>
            <select
              className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
              value={inviteForm.role}
              onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value }))}
            >
              {["admin", "member", "viewer"].map((r) => (
                <option key={r} value={r}>{ROLE_CONFIG[r]?.label} — {ROLE_CONFIG[r]?.desc}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={() => setShowInvite(false)} className="flex-1 text-sm">Cancel</Button>
            <Button onClick={handleInvite} isLoading={inviting} className="flex-1 text-sm gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
