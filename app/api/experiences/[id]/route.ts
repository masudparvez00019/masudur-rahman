import { connectToDB } from "@/lib/mongodb"
import { Experience } from "@/lib/models/experience"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET a single experience by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB()

    const { id } = await params

    const experience = await Experience.findById(id)

    if (!experience) {
      return NextResponse.json({ message: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json(experience, { status: 200 })
  } catch (error) {
    console.error("Error fetching experience:", error)
    return NextResponse.json({ message: "Error fetching experience" }, { status: 500 })
  }
}

// PUT update an experience (admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    const { id } = await params

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const experienceData = await req.json()

    const updatedExperience = await Experience.findByIdAndUpdate(id, experienceData, {
      new: true,
      runValidators: true,
    })

    if (!updatedExperience) {
      return NextResponse.json({ message: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json(updatedExperience, { status: 200 })
  } catch (error) {
    console.error("Error updating experience:", error)
    return NextResponse.json({ message: "Error updating experience" }, { status: 500 })
  }
}

// DELETE an experience (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    const { id } = await params

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const deletedExperience = await Experience.findByIdAndDelete(id)

    if (!deletedExperience) {
      return NextResponse.json({ message: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Experience deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting experience:", error)
    return NextResponse.json({ message: "Error deleting experience" }, { status: 500 })
  }
}

