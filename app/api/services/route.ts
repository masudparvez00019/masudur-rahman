import { connectToDB } from "@/lib/mongodb"
import { Service } from "@/lib/models/service"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET all services
export async function GET(req: Request) {
  try {
    await connectToDB()

    const services = await Service.find().sort({ order: 1 })

    return NextResponse.json(services, { status: 200 })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ message: "Error fetching services" }, { status: 500 })
  }
}

// POST new service (admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const serviceData = await req.json()

    // Validate required fields
    const requiredFields = ["title", "description", "icon"]
    for (const field of requiredFields) {
      if (!serviceData[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 })
      }
    }

    // Get the highest order value to place new service at the end
    const highestOrder = await Service.findOne().sort({ order: -1 }).select("order")
    serviceData.order = highestOrder ? highestOrder.order + 1 : 0

    const newService = await Service.create(serviceData)

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ message: "Error creating service" }, { status: 500 })
  }
}

