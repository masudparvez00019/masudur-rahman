import { type NextRequest, NextResponse } from "next/server"
import { getCertifications, createCertification } from "@/lib/server/certifications"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET() {
  try {
    const certifications = await getCertifications()
    return NextResponse.json(certifications)
  } catch (error) {
    console.error("Error in GET /api/certifications:", error)
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const certificationData = await request.json()
    const newCertification = await createCertification(certificationData)

    return NextResponse.json(newCertification, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/certifications:", error)
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 })
  }
}

