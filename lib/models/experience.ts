import mongoose, { Schema, models } from "mongoose"

export interface IExperience extends mongoose.Document {
  position: string
  company: string
  duration: string
  location: string
  description: string[]
  tags: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

const experienceSchema = new Schema<IExperience>(
  {
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    company: {
      type: String,
      required: [true, "Company is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    description: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

export const Experience = models.Experience || mongoose.model<IExperience>("Experience", experienceSchema)

