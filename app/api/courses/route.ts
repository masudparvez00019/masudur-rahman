import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getAllCourses, createCourse } from "@/lib/server/courses"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sParams = await searchParams

    const options = {
      limit: sParams.get("limit") ? Number.parseInt(sParams.get("limit")!) : undefined,
      page: sParams.get("page") ? Number.parseInt(sParams.get("page")!) : undefined,
      category: sParams.get("category") || undefined,
      search: sParams.get("search") || undefined,
      isFree: sParams.get("isFree") ? sParams.get("isFree") === "true" : undefined,
      level: sParams.get("level") || undefined,
      sort: sParams.get("sort") || undefined,
    }

    const result = await getAllCourses(options)
    return NextResponse.json(result)
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
    const course = await createCourse(data)

    return NextResponse.json(course)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
