import { type NextRequest, NextResponse } from "next/server"
import { updateCertificationsOrder } from "@/lib/server/certifications"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderedIds } = await request.json()

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: "Invalid ordered IDs" }, { status: 400 })
    }

    await updateCertificationsOrder(orderedIds)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in PUT /api/certifications/order:", error)
    return NextResponse.json({ error: "Failed to update certifications order" }, { status: 500 })
  }
}

