import { NextResponse } from "next/server";

/**
 * GET /api/jira/status
 * 
 * Get the current status of a Jira issue.
 * 
 * Query params:
 * - key: Jira issue key (HUREP-XX)
 * - ticketNumber: User-facing ticket number
 * 
 * TODO: Implement Jira API integration
 * - Connect to Jira Cloud API
 * - Fetch issue status
 * - Map Jira status to friendly status (Reported/Under review/Developing fix/Resolved)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const ticketNumber = searchParams.get("ticketNumber");
    
    // TODO: Fetch issue from Jira API
    // TODO: Map Jira status to user-friendly status
    
    // Status mapping:
    // "Open" | "To Do" -> "reported"
    // "In Progress" | "In Review" -> "under_review"
    // "In Development" -> "developing_fix"
    // "Done" | "Closed" | "Resolved" -> "resolved"
    
    return NextResponse.json({
      jiraKey: key || "HUREP-123",
      ticketNumber: ticketNumber || 123,
      status: "under_review", // Friendly status
      jiraStatus: "In Progress", // Original Jira status
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[jira/status] Error:", error);
    return NextResponse.json({ error: "Failed to get issue status" }, { status: 500 });
  }
}
