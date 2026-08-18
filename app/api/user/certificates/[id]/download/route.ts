import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { connectToDB } from "@/lib/mongodb"
import { Enrollment } from "@/lib/models/enrollment"
import { User } from "@/lib/models/user"
import { Course } from "@/lib/models/course"
import PDFDocument from "pdfkit"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Find the enrollment
    const enrollment = await Enrollment.findById(id).lean()

    if (!enrollment) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Check if the enrollment belongs to the user
    if (enrollment.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the course is completed
    if (!enrollment.completedAt) {
      return NextResponse.json({ error: "Course not completed" }, { status: 400 })
    }

    // Get user and course details
    const user = await User.findById(enrollment.user).lean()
    const course = await Course.findById(enrollment.course).lean()

    if (!user || !course) {
      return NextResponse.json({ error: "User or course not found" }, { status: 404 })
    }

    // Generate certificate ID
    const certificateId = `CERT-${enrollment._id.toString().substring(0, 8).toUpperCase()}`

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 50,
    })

    // Set response headers
    const headers = new Headers()
    headers.set("Content-Type", "application/pdf")
    headers.set("Content-Disposition", `attachment; filename="certificate-${certificateId}.pdf"`)

    // Create a stream to collect PDF data
    const chunks: Uint8Array[] = []
    doc.on("data", (chunk) => chunks.push(chunk))

    // Generate certificate content
    doc.font("Helvetica-Bold").fontSize(30).text("Certificate of Completion", { align: "center" })
    doc.moveDown()
    doc.font("Helvetica").fontSize(16).text("This is to certify that", { align: "center" })
    doc.moveDown()
    doc.font("Helvetica-Bold").fontSize(24).text(user.name, { align: "center" })
    doc.moveDown()
    doc.font("Helvetica").fontSize(16).text("has successfully completed the course", { align: "center" })
    doc.moveDown()
    doc.font("Helvetica-Bold").fontSize(20).text(course.title, { align: "center" })
    doc.moveDown(2)
    doc
      .font("Helvetica")
      .fontSize(14)
      .text(`Completed on: ${new Date(enrollment.completedAt).toLocaleDateString()}`, { align: "center" })
    doc.moveDown()
    doc.font("Helvetica").fontSize(14).text(`Certificate ID: ${certificateId}`, { align: "center" })

    // Finalize the PDF
    doc.end()

    // Wait for PDF generation to complete
    const pdfData = await new Promise<Uint8Array>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks))
      })
    })

    return new NextResponse(pdfData, { headers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
