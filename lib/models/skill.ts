import mongoose, { Schema, models } from "mongoose"

export interface ISkill extends mongoose.Document {
  title: string
  icon: string
  skills: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

const skillSchema = new Schema<ISkill>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
    },
    skills: {
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

export const Skill = models.Skill || mongoose.model<ISkill>("Skill", skillSchema)

