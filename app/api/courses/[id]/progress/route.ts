import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDB } from "@/lib/mongodb"
import { Enrollment } from "@/lib/models/enrollment"
import { Chapter } from "@/lib/models/chapter"
import { Lesson } from "@/lib/models/lesson"
import { Quiz } from "@/lib/models/quiz"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = new URL(request.url).searchParams
    const userId = searchParams.get("userId") || session.user.id

    // Only allow users to access their own progress or admins to access any progress
    if (userId !== session.user.id && session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: id,
    }).lean()

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Get all chapters for the course
    const chapters = await Chapter.find({ course: id }).lean()
    const chapterIds = chapters.map((chapter) => chapter._id)

    // Get all lessons for the course
    const lessons = await Lesson.find({ chapter: { $in: chapterIds } }).lean()
    const lessonIds = lessons.map((lesson) => lesson._id.toString())

    // Get all quizzes for the course
    const quizzes = await Quiz.find({ chapter: { $in: chapterIds } }).lean()
    const quizIds = quizzes.map((quiz) => quiz._id.toString())

    // Calculate lesson completion
    const completedLessons = enrollment.progress.filter((p: any) => p.completed).map((p: any) => p.lesson.toString())

    const lessonCompletionPercentage = lessonIds.length > 0 ? (completedLessons.length / lessonIds.length) * 100 : 0

    // Calculate quiz completion
    const passedQuizzes = enrollment.quizAttempts.filter((a: any) => a.passed).map((a: any) => a.quiz.toString())

    const quizCompletionPercentage = quizIds.length > 0 ? (passedQuizzes.length / quizIds.length) * 100 : 0

    // Calculate overall progress
    // If there are no quizzes, use only lesson completion
    // If there are both, use the average
    let overallProgress = 0
    if (lessonIds.length > 0 && quizIds.length > 0) {
      overallProgress = Math.round((lessonCompletionPercentage + quizCompletionPercentage) / 2)
    } else if (lessonIds.length > 0) {
      overallProgress = Math.round(lessonCompletionPercentage)
    } else if (quizIds.length > 0) {
      overallProgress = Math.round(quizCompletionPercentage)
    }

    return NextResponse.json({
      progress: overallProgress,
      lessonProgress: Math.round(lessonCompletionPercentage),
      quizProgress: Math.round(quizCompletionPercentage),
      completedLessons: completedLessons.length,
      totalLessons: lessonIds.length,
      passedQuizzes: passedQuizzes.length,
      totalQuizzes: quizIds.length,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
