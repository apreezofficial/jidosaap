// This Next.js API route proxies dashboard metrics from the PHP backend.
// It's kept for backward compatibility — the main dashboard uses /analytics/dashboard directly.
import { NextResponse } from "next/server";

export async function GET() {
  // Return minimal stub — real data comes from the PHP /analytics/dashboard endpoint
  return NextResponse.json({
    messagesProcessed: 0,
    messagesProcessedChange: "Connect WhatsApp to see live data",
    aiResolutionRate: "0%",
    aiResolutionNote: "Configure AI agent to track",
    leadsCaptured: 0,
    leadsChange: "No leads yet",
    automationExecutions: 0,
    automationFailures: 0,
  });
}
