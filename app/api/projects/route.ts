import { connectToDB } from "@/lib/mongodb"
import { Project } from "@/lib/models/project"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET all projects
export async function GET(req: Request) {
  try {
    await connectToDB()

    const { searchParams } = new URL(req.url)
    const sParams = await searchParams
    const featured = sParams.get("featured")

    let query = {}
    if (featured === "true") {
      query = { featured: true }
    }

    // Sort by order field first, then by createdAt
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 })

    return NextResponse.json(projects, { status: 200 })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ message: "Error fetching projects" }, { status: 500 })
  }
}

// POST new project (admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const projectData = await req.json()

    // Validate required fields
    const requiredFields = ["title", "description", "longDescription", "image", "demoUrl", "githubUrl"]
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 })
      }
    }

    // Get the highest order value to place new project at the end
    const highestOrderProject = await Project.findOne().sort({ order: -1 }).limit(1)
    const nextOrder = highestOrderProject ? highestOrderProject.order + 1 : 0
    projectData.order = nextOrder

    const newProject = await Project.create(projectData)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ message: "Error creating project" }, { status: 500 })
  }
}
