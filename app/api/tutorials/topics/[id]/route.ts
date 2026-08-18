import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { updateTutorialTopic, deleteTutorialTopic } from "@/lib/server/tutorials"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and authorization
    const { id } =await params
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const topic = await updateTutorialTopic(id, data)

    return NextResponse.json(topic)
  } catch (error: any) {
    console.error("Error updating tutorial topic:", error)
    return NextResponse.json({ error: error.message || "Failed to update tutorial topic" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and authorization
    const { id } =await params
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const result = await deleteTutorialTopic(id)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error deleting tutorial topic:", error)
    return NextResponse.json({ error: error.message || "Failed to delete tutorial topic" }, { status: 500 })
  }
}
