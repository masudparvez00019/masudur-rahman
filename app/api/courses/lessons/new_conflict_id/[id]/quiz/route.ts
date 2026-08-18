// import { type NextRequest, NextResponse } from "next/server"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth-options"
// import { Quiz } from "@/lib/models/quiz"
// import { connectToDB } from "@/lib/mongodb"

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   const { id } = await params
//     try {
//     const session = await getServerSession(authOptions)
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const lessonId = id

//     await connectToDB()

//     // Find quiz associated with this lesson
//     const quiz = await Quiz.findOne({ lesson: lessonId }).lean()

//     if (!quiz) {
//       return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
//     }

//     // Format the response
//     const formattedQuiz = {
//       _id: quiz._id.toString(),
//       title: quiz.title,
//       description: quiz.description,
//       passingScore: quiz.passingScore,
//       questions: quiz.questions.map((q: any) => ({
//         _id: q._id.toString(),
//         question: q.question,
//         options: q.options,
//         correctOption: q.correctOption,
//         explanation: q.explanation,
//       })),
//     }

//     return NextResponse.json(formattedQuiz)
//   } catch (error) {
//     console.error("Error fetching lesson quiz:", error)
//     return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { Quiz } from "@/lib/models/quiz"
import { connectToDB } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lessonId = id

    await connectToDB()

    // Find quiz associated with this lesson
    const quiz = await Quiz.findOne({ lesson: lessonId }).lean()

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Format the response
    const formattedQuiz = {
      _id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      questions: quiz.questions.map((q: any) => ({
        _id: q._id.toString(),
        question: q.question,
        options: q.options,
        correctOption: q.correctOption,
        explanation: q.explanation,
      })),
    }

    return NextResponse.json(formattedQuiz)
  } catch (error) {
    console.error("Error fetching lesson quiz:", error)
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}
