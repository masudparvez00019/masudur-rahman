// import { type NextRequest, NextResponse } from "next/server"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth-options"
// import { submitQuizAttempt } from "@/lib/server/courses"

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)

//     // Check if user is authenticated
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const data = await request.json()
//     const { courseId, quizId, score } = data

//     if (!courseId || !quizId || score === undefined) {
//       return NextResponse.json({ error: "Course ID, Quiz ID, and score are required" }, { status: 400 })
//     }

//     const result = await submitQuizAttempt(session.user.id, courseId, quizId, score)
//     return NextResponse.json(result)
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { Enrollment } from "@/lib/models/enrollment"
import { Quiz } from "@/lib/models/quiz"
import { connectToDB } from "@/lib/mongodb"
import mongoose from "mongoose"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { quizId, courseId, score } = body

    if (!quizId || !courseId || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDB()

    // Find the quiz to get the passing score
    const quiz = await Quiz.findById(quizId).lean()
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Check if the user passed the quiz
    const passed = score >= quiz.passingScore

    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    })

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Check if the user has already attempted this quiz
    const existingAttemptIndex = enrollment.quizAttempts?.findIndex((attempt) => attempt.quiz.toString() === quizId)

    const now = new Date()

    if (existingAttemptIndex !== -1 && existingAttemptIndex !== undefined) {
      // Update existing attempt
      enrollment.quizAttempts[existingAttemptIndex].score = score
      enrollment.quizAttempts[existingAttemptIndex].passed = passed
      enrollment.quizAttempts[existingAttemptIndex].attemptedAt = now
    } else {
      // Add new attempt
      if (!enrollment.quizAttempts) {
        enrollment.quizAttempts = []
      }

      enrollment.quizAttempts.push({
        quiz: new mongoose.Types.ObjectId(quizId),
        score,
        passed,
        attemptedAt: now,
      })
    }

    // If this is the final quiz and the user passed, mark the course as completed
    if (passed && !quiz.chapter && !quiz.lesson) {
      enrollment.completed = true
      enrollment.completedAt = now
    }

    await enrollment.save()

    return NextResponse.json({
      success: true,
      passed,
      score,
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
