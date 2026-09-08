import React from "react";

// Legacy route — this page is superseded by app/(app)/dashboard
// Static export friendly (no client hooks)
export default function LegacyOverviewPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-zinc-400">Redirecting to dashboard…</p>
      <script dangerouslySetInnerHTML={{ __html: "window.location.replace('/dashboard')" }} />
    </div>
  );
}
