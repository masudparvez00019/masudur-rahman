import mongoose, { Schema } from "mongoose"

// Schema for individual messages
const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
)

// Schema for chat conversations
const ConversationSchema = new Schema(
  {
    userId: {
      type: String,
      required: false, // Can be null for anonymous users
    },
    userName: {
      type: String,
      default: "Anonymous User",
    },
    userEmail: {
      type: String,
      required: false,
    },
    messages: [MessageSchema],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Schema for AI settings
const AISettingsSchema = new Schema(
  {
    systemPrompt: {
      type: String,
      required: true,
      default: "You are an AI assistant representing the portfolio owner. Be helpful, friendly, and professional.",
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 1,
    },
    maxTokens: {
      type: Number,
      default: 1024,
      min: 100,
      max: 8192,
    },
    modelName: {
      type: String,
      default: "gemini-2.0-flash-lite",
    },
    personalityTraits: {
      type: [String],
      default: ["helpful", "friendly", "professional"],
    },
    knowledgeAreas: {
      type: [String],
      default: ["web development", "software engineering"],
    },
    welcomeMessage: {
      type: String,
      default: "Hi there! I'm the AI assistant for this portfolio. How can I help you today?",
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

// Create models if they don't exist
const ChatMessage = mongoose.models.ChatMessage || mongoose.model("ChatMessage", MessageSchema)
const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema)
const AISettings = mongoose.models.AISettings || mongoose.model("AISettings", AISettingsSchema)

export { ChatMessage, Conversation, AISettings }

