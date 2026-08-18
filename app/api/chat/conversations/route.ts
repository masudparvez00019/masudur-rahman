import { type NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Conversation } from "@/lib/models/chat"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sParams = await searchParams
    const limit = Number.parseInt(sParams.get("limit") || "20")
    const skip = Number.parseInt(sParams.get("skip") || "0")
    const archived = sParams.get("archived") === "true"

    await connectToDB()

    const conversations = await Conversation.find({ isArchived: archived })
      .sort({ lastUpdated: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Conversation.countDocuments({ isArchived: archived })

    return NextResponse.json({
      conversations,
      total,
      limit,
      skip,
    })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

