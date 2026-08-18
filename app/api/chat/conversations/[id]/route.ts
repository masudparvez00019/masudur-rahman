import { type NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Conversation } from "@/lib/models/chat"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    await connectToDB()

    const conversation = await Conversation.findById(id)
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { isArchived } = await request.json()

    await connectToDB()

    const conversation = await Conversation.findById(id)
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    conversation.isArchived = isArchived
    await conversation.save()

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error updating conversation:", error)
    return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await connectToDB()

    const result = await Conversation.findByIdAndDelete(id)
    if (!result) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting conversation:", error)
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 })
  }
}

