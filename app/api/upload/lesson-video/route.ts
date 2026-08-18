import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { v2 as cloudinary } from "cloudinary"
import { authOptions } from "@/lib/auth-options"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.isAdmin !== true) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to base64
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`

    // Upload to Cloudinary with video optimization
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "portfolio/lessons",
      resource_type: "video",
      chunk_size: 6000000, // 6MB chunks for better upload performance
      eager: [{ format: "mp4", transformation: [{ quality: "auto" }] }],
      eager_async: true,
      eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL, // Optional: URL for notification when processing is complete
    })

    return NextResponse.json({
      url: result.secure_url,
      duration: result.duration, // Video duration in seconds
      format: result.format,
      public_id: result.public_id,
    })
  } catch (error) {
    console.error("Error uploading video:", error)
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
  }
}

// Increase the body size limit for video uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
}
