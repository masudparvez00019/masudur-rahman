import { connectToDB } from "@/lib/mongodb"
import { Contact } from "@/lib/models/contact"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET a single contact message by ID (admin only)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const contact = await Contact.findById(id)

    if (!contact) {
      return NextResponse.json({ message: "Contact message not found" }, { status: 404 })
    }

    return NextResponse.json(contact, { status: 200 })
  } catch (error) {
    console.error("Error fetching contact:", error)
    return NextResponse.json({ message: "Error fetching contact" }, { status: 500 })
  }
}

// PUT update a contact message (mark as read) (admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const contactData = await req.json()

    const updatedContact = await Contact.findByIdAndUpdate(id, contactData, { new: true, runValidators: true })

    if (!updatedContact) {
      return NextResponse.json({ message: "Contact message not found" }, { status: 404 })
    }

    return NextResponse.json(updatedContact, { status: 200 })
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ message: "Error updating contact" }, { status: 500 })
  }
}

// DELETE a contact message (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const deletedContact = await Contact.findByIdAndDelete(id)

    if (!deletedContact) {
      return NextResponse.json({ message: "Contact message not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Contact message deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json({ message: "Error deleting contact" }, { status: 500 })
  }
}

