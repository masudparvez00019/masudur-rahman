import "server-only"

import { Conversation, AISettings } from "../models/chat"
import { connectToDB } from "../mongodb" 

export async function getConversations(limit = 20, skip = 0, archived = false) {
  try {
    await connectToDB()
    const conversations = await Conversation.find({ isArchived: archived })
      .sort({ lastUpdated: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return JSON.parse(JSON.stringify(conversations))
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return []
  }
}

export async function getConversation(id: string) {
  try {
    await connectToDB()
    const conversation = await Conversation.findById(id).lean()

    if (!conversation) {
      return null
    }

    return JSON.parse(JSON.stringify(conversation))
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return null
  }
}

export async function getAISettings() {
  try {
    await connectToDB()
    let settings = await AISettings.findOne().lean()

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = new AISettings()
      await defaultSettings.save()
      settings = defaultSettings.toObject()
    }

    return JSON.parse(JSON.stringify(settings))
  } catch (error) {
    console.error("Error fetching AI settings:", error)
    return null
  }
}

export async function countConversations(archived = false) {
  try {
    await connectToDB()
    return await Conversation.countDocuments({ isArchived: archived })
  } catch (error) {
    console.error("Error counting conversations:", error)
    return 0
  }
}

export async function countNewConversations(days = 7) {
  try {
    await connectToDB()
    const date = new Date()
    date.setDate(date.getDate() - days)

    return await Conversation.countDocuments({
      createdAt: { $gte: date },
      isArchived: false,
    })
  } catch (error) {
    console.error("Error counting new conversations:", error)
    return 0
  }
}

