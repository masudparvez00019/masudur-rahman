import { type NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb"
import { Conversation, AISettings } from "@/lib/models/chat"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { message, conversationId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    await connectToDB()

    // Get AI settings
    let aiSettings = await AISettings.findOne()
    if (!aiSettings) {
      aiSettings = new AISettings()
      await aiSettings.save()
    }

    if (!aiSettings.isEnabled) {
      return NextResponse.json({ error: "AI chat is currently disabled" }, { status: 403 })
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
    const model = genAI.getGenerativeModel({
      model: aiSettings.modelName,
    })

    let conversation

    if (conversationId) {
      // Find existing conversation
      conversation = await Conversation.findById(conversationId)
      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }
    } else {
      // Create new conversation
      conversation = new Conversation({
        userId: session?.user?.id || null,
        userName: session?.user?.name || "Anonymous User",
        userEmail: session?.user?.email || null,
        messages: [],
      })
    }

    // Add user message to conversation
    conversation.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    })

    // Construct a comprehensive system prompt that includes personality traits and knowledge areas
    let enhancedSystemPrompt = aiSettings.systemPrompt || ""

    // Add personality traits if available
    if (aiSettings.personalityTraits && aiSettings.personalityTraits.length > 0) {
      enhancedSystemPrompt += `\n\nYour personality traits are: ${aiSettings.personalityTraits.join(", ")}.`
    }

    // Add knowledge areas if available
    if (aiSettings.knowledgeAreas && aiSettings.knowledgeAreas.length > 0) {
      enhancedSystemPrompt += `\n\nYou have expertise in: ${aiSettings.knowledgeAreas.join(", ")}.`
    }

    // Prepare chat history for Gemini
    const chatHistory = conversation.messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    // Remove the latest user message (we'll send it separately)
    const historyForGemini = chatHistory.slice(0, -1)
    const userMessage = chatHistory[chatHistory.length - 1].parts[0].text

    // Check if history is valid (must start with user message)
    let validHistory = historyForGemini
    if (historyForGemini.length > 0 && historyForGemini[0].role === "model") {
      // If history starts with model message, we need to either:
      // 1. Remove it if there's only one message
      // 2. Start from the first user message
      if (historyForGemini.length === 1) {
        validHistory = [] // Empty history if only one model message
      } else {
        // Find the first user message
        const firstUserIndex = historyForGemini.findIndex((msg) => msg.role === "user")
        if (firstUserIndex > 0) {
          validHistory = historyForGemini.slice(firstUserIndex)
        } else {
          validHistory = [] // No user messages found, use empty history
        }
      }
    }

    // Start chat with valid history
    const chat = model.startChat({
      history: validHistory.length > 0 ? validHistory : undefined,
      generationConfig: {
        temperature: aiSettings.temperature,
        maxOutputTokens: aiSettings.maxTokens,
      },
    })

    // Send the message to Gemini with the enhanced system prompt
    const result = await chat.sendMessage(`${enhancedSystemPrompt}\n\nUser message: ${userMessage}`)
    const aiResponse = result.response.text()

    // Add AI response to conversation
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    })

    conversation.lastUpdated = new Date()
    await conversation.save()

    return NextResponse.json({
      conversationId: conversation._id,
      message: {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sParams = await searchParams
    const conversationId = sParams.get("conversationId")

    await connectToDB()

    if (conversationId) {
      const conversation = await Conversation.findById(conversationId)
      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }
      return NextResponse.json(conversation)
    } else {
      // If no conversationId, create a new conversation with welcome message
      const aiSettings = await AISettings.findOne()
       
      // Create a more personalized welcome message based on settings
      let welcomeMessage = aiSettings?.welcomeMessage || 
        "Hi there! I'm the AI assistant for this portfolio. How can I help you today?";
      
    //   // Add personality traits if available - fix for array handling
    //   if (aiSettings?.personalityTraits && aiSettings.personalityTraits.length > 0) {
    //     // Join the array with commas and make it lowercase
    //     const traitsString = aiSettings.personalityTraits.join(", ").toLowerCase();
    //     welcomeMessage += ` I'm ${traitsString}.`;
    //   }
      
      // Add knowledge areas if available - fix for array handling
      if (aiSettings?.knowledgeAreas && aiSettings.knowledgeAreas.length > 0) {
        // Join the array with commas
        const knowledgeString = aiSettings.knowledgeAreas.join(", ");
        welcomeMessage += ` I can help with topics related to ${knowledgeString}.`;
      }

      const newConversation = new Conversation({
        messages: [
          {
            role: "assistant",
            content: welcomeMessage,
            timestamp: new Date(),
          },
        ],
      })

      await newConversation.save()
      return NextResponse.json(newConversation)
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to retrieve conversation" }, { status: 500 })
  }
}

