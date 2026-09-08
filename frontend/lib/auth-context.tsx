"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, ApiResponse } from "./api";
import { useRouter, usePathname } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  timezone?: string;
  role: "owner" | "admin" | "member" | "viewer";
}

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<ApiResponse>;
  register: (name: string, email: string, pass: string, wsName?: string) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  switchWorkspace: (wsId: string) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUserData = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("jidosapp_token") : null;
    if (!token) {
      setUser(null);
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get<{ user: User; workspaces: Workspace[] }>("/auth/me");
      if (res.success && res.data) {
        setUser(res.data.user);
        setWorkspaces(res.data.workspaces || []);

        // Resolve active workspace
        const savedWsId = localStorage.getItem("jidosapp_workspace_id");
        const matched = res.data.workspaces?.find((w) => w.id === savedWsId);
        const active = matched || res.data.workspaces?.[0] || null;

        if (active) {
          setCurrentWorkspace(active);
          api.setWorkspaceId(active.id);
        }
      } else {
        // Token invalid/expired
        api.setToken(null);
        api.setWorkspaceId(null);
        setUser(null);
        setCurrentWorkspace(null);
      }
    } catch {
      // Offline/fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.post<{
      user: User;
      token: string;
      workspaces: Workspace[];
      workspace: Workspace;
    }>("/auth/login", { email, password: pass });

    if (res.success && res.data) {
      api.setToken(res.data.token);
      setUser(res.data.user);
      setWorkspaces(res.data.workspaces || []);

      const activeWs = res.data.workspace || res.data.workspaces?.[0] || null;
      if (activeWs) {
        setCurrentWorkspace(activeWs);
        api.setWorkspaceId(activeWs.id);
      }
    }

    return res;
  };

  const register = async (name: string, email: string, pass: string, wsName?: string) => {
    const res = await api.post<{
      user: User;
      token: string;
      workspace: Workspace;
    }>("/auth/register", {
      name,
      email,
      password: pass,
      workspace_name: wsName,
    });

    if (res.success && res.data) {
      api.setToken(res.data.token);
      setUser(res.data.user);
      const ws = res.data.workspace;
      setWorkspaces([ws]);
      setCurrentWorkspace(ws);
      api.setWorkspaceId(ws.id);
    }

    return res;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    api.setToken(null);
    api.setWorkspaceId(null);
    setUser(null);
    setWorkspaces([]);
    setCurrentWorkspace(null);
    router.push("/login");
  };

  const switchWorkspace = (wsId: string) => {
    const target = workspaces.find((w) => w.id === wsId);
    if (target) {
      setCurrentWorkspace(target);
      api.setWorkspaceId(target.id);
      // Reload current page state to refetch workspace data
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspaces,
        currentWorkspace,
        isLoading,
        login,
        register,
        logout,
        switchWorkspace,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
