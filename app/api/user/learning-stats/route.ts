import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDB } from "@/lib/mongodb"
import { Enrollment } from "@/lib/models/enrollment"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Get all enrollments for the user
    const enrollments = await Enrollment.find({ user: session.user.id }).lean()

    // Calculate stats
    const totalCourses = enrollments.length
    const completedCourses = enrollments.filter((e) => e.completedAt).length
    const inProgressCourses = totalCourses - completedCourses

    // Calculate total lessons completed
    let totalLessonsCompleted = 0
    let totalTimeSpent = 0 // in minutes
    let lastActivity: Date | null = null

    enrollments.forEach((enrollment) => {
      // Count completed lessons
      const completedLessons = enrollment.progress.filter((p) => p.completed)
      totalLessonsCompleted += completedLessons.length

      // Sum up watched time (convert seconds to minutes)
      enrollment.progress.forEach((p) => {
        totalTimeSpent += Math.round(p.watchedSeconds / 60)
      })

      // Find the most recent activity
      enrollment.progress.forEach((p) => {
        if (p.completedAt && (!lastActivity || new Date(p.completedAt) > lastActivity)) {
          lastActivity = new Date(p.completedAt)
        }
      })

      // Also check quiz attempts for activity
      if (enrollment.quizAttempts && enrollment.quizAttempts.length > 0) {
        enrollment.quizAttempts.forEach((a) => {
          if (a.attemptedAt && (!lastActivity || new Date(a.attemptedAt) > lastActivity)) {
            lastActivity = new Date(a.attemptedAt)
          }
        })
      }
    })

    return NextResponse.json({
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalLessonsCompleted,
      totalTimeSpent,
      lastActivity: lastActivity ? lastActivity.toISOString() : null,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
