import "server-only"

import { User } from "../models/user"
import { connectToDB } from "../mongodb"

export async function getAllUsers() {
  try {
    await connectToDB()
    const users = await User.find({}).sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(users))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function getUserById(id: string) {
  try {
    await connectToDB()
    const user = await User.findById(id)
    return user ? JSON.parse(JSON.stringify(user)) : null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function getUsersCount() {
  try {
    await connectToDB()
    const count = await User.countDocuments({})
    return count
  } catch (error) {
    console.error("Error counting users:", error)
    return 0
  }
}

export async function getNewUsersCount(days = 7) {
  try {
    await connectToDB()
    const date = new Date()
    date.setDate(date.getDate() - days)

    const count = await User.countDocuments({
      createdAt: { $gte: date },
    })

    return count
  } catch (error) {
    console.error("Error counting new users:", error)
    return 0
  }
}

