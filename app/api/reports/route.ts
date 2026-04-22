import { NextResponse } from "next/server";

/**
 * GET /api/reports
 * 
 * Get all reports/tickets for a specific community.
 * 
 * Query params:
 * - communityId: The community ID to filter reports by
 * 
 * TODO: Implement reports fetching
 * - Query Jira for issues with matching community
 * - Map to user-friendly format
 * - Sort by date (newest first)
 * - Map status to friendly labels
 * - Use sequential ticket numbers, not Jira keys
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get("communityId");
    
    if (!communityId) {
      return NextResponse.json({ error: "communityId is required" }, { status: 400 });
    }
    
    // TODO: Fetch issues from Jira with community filter
    // TODO: Map to Report format
    // TODO: Sort by date
    
    return NextResponse.json({
      reports: [
        {
          id: "1",
          ticketNumber: 1,
          communityId,
          module: "attendance",
          summary: "Clock-in button not working",
          status: "developing_fix",
          createdAt: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error("[reports] Error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
