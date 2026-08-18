import { connectToDB } from "@/lib/mongodb"
import { Blog, User } from "@/lib/models" // Import from the centralized models index
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET all blog posts
export async function GET(req: Request) {
  try {
    await connectToDB()

    const { searchParams } = new URL(req.url)
    const sParams = await searchParams
    const published = sParams.get("published")

    let query = {}
    if (published === "true") {
      query = { published: true }
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 }).populate("author", "name image")

    return NextResponse.json(blogs, { status: 200 })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ message: "Error fetching blogs" }, { status: 500 })
  }
}

// POST new blog post (admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const blogData = await req.json()

    // Set the author to the current user
    blogData.author = session.user.id

    // Validate required fields
    const requiredFields = ["title", "excerpt", "content", "image", "category"]
    for (const field of requiredFields) {
      if (!blogData[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 })
      }
    }

    const newBlog = await Blog.create(blogData)

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ message: "Error creating blog" }, { status: 500 })
  }
}

