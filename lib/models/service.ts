import mongoose, { Schema, models } from "mongoose"

export interface IService extends mongoose.Document {
  title: string
  description: string
  icon: string
  features: string[]
  price?: string
  isPopular?: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
    },
    features: {
      type: [String],
      default: [],
    },
    price: {
      type: String,
      default: "",
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

export const Service = models.Service || mongoose.model<IService>("Service", serviceSchema)

