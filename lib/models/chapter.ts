import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IChapter extends Document {
  title: string
  description?: string
  course: mongoose.Types.ObjectId
  order: number
  isPublished: boolean
  isFree: boolean
  createdAt: Date
  updatedAt: Date
}

const ChapterSchema = new Schema<IChapter>(
  {
    title: { type: String, required: true },
    description: { type: String },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Chapter: Model<IChapter> = mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", ChapterSchema)
