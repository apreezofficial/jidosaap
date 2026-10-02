"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CapabilitiesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/features");
  }, [router]);

  return (
    <div className="py-24 text-center text-xs text-zinc-400">
      Redirecting to platform features...
    </div>
  );
}
