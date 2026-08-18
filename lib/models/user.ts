import mongoose, { Schema, models } from "mongoose"

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password?: string
  image?: string
  isAdmin: boolean
  bio?: string
  location?: string
  lastLogin?: Date
  loginHistory?: Array<{
    timestamp: Date
    ip?: string
    userAgent?: string
  }>
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
    },
    loginHistory: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ip: String,
        userAgent: String,
      },
    ],
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
)

export const User = models.User || mongoose.model<IUser>("User", userSchema)
