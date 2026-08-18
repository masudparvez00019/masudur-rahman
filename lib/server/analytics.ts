import { connectToDB } from "../mongodb"
import { Analytics } from "../models/analytics"
import { Types } from "mongoose"
import { serializeDocument } from "../utils"
import { EventType } from "../types/analytics"


// Track an event
export async function trackEvent(eventData: {
  eventType: EventType
  userId?: string
  resourceId?: string
  resourceType?: string
  metadata?: any
  userAgent?: string
  ipAddress?: string
  referrer?: string
  path?: string
}) {
  try {
    await connectToDB()

    const event = new Analytics({
      ...eventData,
      userId: eventData.userId ? new Types.ObjectId(eventData.userId) : undefined,
      resourceId: eventData.resourceId ? new Types.ObjectId(eventData.resourceId) : undefined,
    })

    await event.save()
    return serializeDocument(event)
  } catch (error) {
    console.error("Error tracking event:", error)
    throw new Error("Failed to track event")
  }
}

// Get event counts by type for a date range
export async function getEventCountsByType(startDate: Date, endDate: Date) {
  try {
    await connectToDB()

    const result = await Analytics.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    return result.map((item) => ({
      eventType: item._id,
      count: item.count,
    }))
  } catch (error) {
    console.error("Error getting event counts:", error)
    throw new Error("Failed to get event counts")
  }
}

// Get daily event counts for a specific event type
export async function getDailyEventCounts(eventType: EventType, days = 30) {
  try {
    await connectToDB()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const result = await Analytics.aggregate([
      {
        $match: {
          eventType,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])

    // Format the results into a more usable structure
    return result.map((item) => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day)
      return {
        date: date.toISOString().split("T")[0],
        count: item.count,
      }
    })
  } catch (error) {
    console.error("Error getting daily event counts:", error)
    throw new Error("Failed to get daily event counts")
  }
}

// Get top resources by views
export async function getTopResources(resourceType: string, limit = 10) {
  try {
    await connectToDB()

    const result = await Analytics.aggregate([
      {
        $match: {
          resourceType,
          eventType: {
            $in: [
              EventType.COURSE_VIEW,
              EventType.BLOG_VIEW,
              EventType.PROJECT_VIEW,
              EventType.TUTORIAL_VIEW,
              EventType.LESSON_VIEW,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$resourceId",
          views: { $sum: 1 },
        },
      },
      {
        $sort: { views: -1 },
      },
      {
        $limit: limit,
      },
    ])

    return result
  } catch (error) {
    console.error("Error getting top resources:", error)
    throw new Error("Failed to get top resources")
  }
}

// Get user activity stats
export async function getUserActivityStats(days = 30) {
  try {
    await connectToDB()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total active users
    const activeUsers = await Analytics.aggregate([
      {
        $match: {
          userId: { $exists: true, $ne: null },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$userId",
        },
      },
      {
        $count: "count",
      },
    ])

    // Get new user registrations
    const newUsers = await Analytics.aggregate([
      {
        $match: {
          eventType: EventType.USER_REGISTRATION,
          createdAt: { $gte: startDate },
        },
      },
      {
        $count: "count",
      },
    ])

    // Get daily active users
    const dailyActiveUsers = await Analytics.aggregate([
      {
        $match: {
          userId: { $exists: true, $ne: null },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])

    // Format the daily active users data
    const formattedDailyActiveUsers = dailyActiveUsers.map((item) => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day)
      return {
        date: date.toISOString().split("T")[0],
        count: item.count,
      }
    })

    return {
      activeUsers: activeUsers.length > 0 ? activeUsers[0].count : 0,
      newUsers: newUsers.length > 0 ? newUsers[0].count : 0,
      dailyActiveUsers: formattedDailyActiveUsers,
    }
  } catch (error) {
    console.error("Error getting user activity stats:", error)
    throw new Error("Failed to get user activity stats")
  }
}

// Get revenue stats
export async function getRevenueStats(days = 30) {
  try {
    await connectToDB()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total revenue
    const totalRevenue = await Analytics.aggregate([
      {
        $match: {
          eventType: EventType.PAYMENT,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$metadata.amount" },
        },
      },
    ])

    // Get daily revenue
    const dailyRevenue = await Analytics.aggregate([
      {
        $match: {
          eventType: EventType.PAYMENT,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          total: { $sum: "$metadata.amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])

    // Format the daily revenue data
    const formattedDailyRevenue = dailyRevenue.map((item) => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day)
      return {
        date: date.toISOString().split("T")[0],
        amount: item.total,
      }
    })

    return {
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      dailyRevenue: formattedDailyRevenue,
    }
  } catch (error) {
    console.error("Error getting revenue stats:", error)
    throw new Error("Failed to get revenue stats")
  }
}

// Get analytics overview
export async function getAnalyticsOverview(days = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const endDate = new Date()

    const [eventCounts, userStats, revenueStats] = await Promise.all([
      getEventCountsByType(startDate, endDate),
      getUserActivityStats(days),
      getRevenueStats(days),
    ])

    return {
      eventCounts,
      userStats,
      revenueStats,
    }
  } catch (error) {
    console.error("Error getting analytics overview:", error)
    throw new Error("Failed to get analytics overview")
  }
}
