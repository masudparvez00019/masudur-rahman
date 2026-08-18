import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDB } from "@/lib/mongodb"
import { Enrollment } from "@/lib/models/enrollment"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const {id} = await params
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const enrollment = await Enrollment.findById(id)
      .populate("user", "name email")
      .populate("course", "title slug")
      .populate({
        path: "progress.lesson",
        select: "title duration",
      })
      .populate({
        path: "quizAttempts.quiz",
        select: "title passingScore",
      })
      .lean()

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    return NextResponse.json(enrollment)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
