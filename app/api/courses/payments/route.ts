import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { createPayment } from "@/lib/server/courses"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { courseId, paymentMethod, amount } = data

    if (!courseId || !paymentMethod || !amount) {
      return NextResponse.json({ error: "Course ID, payment method, and amount are required" }, { status: 400 })
    }

    const payment = await createPayment({
      user: session.user.id,
      course: courseId,
      paymentMethod,
      amount,
      status: "pending",
    })

    return NextResponse.json(payment)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
