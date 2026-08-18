import { connectToDB } from "@/lib/mongodb"
import { Skill } from "@/lib/models/skill"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET a single skill by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    await connectToDB()

    const skill = await Skill.findById(id)

    if (!skill) {
      return NextResponse.json({ message: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json(skill, { status: 200 })
  } catch (error) {
    console.error("Error fetching skill:", error)
    return NextResponse.json({ message: "Error fetching skill" }, { status: 500 })
  }
}

// PUT update a skill (admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const skillData = await req.json()

    const updatedSkill = await Skill.findByIdAndUpdate(id, skillData, { new: true, runValidators: true })

    if (!updatedSkill) {
      return NextResponse.json({ message: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json(updatedSkill, { status: 200 })
  } catch (error) {
    console.error("Error updating skill:", error)
    return NextResponse.json({ message: "Error updating skill" }, { status: 500 })
  }
}

// DELETE a skill (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const deletedSkill = await Skill.findByIdAndDelete(id)

    if (!deletedSkill) {
      return NextResponse.json({ message: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Skill deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting skill:", error)
    return NextResponse.json({ message: "Error deleting skill" }, { status: 500 })
  }
}

