import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { updateLessonProgress } from "@/lib/server/courses"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { courseId, lessonId, completed, watchedSeconds, lastPosition } = data

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: "Course ID and Lesson ID are required" }, { status: 400 })
    }

    const enrollment = await updateLessonProgress(session.user.id, courseId, lessonId, {
      completed,
      watchedSeconds,
      lastPosition,
    })

    return NextResponse.json(enrollment)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
