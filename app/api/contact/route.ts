import { connectToDB } from "@/lib/mongodb"
import { Contact } from "@/lib/models/contact"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET all contact messages (admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is admin
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const contacts = await Contact.find().sort({ createdAt: -1 })

    return NextResponse.json(contacts, { status: 200 })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ message: "Error fetching contacts" }, { status: 500 })
  }
}

// POST new contact message
export async function POST(req: Request) {
  try {
    await connectToDB()

    const contactData = await req.json()

    // Validate required fields
    const requiredFields = ["name", "email", "subject", "message"]
    for (const field of requiredFields) {
      if (!contactData[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 })
      }
    }

    const newContact = await Contact.create(contactData)

    return NextResponse.json({ message: "Message sent successfully", contact: newContact }, { status: 201 })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ message: "Error sending message" }, { status: 500 })
  }
}

