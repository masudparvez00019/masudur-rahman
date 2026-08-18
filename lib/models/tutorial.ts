import mongoose, { Schema, type Document, type Model } from "mongoose"

// Tutorial Topic Schema
export interface ITutorialTopic extends Document {
  title: string
  slug: string
  description: string
  image?: string
  order: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
}

const TutorialTopicSchema = new Schema<ITutorialTopic>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

// Tutorial Content Schema
export interface ITutorialContent extends Document {
  title: string
  slug: string
  content: string
  topic: mongoose.Types.ObjectId
  order: number
  isPublished: boolean
  metaDescription?: string
  tags?: string[]
  readTime?: number
  previousTutorial?: mongoose.Types.ObjectId | null
  nextTutorial?: mongoose.Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
  lastUpdatedBy?: mongoose.Types.ObjectId
}

const TutorialContentSchema = new Schema<ITutorialContent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    topic: { type: Schema.Types.ObjectId, ref: "TutorialTopic", required: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    metaDescription: { type: String },
    tags: [{ type: String }],
    readTime: { type: Number },
    previousTutorial: { type: Schema.Types.ObjectId, ref: "TutorialContent", default: null },
    nextTutorial: { type: Schema.Types.ObjectId, ref: "TutorialContent", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

// Create a compound index on topic and slug to ensure uniqueness within a topic
TutorialContentSchema.index({ topic: 1, slug: 1 }, { unique: true })

// Models
export const TutorialTopic: Model<ITutorialTopic> =
  mongoose.models.TutorialTopic || mongoose.model<ITutorialTopic>("TutorialTopic", TutorialTopicSchema)

export const TutorialContent: Model<ITutorialContent> =
  mongoose.models.TutorialContent || mongoose.model<ITutorialContent>("TutorialContent", TutorialContentSchema)
