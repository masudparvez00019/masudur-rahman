import { connectToDB } from "@/lib/mongodb"
import { Blog } from "@/lib/models/blog"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// POST a new comment to a blog post
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ message: "You must be signed in to comment" }, { status: 401 })
    }

    await connectToDB()

    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ message: "Comment content is required" }, { status: 400 })
    }

    const blog = await Blog.findById(id)

    if (!blog) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 })
    }

    // Add the comment
    blog.comments.push({
      author: session.user.id,
      content,
      date: new Date(),
    })

    await blog.save()

    // Populate the author details for the new comment
    const updatedBlog = await Blog.findById(id).populate("comments.author", "name image")

    return NextResponse.json({ message: "Comment added successfully", blog: updatedBlog }, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ message: "Error adding comment" }, { status: 500 })
  }
}

