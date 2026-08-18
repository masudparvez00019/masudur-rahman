import { connectToDB } from "@/lib/mongodb"
import { User } from "@/lib/models/user"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Connect to database
    await connectToDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false, // Default to non-admin
    })

    // Remove password from response
    const newUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    }

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Error in register route:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

