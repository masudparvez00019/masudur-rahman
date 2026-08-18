import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getTutorialTopics, createTutorialTopic, checkAdminAccess } from "@/lib/server/tutorials"
import { invalidateTopicsCache } from "@/lib/utils/cache-invalidation"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sParams = await searchParams
    const includeUnpublished = sParams.get("includeUnpublished") === "true"

    // Check if user has access to unpublished content
    if (includeUnpublished) {
      const hasAccess = await checkAdminAccess()
      if (!hasAccess) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    const topics = await getTutorialTopics(includeUnpublished)
    return NextResponse.json(topics)
  } catch (error: any) {
    console.error("Error fetching tutorial topics:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch tutorial topics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    console.log("Session:", session)
    if (!session || !session.user || session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.slug || !data.description) {
      return NextResponse.json({ error: "Title, slug, and description are required" }, { status: 400 })
    }

    // Create slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }

    const topic = await createTutorialTopic(data, session.user.id)
    
    // Invalidate cache after creating new topic
    await invalidateTopicsCache()
    
    return NextResponse.json(topic)
  } catch (error: any) {
    console.error("Error creating tutorial topic:", error)
    return NextResponse.json({ error: error.message || "Failed to create tutorial topic" }, { status: 500 })
  }
}
