import mongoose, { Schema, models } from "mongoose"

export interface IContact extends mongoose.Document {
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const Contact = models.Contact || mongoose.model<IContact>("Contact", contactSchema)

