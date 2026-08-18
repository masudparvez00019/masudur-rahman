import "server-only"
import { connectToDB } from "../mongodb"
import { Service } from "@/lib/models/service"
import type { IService } from "@/lib/models/service"

export async function getAllServices(): Promise<Partial<IService>[]> {
  try {
    // Connect to database
    await connectToDB()

    // Fetch services
    const services = await Service.find().sort({ order: 1 })

    // Convert to plain objects and return
    return JSON.parse(JSON.stringify(services))
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

export async function getServiceById(id: string): Promise<Partial<IService> | null> {
  try {
    // Connect to database
    await connectToDB()

    // Fetch service by ID
    const service = await Service.findById(id)

    if (!service) {
      return null
    }

    // Convert to plain object and return
    return JSON.parse(JSON.stringify(service))
  } catch (error) {
    console.error("Error fetching service:", error)
    return null
  }
}

