import { connectToDB } from "@/lib/mongodb"
import { Project } from "@/lib/models/project"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { deleteImage } from "@/lib/cloudinary"

// GET a single project by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const {id} = await params;
    await connectToDB()

    const project = await Project.findById(id)

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project, { status: 200 })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ message: "Error fetching project" }, { status: 500 })
  }
}

// PUT update a project (admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const {id} = await params;
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Get the existing project to check for image changes
    const existingProject = await Project.findById(id)
    if (!existingProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    const projectData = await req.json()

    // Check if the main image has changed
    if (
      existingProject.image &&
      existingProject.image !== projectData.image &&
      existingProject.image.includes("cloudinary")
    ) {
      try {
        await deleteImage(existingProject.image)
      } catch (error) {
        console.error("Error deleting old image:", error)
        // Continue with the update even if image deletion fails
      }
    }

    // Check for removed screenshots
    if (existingProject.screenshots && existingProject.screenshots.length > 0) {
      const oldScreenshots = existingProject.screenshots
      const newScreenshots = projectData.screenshots || []

      // Find screenshots that were removed
      const removedScreenshots = oldScreenshots.filter(
        (screenshot: string) => !newScreenshots.includes(screenshot) && screenshot.includes("cloudinary"),
      )

      // Delete each removed screenshot from Cloudinary
      for (const screenshot of removedScreenshots) {
        try {
          await deleteImage(screenshot)
        } catch (error) {
          console.error("Error deleting screenshot:", error)
          // Continue with the update even if screenshot deletion fails
        }
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(id, projectData, { new: true, runValidators: true })

    return NextResponse.json(updatedProject, { status: 200 })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ message: "Error updating project" }, { status: 500 })
  }
}

// DELETE a project (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const {id} = await params;
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    // Get the project to be deleted
    const project = await Project.findById(id)

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Delete the project's main image from Cloudinary if it exists
    if (project.image && project.image.includes("cloudinary")) {
      try {
        await deleteImage(project.image)
      } catch (error) {
        console.error("Error deleting project image:", error)
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete all project screenshots from Cloudinary if they exist
    if (project.screenshots && project.screenshots.length > 0) {
      for (const screenshot of project.screenshots) {
        if (screenshot.includes("cloudinary")) {
          try {
            await deleteImage(screenshot)
          } catch (error) {
            console.error("Error deleting project screenshot:", error)
            // Continue with deletion even if screenshot deletion fails
          }
        }
      }
    }

    const deletedProject = await Project.findByIdAndDelete(id)

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ message: "Error deleting project" }, { status: 500 })
  }
}

