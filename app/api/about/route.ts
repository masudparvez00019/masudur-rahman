import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getAboutData, updateAboutData } from "@/lib/server/about"

export async function GET() {
  try {
    const about = await getAboutData()
    return NextResponse.json(about)
  } catch (error) {
    console.error("Error in GET /api/about:", error)
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const data = await request.json()

    // Update about data
    const updatedAbout = await updateAboutData(data)

    return NextResponse.json(updatedAbout)
  } catch (error) {
    console.error("Error in PUT /api/about:", error)
    return NextResponse.json({ error: "Failed to update about data" }, { status: 500 })
  }
}

