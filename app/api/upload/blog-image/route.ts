import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Parse the form data
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    // Check file type
    const fileType = file.type
    if (!fileType.startsWith("image/")) {
      return NextResponse.json({ message: "File must be an image" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to Cloudinary
    const imageUrl = await uploadImage(buffer, "blog-posts")

    return NextResponse.json({ url: imageUrl }, { status: 200 })
  } catch (error) {
    console.error("Error uploading blog image:", error)
    return NextResponse.json({ message: "Error uploading image", error: (error as Error).message }, { status: 500 })
  }
}

