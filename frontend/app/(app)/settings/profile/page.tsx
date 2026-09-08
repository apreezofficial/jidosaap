"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { initials } from "@/lib/utils";
import { User, Lock, Shield, Save, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, refreshUserData } = useAuth();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "" });
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    const res = await api.patch("/auth/profile", form);
    setSaving(false);
    if (res.success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
      await refreshUserData();
    } else {
      setError(res.error?.message ?? "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError("New passwords do not match");
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwError("Password must be at least 8 characters");
      return;
    }
    setSavingPw(true);
    setPwError(null);
    const res = await api.post("/auth/change-password", {
      current_password: pwForm.current_password,
      new_password: pwForm.new_password,
    });
    setSavingPw(false);
    if (res.success) {
      setPwSaved(true);
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setPwSaved(false), 2500);
    } else {
      setPwError(res.error?.message ?? "Failed to change password");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Profile</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage your personal account information</p>
      </div>

      {/* Avatar + Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xl font-bold">
              {initials(user?.name ?? "U")}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">{user?.name}</p>
              <p className="text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{error}</div>
          )}

          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Button
            onClick={handleSaveProfile}
            isLoading={saving}
            size="sm"
            className="gap-1.5 text-xs"
          >
            {profileSaved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {profileSaved ? "Saved!" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pwError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{pwError}</div>
          )}
          <Input
            label="Current Password"
            type="password"
            value={pwForm.current_password}
            onChange={(e) => setPwForm((f) => ({ ...f, current_password: e.target.value }))}
          />
          <Input
            label="New Password"
            type="password"
            value={pwForm.new_password}
            onChange={(e) => setPwForm((f) => ({ ...f, new_password: e.target.value }))}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={pwForm.confirm_password}
            onChange={(e) => setPwForm((f) => ({ ...f, confirm_password: e.target.value }))}
          />
          <Button
            onClick={handleChangePassword}
            isLoading={savingPw}
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
          >
            {pwSaved ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Shield className="h-3.5 w-3.5" />}
            {pwSaved ? "Password Updated!" : "Update Password"}
          </Button>
          <p className="text-[11px] text-zinc-400">
            Passwords are hashed with Argon2id. We never store plaintext credentials.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
