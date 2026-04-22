import { NextResponse } from "next/server";

/**
 * GET /api/client
 * 
 * Search and retrieve client/community data from Notion.
 * 
 * Query params:
 * - q: Search query string
 * - id: Specific client ID to retrieve
 * 
 * TODO: Implement Notion API integration
 * - Connect to Notion API
 * - Query the clients/communities database
 * - Return matching results with instanceId, country, cxOwner
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const id = searchParams.get("id");
    
    // TODO: Connect to Notion API
    // TODO: Query clients database with search/filter
    // TODO: Return matching clients
    
    if (id) {
      // TODO: Fetch specific client by ID
      return NextResponse.json({
        id,
        name: "Demo Client",
        instanceId: "demo-instance-2024",
        country: "United States",
        cxOwner: "John Doe",
      });
    }
    
    if (query) {
      // TODO: Search clients by query
      return NextResponse.json({
        results: [
          {
            id: "1",
            name: "Demo Client",
            instanceId: "demo-instance-2024",
            country: "United States",
            cxOwner: "John Doe",
          },
        ],
      });
    }
    
    return NextResponse.json({ results: [] });
  } catch (error) {
    console.error("[client] Error:", error);
    return NextResponse.json({ error: "Client search failed" }, { status: 500 });
  }
}
