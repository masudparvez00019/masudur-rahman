import { type NextRequest, NextResponse } from "next/server"
import { getFooter, upsertFooter } from "@/lib/server/footer"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET: Fetch the footer data
export async function GET() {
  try {
    const footer = await getFooter()

    if (!footer) {
      return NextResponse.json({ message: "Footer not found" }, { status: 404 })
    }

    return NextResponse.json(footer)
  } catch (error) {
    console.error("Error in GET /api/footer:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

// POST: Create or update the footer data
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    // Debug the session
    // console.log("Session in footer API:", session)

    // Check if user is admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the request body
    const footerData = await request.json()



    // Log the received data
    // console.log("Received footer data:", JSON.stringify(footerData))

    // Update the footer
    const result = await upsertFooter(footerData)

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 })
    }

    return NextResponse.json({ message: result.message }, { status: 200 })
  } catch (error) {
    console.error("Error in POST /api/footer:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
