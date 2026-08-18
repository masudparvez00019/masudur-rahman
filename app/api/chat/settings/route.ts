import { type NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { AISettings } from "@/lib/models/chat"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET() {
  try {
    await connectToDB()

    let settings = await AISettings.findOne()
    if (!settings) {
      settings = new AISettings()
      await settings.save()
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching AI settings:", error)
    return NextResponse.json({ error: "Failed to fetch AI settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    await connectToDB()

    let settings = await AISettings.findOne()
    if (!settings) {
      settings = new AISettings()
    }

    // Update settings with new data
    if (data.systemPrompt !== undefined) settings.systemPrompt = data.systemPrompt
    if (data.temperature !== undefined) settings.temperature = data.temperature
    if (data.maxTokens !== undefined) settings.maxTokens = data.maxTokens
    if (data.modelName !== undefined) settings.modelName = data.modelName
    if (data.personalityTraits !== undefined) settings.personalityTraits = data.personalityTraits
    if (data.knowledgeAreas !== undefined) settings.knowledgeAreas = data.knowledgeAreas
    if (data.welcomeMessage !== undefined) settings.welcomeMessage = data.welcomeMessage
    if (data.isEnabled !== undefined) settings.isEnabled = data.isEnabled

    await settings.save()

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating AI settings:", error)
    return NextResponse.json({ error: "Failed to update AI settings" }, { status: 500 })
  }
}

