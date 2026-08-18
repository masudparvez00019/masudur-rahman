"use server"

import { connectToDB } from "../mongodb"
import { Header, type IHeader } from "@/lib/models/header"
import { revalidatePath } from "next/cache"

// Get the header data (there should only be one document)
export async function getHeader(): Promise<Partial<IHeader> | null> {
  try {
    await connectToDB()
    const header = await Header.findOne().lean()

    // If no header exists, initialize with defaults
    if (!header) {
      await initializeDefaultHeader()
      return await Header.findOne().lean()
    }

    return header
  } catch (error) {
    console.error("Error fetching header:", error)
    return null
  }
}

// Create or update the header data
export async function upsertHeader(headerData: Partial<IHeader>): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDB()

    // Find the existing header or create a new one
    const existingHeader = await Header.findOne()

    if (existingHeader) {
      // Update existing header
      await Header.findByIdAndUpdate(existingHeader._id, headerData)
    } else {
      // Create new header
      await Header.create(headerData)
    }

    revalidatePath("/")
    revalidatePath("/admin")

    return { success: true, message: "Header updated successfully" }
  } catch (error) {
    console.error("Error updating header:", error)
    return {
      success: false,
      message: `Error updating header: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Initialize default header if none exists
export async function initializeDefaultHeader(): Promise<void> {
  try {
    await connectToDB()
    const existingHeader = await Header.findOne()

    if (!existingHeader) {
      await Header.create({
        navItems: [
          { label: "About", href: "/#about" },
          { label: "Skills", href: "/#skills" },
          { label: "Experience", href: "/#experience" },
          { label: "Projects", href: "/projects" },
          { label: "Services", href: "/#services" },
          { label: "Certifications", href: "/#certifications" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/#contact" },
        ],
        hero: {
          title: "Turning ideas into impactful code.",
          subtitle: "Hey, I'm",
          description: "Building Seamless Solutions, One Line at a Time.",
          typingTexts: [
            "Masudur Rahman 👋",
            "A Full-Stack Developer",
            "A React Enthusiast",
            "A Flutter Developer",
            "A Problem Solver",
          ],
          tags: [
            "💻 Coding Enthusiast",
            "🌐 Full-Stack Developer",
            "✡️ React.js Developer",
            "⚛️ Next.js Developer",
            "📱 Flutter Developer",
          ],
          ctaText: "Hire Me",
          ctaLink: "/#contact",
          showProfileImage: true,
          profileImageUrl: "", // Initialize with empty string
        },
        socialLinks: {
          github: "https://github.com",
          linkedin: "https://linkedin.com",
          facebook: "https://facebook.com",
          messagecircle: "https://twitter.com",
          phone: "tel:+1234567890",
          mail: "mailto:example@example.com",
        },
        logoText: "Masudur Rahman",
      })
    }
  } catch (error) {
    console.error("Error initializing default header:", error)
  }
}
