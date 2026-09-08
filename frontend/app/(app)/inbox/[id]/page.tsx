"use client";
// This redirect ensures /inbox/[id] opens the inbox with the conversation selected
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ConversationRedirect() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // Redirect to main inbox — the inbox page handles selectedId via state
    router.replace("/inbox");
  }, [id, router]);

  return null;
}
