import { NextResponse } from "next/server";

/**
 * POST /api/jira/create
 * 
 * Create a new Jira issue for a confirmed bug report.
 * 
 * TODO: Implement Jira API integration
 * - Connect to Jira Cloud API
 * - Create issue in HUREP project
 * - Attach evidence files
 * - Set custom fields (module, platform, community, etc.)
 * - Return Jira issue key (HUREP-XX) - but display as Ticket-X to users
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Validate request body
    // TODO: Map form data to Jira fields
    // TODO: Upload attachments to Jira
    // TODO: Create Jira issue
    // TODO: Return issue key and ticket number
    
    const mockTicketNumber = Math.floor(Math.random() * 1000);
    
    return NextResponse.json({
      success: true,
      jiraKey: `HUREP-${mockTicketNumber}`, // Internal reference
      ticketNumber: mockTicketNumber, // User-facing number
      message: "Issue created successfully",
    });
  } catch (error) {
    console.error("[jira/create] Error:", error);
    return NextResponse.json({ error: "Failed to create Jira issue" }, { status: 500 });
  }
}
