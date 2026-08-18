import "server-only"

import { About } from "@/lib/models/about"
import type { IAbout } from "@/lib/models/about"
import { connectToDB } from "../mongodb"

export async function getAboutData(): Promise<Partial<IAbout>> {
  try {
    // Connect to database
    await connectToDB()

    // Fetch about data
    let about = await About.findOne()

    if (!about) {
      // Create default about data if none exists
      about = await About.create({
        fullName: "Masudur Rahman",
        email: "masudparvez2050@gmail.com",
        bio: "Hello! I'm Masudur Rahman, a passionate full-stack web developer specializing in creating beautiful, functional, and user-friendly web applications. With over 5 years of experience in the field, I've worked on a diverse range of projects, from small business websites to complex enterprise applications.",
        bioExtended:
          "My journey in web development began during my university days, where I discovered my passion for coding. Since then, I've been constantly learning and expanding my skillset to stay on top of the latest industry trends and technologies.",
        bioConclusion:
          "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through blog posts and tutorials.",
        location: "Dhaka, Bangladesh",
        availability: "Full-time",
        resumeUrl: "/resume.pdf",
        education: [],
        languages: [],
        interests: [],
      })
    }

    // Convert to plain object and return
    return JSON.parse(JSON.stringify(about))
  } catch (error) {
    console.error("Error fetching about data:", error)
    return {}
  }
}

export async function updateAboutData(data: Partial<IAbout>): Promise<Partial<IAbout>> {
  try {
    // Connect to database
    await connectToDB()

    // Find existing about data
    let about = await About.findOne()

    if (!about) {
      // Create new about data if none exists
      about = await About.create(data)
    } else {
      // Update existing about data
      Object.assign(about, data)
      await about.save()
    }

    // Convert to plain object and return
    return JSON.parse(JSON.stringify(about))
  } catch (error) {
    console.error("Error updating about data:", error)
    throw new Error("Failed to update about data")
  }
}

