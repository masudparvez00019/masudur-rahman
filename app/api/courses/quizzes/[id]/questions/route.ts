import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getQuizById, updateQuizQuestions } from "@/lib/server/courses"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
 
  try {
    const quizId = id
    const quiz = await getQuizById(quizId)

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Return just the questions array as plain objects
    const plainQuestions = quiz.questions.map((q) => ({
      _id: q._id.toString(),
      question: q.question,
      options: q.options,
      correctOption: q.correctOption,
      explanation: q.explanation,
    }))

    return NextResponse.json(plainQuestions)
  } catch (error) {
    console.error("Error fetching quiz questions:", error)
    return NextResponse.json({ error: "Failed to fetch quiz questions" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quizId = id
    const { questions } = await request.json()

    const updatedQuiz = await updateQuizQuestions(quizId, questions)

    if (!updatedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Return the updated questions as plain objects
    const plainQuestions = updatedQuiz.questions.map((q) => ({
      _id: q._id.toString(),
      question: q.question,
      options: q.options,
      correctOption: q.correctOption,
      explanation: q.explanation,
    }))

    return NextResponse.json(plainQuestions)
  } catch (error) {
    console.error("Error updating quiz questions:", error)
    return NextResponse.json({ error: "Failed to update quiz questions" }, { status: 500 })
  }
}
