import mongoose, { Schema, type Document, type Model } from "mongoose"

// Interface for the document
export interface ICourseCategory extends Document {
  name: string
  slug: string
  description?: string
  image?: string
  parentCategory?: mongoose.Types.ObjectId | null
  order: number
  createdAt: Date
  updatedAt: Date
}

// Schema definition
const CourseCategorySchema = new Schema<ICourseCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: "CourseCategory", default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Create or retrieve the model
export const CourseCategory: Model<ICourseCategory> =
  mongoose.models.CourseCategory || mongoose.model<ICourseCategory>("CourseCategory", CourseCategorySchema)

  