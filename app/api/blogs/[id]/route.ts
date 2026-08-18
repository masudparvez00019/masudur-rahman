import { connectToDB } from "@/lib/mongodb"
import { Blog } from "@/lib/models/blog"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { deleteImage } from "@/lib/cloudinary"

// GET a single blog post by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    await connectToDB()

    const blog = await Blog.findById(id).populate("author", "name image")

    if (!blog) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(blog, { status: 200 })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ message: "Error fetching blog" }, { status: 500 })
  }
}

// PUT update a blog post (admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const blogData = await req.json()

    // Get the current blog to check if image has changed
    const currentBlog = await Blog.findById(id)
    if (!currentBlog) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 })
    }

    // If image has changed and old image was from Cloudinary, delete the old image
    if (
      currentBlog.image &&
      blogData.image &&
      currentBlog.image !== blogData.image &&
      currentBlog.image.includes("cloudinary.com")
    ) {
      try {
        await deleteImage(currentBlog.image)
      } catch (error) {
        console.error("Error deleting old blog image:", error)
        // Continue with update even if image deletion fails
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, { new: true, runValidators: true })

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(updatedBlog, { status: 200 })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ message: "Error updating blog" }, { status: 500 })
  }
}

// DELETE a blog post (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Get the blog to delete
    const blogToDelete = await Blog.findById(id)

    if (!blogToDelete) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 })
    }

    // Delete the blog image from Cloudinary if it exists
    if (blogToDelete.image && blogToDelete.image.includes("cloudinary.com")) {
      try {
        await deleteImage(blogToDelete.image)
      } catch (error) {
        console.error("Error deleting blog image from Cloudinary:", error)
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete the blog post from the database
    const deletedBlog = await Blog.findByIdAndDelete(id)

    return NextResponse.json({ message: "Blog post deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ message: "Error deleting blog" }, { status: 500 })
  }
}

