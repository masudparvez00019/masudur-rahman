import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ICourse extends Document {
  title: string
  slug: string
  subtitle?: string
  description: string
  price: number
  salePrice?: number
  isFree: boolean
  isPublished: boolean
  featuredImage: string
  previewVideo?: string
  duration: string
  totalLessons: number
  level: "beginner" | "intermediate" | "advanced" | "all-levels"
  category: mongoose.Types.ObjectId
  tags: string[]
  whatYouWillLearn: string[]
  requirements: string[]
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    salePrice: { type: Number },
    isFree: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    featuredImage: { type: String, required: true },
    previewVideo: { type: String },
    duration: { type: String, required: true },
    totalLessons: { type: Number, default: 0 },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all-levels"],
      default: "all-levels",
    },
    category: { type: Schema.Types.ObjectId, ref: "CourseCategory", required: true },
    tags: [{ type: String }],
    whatYouWillLearn: [{ type: String }],
    requirements: [{ type: String }],
  },
  { timestamps: true },
)

export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema)
