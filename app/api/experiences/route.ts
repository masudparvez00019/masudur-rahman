import { connectToDB } from "@/lib/mongodb"
import { Experience } from "@/lib/models/experience"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET all experiences
export async function GET(req: Request) {
  try {
    await connectToDB()

    const experiences = await Experience.find().sort({ order: 1 })

    return NextResponse.json(experiences, { status: 200 })
  } catch (error) {
    console.error("Error fetching experiences:", error)
    return NextResponse.json({ message: "Error fetching experiences" }, { status: 500 })
  }
}

// POST new experience (admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const experienceData = await req.json()

    // Validate required fields
    const requiredFields = ["position", "company", "duration", "location"]
    for (const field of requiredFields) {
      if (!experienceData[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 })
      }
    }

    // Get the highest order value to place new experience at the beginning (most recent first)
    const highestOrder = await Experience.findOne().sort({ order: -1 }).select("order")
    experienceData.order = highestOrder ? highestOrder.order + 1 : 0

    const newExperience = await Experience.create(experienceData)

    return NextResponse.json(newExperience, { status: 201 })
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json({ message: "Error creating experience" }, { status: 500 })
  }
}

