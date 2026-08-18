import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getQuizzesByChapter } from "@/lib/server/courses"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  try {
    const quizzes = await getQuizzesByChapter(id)
    return NextResponse.json(quizzes)
  } catch (error) {
    console.error("Error fetching chapter quizzes:", error)
    return NextResponse.json(
      { error: "Failed to fetch chapter quizzes" },
      { status: 500 }
    )
  }
}
