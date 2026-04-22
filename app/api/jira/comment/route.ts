import { NextResponse } from "next/server";

/**
 * POST /api/jira/comment
 * 
 * Add a comment to an existing Jira issue.
 * Used when admin adds more information to a ticket.
 * 
 * TODO: Implement Jira API integration
 * - Connect to Jira Cloud API
 * - Add comment to issue
 * - Attach any new evidence files
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Validate request body
    // TODO: Format comment text
    // TODO: Upload attachments
    // TODO: Add comment to Jira issue
    
    return NextResponse.json({
      success: true,
      commentId: `comment-${Date.now()}`,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("[jira/comment] Error:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
