import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getTopResources } from "@/lib/server/analytics"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get parameters from URL
    const url = new URL(request.url)
    const resourceType = url.searchParams.get("type") || "course"
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    const topResources = await getTopResources(resourceType, limit)
    return NextResponse.json({ topResources })
  } catch (error: any) {
    console.error("Error getting top resources:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
