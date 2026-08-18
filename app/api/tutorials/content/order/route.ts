import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { updateTutorialOrder } from "@/lib/server/tutorials"

export async function PUT(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { topicId, tutorialIds } = await request.json()

    if (!topicId || !Array.isArray(tutorialIds) || tutorialIds.length === 0) {
      return NextResponse.json({ error: "Topic ID and tutorial IDs are required" }, { status: 400 })
    }

    const result = await updateTutorialOrder(topicId, tutorialIds)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error updating tutorial order:", error)
    return NextResponse.json({ error: error.message || "Failed to update tutorial order" }, { status: 500 })
  }
}
