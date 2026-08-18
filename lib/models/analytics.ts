import mongoose, { Schema } from "mongoose"
import { EventType } from "../types/analytics"

const AnalyticsSchema = new Schema(
  {
    eventType: {
      type: String,
      enum: Object.values(EventType),
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Not required as guests can generate events
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      required: false, // The ID of the resource being interacted with (course, blog, etc.)
    },
    resourceType: {
      type: String,
      enum: ["course", "lesson", "quiz", "blog", "project", "tutorial", "chat", "user", "search", "other"],
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed, // Additional data specific to the event
      default: {},
    },
    userAgent: {
      type: String,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    referrer: {
      type: String,
      required: false,
    },
    path: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for faster queries
AnalyticsSchema.index({ eventType: 1, createdAt: -1 })
AnalyticsSchema.index({ resourceType: 1, resourceId: 1 })
AnalyticsSchema.index({ userId: 1 })
AnalyticsSchema.index({ createdAt: 1 })

export const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema)
