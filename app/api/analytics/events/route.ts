import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getEventCountsByType, getDailyEventCounts } from "@/lib/server/analytics"
import { EventType } from "@/lib/types/analytics"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get parameters from URL
    const url = new URL(request.url)
    const days = Number.parseInt(url.searchParams.get("days") || "30")
    const eventType = url.searchParams.get("eventType") as EventType | null

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    if (eventType) {
      // If event type is specified, get daily counts for that type
      const dailyCounts = await getDailyEventCounts(eventType, days)
      return NextResponse.json({ dailyCounts })
    } else {
      // Otherwise, get counts by type
      const eventCounts = await getEventCountsByType(startDate, endDate)
      return NextResponse.json({ eventCounts })
    }
  } catch (error: any) {
    console.error("Error getting event analytics:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
