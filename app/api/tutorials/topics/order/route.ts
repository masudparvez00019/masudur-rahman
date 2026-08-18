import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { updateTopicOrder } from "@/lib/server/tutorials"

export async function PUT(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { topicIds } = await request.json()

    if (!Array.isArray(topicIds) || topicIds.length === 0) {
      return NextResponse.json({ error: "Invalid topic IDs" }, { status: 400 })
    }

    const result = await updateTopicOrder(topicIds)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error updating topic order:", error)
    return NextResponse.json({ error: error.message || "Failed to update topic order" }, { status: 500 })
  }
}
