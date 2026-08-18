import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getQuizzesByCourse, createQuiz } from "@/lib/server/courses"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sParams = await searchParams
    const courseId = sParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    const quizzes = await getQuizzesByCourse(courseId)
    return NextResponse.json(quizzes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Ensure course field is present
    if (!data.course) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    const quiz = await createQuiz(data)

    return NextResponse.json(quiz)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
