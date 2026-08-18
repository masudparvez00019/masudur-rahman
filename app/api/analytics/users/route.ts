import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getUserActivityStats } from "@/lib/server/analytics"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get days parameter from URL
    const url = new URL(request.url)
    const days = Number.parseInt(url.searchParams.get("days") || "30")

    const userStats = await getUserActivityStats(days)
    return NextResponse.json(userStats)
  } catch (error: any) {
    console.error("Error getting user analytics:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
