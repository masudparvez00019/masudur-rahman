import { connectToDB } from "@/lib/mongodb"
import { Service } from "@/lib/models/service"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET a single service by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB()

    const {id} = await params;

    const service = await Service.findById(id)

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service, { status: 200 })
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ message: "Error fetching service" }, { status: 500 })
  }
}

// PUT update a service (admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    const {id} = await params;

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const serviceData = await req.json()

    const updatedService = await Service.findByIdAndUpdate(id, serviceData, { new: true, runValidators: true })

    if (!updatedService) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(updatedService, { status: 200 })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ message: "Error updating service" }, { status: 500 })
  }
}

// DELETE a service (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    const {id} = await params;

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const deletedService = await Service.findByIdAndDelete(id)

    if (!deletedService) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ message: "Error deleting service" }, { status: 500 })
  }
}

