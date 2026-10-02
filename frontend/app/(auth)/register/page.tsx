"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainModified, setSubdomainModified] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(name, email, password, workspaceName);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error?.message || "Registration failed. Please check your details.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Get started with JidoSapp
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Launch your automated WhatsApp business infrastructure in minutes.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Full Name"
          type="text"
          placeholder="Kenji Sato"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="kenji@tokyoretail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Company / Workspace Name"
          type="text"
          placeholder="e.g. Penna Tech or Shola Studio"
          value={workspaceName}
          onChange={(e) => {
            setWorkspaceName(e.target.value);
            if (!subdomainModified) {
              setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
            }
          }}
          required
        />

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Dedicated Subdomain (jidosaap.xyz)
          </label>
          <div className="flex items-center rounded-xl border border-zinc-200 bg-white px-3 focus-within:border-zinc-950 focus-within:ring-1 focus-within:ring-zinc-950">
            <span className="text-xs font-semibold text-zinc-400">https://</span>
            <input
              type="text"
              placeholder="brand"
              value={subdomain}
              onChange={(e) => {
                setSubdomainModified(true);
                setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
              }}
              className="w-full h-10 px-1 text-xs font-bold text-zinc-900 focus:outline-none"
            />
            <span className="text-xs font-bold text-rose-600 font-mono bg-rose-50 px-2 py-0.5 rounded">
              .jidosaap.xyz
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">
            Your team and bot endpoints will resolve at this isolated domain.
          </span>
        </div>

        <Input
          label="Password (min. 8 characters)"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>Official Meta WhatsApp Cloud API integration</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>Dedicated isolated workspace on *.jidosaap.xyz</span>
          </div>
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Create Business Workspace
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-500">
        Already registered?{" "}
        <Link
          href="/login"
          className="text-rose-600 hover:text-rose-700 font-semibold"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
}
