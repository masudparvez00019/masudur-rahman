import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { trackEvent } from "@/lib/server/analytics"
import { EventType } from "@/lib/types/analytics"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    // Validate required fields
    if (!data.eventType || !Object.values(EventType).includes(data.eventType)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
    }

    // Get IP and user agent
    const headers = new Headers(request.headers)
    const userAgent = headers.get("user-agent") || undefined
    const forwardedFor = headers.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : undefined
    const referrer = headers.get("referer") || undefined

    // Track the event
    const event = await trackEvent({
      ...data,
      userId: session?.user?.id,
      userAgent,
      ipAddress,
      referrer,
    })

    return NextResponse.json({ success: true, event })
  } catch (error: any) {
    console.error("Error tracking analytics event:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
