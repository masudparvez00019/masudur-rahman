import { type NextRequest, NextResponse } from "next/server"
import { getHeader, upsertHeader } from "@/lib/server/header"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET: Fetch the header data
export async function GET() {
  try {
    const header = await getHeader()

    if (!header) {
      return NextResponse.json({ message: "Header not found" }, { status: 404 })
    }

    return NextResponse.json(header)
  } catch (error) {
    console.error("Error in GET /api/header:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

// POST: Create or update the header data
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    // Debug the session
    console.log("Session in header API:", session)

    // Check if user is admin - using isAdmin instead of role
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the request body
    const headerData = await request.json()

    // Log the received data
    console.log("Received header data:", JSON.stringify(headerData))

    // Update the header
    const result = await upsertHeader(headerData)

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 })
    }

    return NextResponse.json({ message: result.message }, { status: 200 })
  } catch (error) {
    console.error("Error in POST /api/header:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
