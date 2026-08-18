import { type NextRequest, NextResponse } from "next/server"
import { getCertificationById, updateCertification, deleteCertification } from "@/lib/server/certifications"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { deleteImage } from "@/lib/cloudinary"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {id} = await params;
    const certification = await getCertificationById(id)

    if (!certification) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 })
    }

    return NextResponse.json(certification)
  } catch (error) {
    const {id} = await params;
    console.error(`Error in GET /api/certifications/${id}:`, error)
    return NextResponse.json({ error: "Failed to fetch certification" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {id} = await params;
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const certificationData = await request.json()
    const updatedCertification = await updateCertification(id, certificationData)

    return NextResponse.json(updatedCertification)
  } catch (error) {
    const {id} = await params;
    console.error(`Error in PUT /api/certifications/${id}:`, error)
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {id} = await params;
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the certification to find the image path
    const certification = await getCertificationById(id)

    if (certification && certification.imagePath) {
      // Delete the image from Cloudinary
      await deleteImage(certification.imagePath)
    }

    await deleteCertification(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    const {id} = await params;
    console.error(`Error in DELETE /api/certifications/${id}:`, error)
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 })
  }
}

