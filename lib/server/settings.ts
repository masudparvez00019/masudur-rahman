import "server-only"
import { Settings } from "@/lib/models/settings"
import { ISettings } from "@/lib/models/settings"
import { connectToDB } from "../mongodb"

export async function getSettings(): Promise<ISettings> {
  try {
    // Connect to database
    await connectToDB()

    // Fetch settings
    const settings = await Settings.findOne()
    return JSON.parse(JSON.stringify(settings || {}))
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {
      fullName: '',
      email: '',
      bio: '',
      location: '',
      // Add other required properties with default values
    } as ISettings
  }
}

