import { connectToDB } from "@/lib/mongodb"
import { Skill } from "@/lib/models/skill"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET all skills
export async function GET(req: Request) {
  try {
    await connectToDB()

    const skills = await Skill.find().sort({ order: 1 })

    return NextResponse.json(skills, { status: 200 })
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ message: "Error fetching skills" }, { status: 500 })
  }
}

// POST new skill (admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const skillData = await req.json()

    // Validate required fields
    const requiredFields = ["title", "icon"]
    for (const field of requiredFields) {
      if (!skillData[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 })
      }
    }

    // Get the highest order value to place new skill at the end
    const highestOrder = await Skill.findOne().sort({ order: -1 }).select("order")
    skillData.order = highestOrder ? highestOrder.order + 1 : 0

    const newSkill = await Skill.create(skillData)

    return NextResponse.json(newSkill, { status: 201 })
  } catch (error) {
    console.error("Error creating skill:", error)
    return NextResponse.json({ message: "Error creating skill" }, { status: 500 })
  }
}

