import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { sendEmail } from "@/lib/actions/email"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send email with password
    await sendEmail({
      to: email,
      subject: "Your New Account Password",
      html: `
        <h1>Welcome to the Portfolio App</h1>
        <p>Hello ${name},</p>
        <p>Your account has been created. Here are your login details:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
        <p>Please login and change your password as soon as possible.</p>
        <p>Best regards,<br>The Admin Team</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending password email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

