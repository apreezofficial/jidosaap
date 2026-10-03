"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { CommandMenu } from "@/components/ui/command-menu";

import { SidebarProvider } from "@/lib/sidebar-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-sm mb-3 relative overflow-hidden animate-pulse">
          <span className="font-serif">自</span>
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#2563eb] rounded-full"></span>
        </div>
        <p className="text-xs text-zinc-400 font-medium tracking-tight">Initializing JidoSapp...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#f4f5f7]">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 lg:p-8 min-w-0">{children}</main>
        </div>
        <CommandMenu />
      </div>
    </SidebarProvider>
  );
}
