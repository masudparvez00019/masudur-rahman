import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDB } from "@/lib/mongodb"
import { Enrollment } from "@/lib/models/enrollment"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Find completed enrollments
    const completedEnrollments = await Enrollment.find({
      user: session.user.id,
      completedAt: { $exists: true },
    })
      .populate("course", "title slug featuredImage")
      .sort({ completedAt: -1 })
      .lean()

    // Transform to certificates format
    const certificates = completedEnrollments.map((enrollment) => ({
      _id: enrollment._id,
      course: enrollment.course,
      completedAt: enrollment.completedAt,
      certificateId: `CERT-${enrollment._id.toString().substring(0, 8).toUpperCase()}`,
      certificateUrl: `/api/user/certificates/${enrollment._id}/download`,
    }))

    return NextResponse.json(certificates)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
