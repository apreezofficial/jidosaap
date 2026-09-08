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
          placeholder="Tokyo Retail Group"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          required
        />

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
            <span>14-day full feature trial, no credit card required</span>
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
