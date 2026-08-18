import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ILesson extends Document {
  title: string
  description?: string
  chapter: mongoose.Types.ObjectId
  course: mongoose.Types.ObjectId
  order: number
  videoUrl?: string
  videoType: "upload" | "external"
  duration: string
  isPublished: boolean
  isFree: boolean
  createdAt: Date
  updatedAt: Date
}

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    description: { type: String },
    chapter: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, default: 0 },
    videoUrl: { type: String },
    videoType: { type: String, enum: ["upload", "external"], default: "upload" },
    duration: { type: String },
    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Lesson: Model<ILesson> = mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema)
