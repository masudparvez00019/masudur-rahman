import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDB } from "@/lib/mongodb"
import { Chapter } from "@/lib/models/chapter"
import { Lesson } from "@/lib/models/lesson"

export async function GET(request: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  const { id, lessonId } = await params
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Get all chapters for the course
    const chapters = await Chapter.find({ course: id }).sort({ order: 1 }).lean()
    const chapterIds = chapters.map((chapter) => chapter._id)

    // Get all lessons for the course
    const lessons = await Lesson.find({ chapter: { $in: chapterIds } })
      .populate("chapter", "title")
      .sort({ "chapter.order": 1, order: 1 })
      .lean()

    // Find the current lesson index
    const currentIndex = lessons.findIndex((lesson) => lesson._id.toString() === lessonId)

    if (currentIndex === -1) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Get previous and next lessons
    const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null
    const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

    return NextResponse.json({
      prev,
      next,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
