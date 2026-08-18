import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, getUsersCount, getNewUsersCount } from "@/lib/server/users"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sParams = await searchParams
    const action = sParams.get("action")

    if (action === "count") {
      const count = await getUsersCount()
      return NextResponse.json({ count })
    } else if (action === "new") {
      const days = sParams.get("days") ? Number.parseInt(sParams.get("days")!) : 7
      const count = await getNewUsersCount(days)
      return NextResponse.json({ count })
    } else {
      const users = await getAllUsers()
      return NextResponse.json(users)
    }
  } catch (error) {
    console.error("Error in users API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

