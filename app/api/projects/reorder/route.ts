import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { connectToDB } from "@/lib/mongodb"
import { Project } from "@/lib/models/project"

// PUT update project order (admin only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const { projects } = await req.json()

    // Validate the request body
    if (!projects || !Array.isArray(projects)) {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    // Update the order of each project
    const updatePromises = projects.map(async (project) => {
      // Make sure we're using the correct property names
      const { id, order } = project

      // Validate that id is a valid ObjectId
      if (!id || typeof id !== "string") {
        console.error(`Invalid project ID: ${id}`)
        return null
      }

      return Project.findByIdAndUpdate(id, { $set: { order } }, { new: true })
    })

    // Filter out any null promises and execute the valid ones
    const results = await Promise.all(updatePromises.filter(Boolean))

    return NextResponse.json(
      {
        message: "Project order updated successfully",
        updatedCount: results.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating project order:", error)
    return NextResponse.json(
      {
        message: "Error updating project order",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
