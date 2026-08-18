import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getTutorialsByTopic, createTutorial, checkAdminAccess } from "@/lib/server/tutorials"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sParams = await searchParams
    const topicId = sParams.get("topicId")
    const includeUnpublished = sParams.get("includeUnpublished") === "true"

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required" }, { status: 400 })
    }

    // Check if user has access to unpublished content
    if (includeUnpublished) {
      const hasAccess = await checkAdminAccess()
      if (!hasAccess) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    const tutorials = await getTutorialsByTopic(topicId, includeUnpublished)
    return NextResponse.json(tutorials)
  } catch (error: any) {
    console.error("Error fetching tutorials:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch tutorials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.slug || !data.content || !data.topic) {
      return NextResponse.json({ error: "Title, slug, content, and topic are required" }, { status: 400 })
    }

    // Create slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }

    const tutorial = await createTutorial(data, session.user.id)
    return NextResponse.json(tutorial)
  } catch (error: any) {
    console.error("Error creating tutorial:", error)
    return NextResponse.json({ error: error.message || "Failed to create tutorial" }, { status: 500 })
  }
}
