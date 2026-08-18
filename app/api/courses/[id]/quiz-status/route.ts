// import { type NextRequest, NextResponse } from "next/server"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth-options"
// import { Enrollment } from "@/lib/models/enrollment"
// import { Quiz } from "@/lib/models/quiz"
// import { connectToDB } from "@/lib/mongodb"

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   const { id } = await params
//     try {
//     const session = await getServerSession(authOptions)
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const courseId = id
//     const userId = session.user.id
//     const url = new URL(request.url)

//     // Get query parameters
//     const lessonId = url.searchParams.get("lessonId")
//     const chapterId = url.searchParams.get("chapterId")
//     const isFinal = url.searchParams.get("final") === "true"

//     await connectToDB()

//     // Find the enrollment
//     const enrollment = await Enrollment.findOne({
//       user: userId,
//       course: courseId,
//     }).lean()

//     if (!enrollment) {
//       return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
//     }

//     // Find the appropriate quiz
//     const quizQuery: any = { course: courseId }

//     if (lessonId) {
//       quizQuery.lesson = lessonId
//     } else if (chapterId) {
//       quizQuery.chapter = chapterId
//       quizQuery.lesson = { $exists: false } // Chapter quiz, not lesson quiz
//     } else if (isFinal) {
//       quizQuery.chapter = { $exists: false }
//       quizQuery.lesson = { $exists: false }
//     } else {
//       return NextResponse.json({ error: "Invalid quiz type specified" }, { status: 400 })
//     }

//     const quiz = await Quiz.findOne(quizQuery).lean()

//     if (!quiz) {
//       return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
//     }

//     // Check if user has attempted this quiz
//     const quizAttempt = enrollment.quizAttempts?.find((attempt: any) => attempt.quiz.toString() === quiz._id.toString())

//     return NextResponse.json({
//       attempted: !!quizAttempt,
//       passed: quizAttempt?.passed || false,
//       score: quizAttempt?.score || 0,
//       attemptedAt: quizAttempt?.attemptedAt || null,
//     })
//   } catch (error) {
//     console.error("Error fetching quiz status:", error)
//     return NextResponse.json({ error: "Failed to fetch quiz status" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { Enrollment } from "@/lib/models/enrollment"
import { Quiz } from "@/lib/models/quiz"
import { connectToDB } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courseId = id
    const searchParams = request.nextUrl.searchParams
    const sParams = await searchParams
    const lessonId = sParams.get("lessonId")
    const chapterId = sParams.get("chapterId")
    const isFinal = sParams.get("final") === "true"

    await connectToDB()

    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      user: session.user.id,
      course: courseId,
    }).lean()

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Find the appropriate quiz
    let quiz
    if (lessonId) {
      quiz = await Quiz.findOne({ lesson: lessonId }).lean()
    } else if (chapterId) {
      quiz = await Quiz.findOne({ chapter: chapterId, lesson: { $exists: false } }).lean()
    } else if (isFinal) {
      quiz = await Quiz.findOne({ course: courseId, chapter: { $exists: false }, lesson: { $exists: false } }).lean()
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Check if the quiz has been attempted
    const quizAttempt = enrollment.quizAttempts?.find((attempt) => attempt.quiz.toString() === quiz._id.toString())

    return NextResponse.json({
      attempted: !!quizAttempt,
      passed: quizAttempt?.passed || false,
      score: quizAttempt?.score || 0,
      passingScore: quiz.passingScore,
    })
  } catch (error) {
    console.error("Error fetching quiz status:", error)
    return NextResponse.json({ error: "Failed to fetch quiz status" }, { status: 500 })
  }
}

