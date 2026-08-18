import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getQuizzesByLesson } from "@/lib/server/courses"

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const { lessonId } = await params

  try {
    const quizzes = await getQuizzesByLesson(lessonId)
    return NextResponse.json(quizzes)
  } catch (error) {
    console.error("Error fetching lesson quizzes:", error)
    return NextResponse.json(
      { error: "Failed to fetch lesson quizzes" },
      { status: 500 }
    )
  }
}
