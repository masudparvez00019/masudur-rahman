import mongoose, { Schema, models } from "mongoose"

export interface IProject extends mongoose.Document {
  _id: string
  title: string
  description: string
  longDescription?: string
  image: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: string
  features?: string[]
  screenshots?: string[]
  order: number
  category?: string
  completionDate?: string
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    longDescription: {
      type: String,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    demoUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    features: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    screenshots: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
    },
    completionDate: {
      type: String,
    },
  },
  { timestamps: true },
)

export const Project = models.Project || mongoose.model<IProject>("Project", projectSchema)

