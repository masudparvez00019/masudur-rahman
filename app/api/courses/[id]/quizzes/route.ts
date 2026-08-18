import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getQuizzesByCourse, createQuiz } from "@/lib/server/courses"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const courseId = id
    const quizzes = await getQuizzesByCourse(courseId)

    // Convert MongoDB documents to plain objects
    const plainQuizzes = quizzes.map((quiz) => ({
      _id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      isPublished: quiz.isPublished,
      course: quiz.course.toString(),
      chapter: quiz.chapter ? quiz.chapter.toString() : null,
      lesson: quiz.lesson ? quiz.lesson.toString() : null,
      questionsCount: quiz.questions?.length || 0,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    }))

    return NextResponse.json(plainQuizzes)
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courseId = id
    const data = await request.json()

    // Ensure the course ID from the URL is used
    const quizData = {
      ...data,
      course: courseId,
    }

    const quiz = await createQuiz(quizData)

    // Convert to plain object
    const plainQuiz = {
      _id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      isPublished: quiz.isPublished,
      course: quiz.course.toString(),
      chapter: quiz.chapter ? quiz.chapter.toString() : null,
      lesson: quiz.lesson ? quiz.lesson.toString() : null,
      questionsCount: quiz.questions?.length || 0,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    }

    return NextResponse.json(plainQuiz)
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
