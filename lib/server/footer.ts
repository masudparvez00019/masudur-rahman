import { connectToDB } from "../mongodb"
import { Footer } from "../models/footer"
import { revalidatePath } from "next/cache"

// Get footer data
export async function getFooter() {
  try {
    await connectToDB()

    // Find the footer or create a default one if none exists
    let footer = await Footer.findOne()

    if (!footer) {
      // Create default footer by calling initializeDefaultFooter
      footer = await initializeDefaultFooter()
    }

    const footerObj = footer.toObject()
    
    // Ensure socialLinks has default values if empty
    if (!footerObj.socialLinks || Object.keys(footerObj.socialLinks).length === 0) {
      footerObj.socialLinks = {
        github: "https://github.com/masudparvez2050",
        linkedin: "https://www.linkedin.com/in/masudur-rahman-dev",
        twitter: "https://twitter.com/masudurrahman",
        website: "https://masudur-rahman.vercel.app/",
      }
    }
    
    return footerObj
  } catch (error) {
    console.error("Error getting footer:", error)
    return null
  }
}

// Initialize default footer
export async function initializeDefaultFooter() {
  try {
    await connectToDB()

    // Check if footer already exists
    const existingFooter = await Footer.findOne()
    if (existingFooter) {
      return existingFooter
    }

    // Create default footer
    const defaultFooter = await Footer.create({
      companyName: "Masudur Rahman",
      companyDescription: "Web developer focused on creating beautiful and user-friendly web applications.",
      sections: [
        {
          title: "Links",
          links: [
            { label: "About", href: "/#about", isExternal: false },
            { label: "Skills", href: "/#skills", isExternal: false },
            { label: "Experience", href: "/#experience", isExternal: false },
            { label: "Projects", href: "/#projects", isExternal: false },
            { label: "Blog", href: "/blog", isExternal: false },
          ],
        },
        {
          title: "Services",
          links: [
            { label: "Web Development", href: "/#services", isExternal: false },
            { label: "UI/UX Design", href: "/#services", isExternal: false },
            { label: "Full-Stack Development", href: "/#services", isExternal: false },
            { label: "Consulting", href: "/#services", isExternal: false },
          ],
        },
      ],
      contactInfo: {
        email: "contact@masudurrahman.com",
        phone: "+880 1700 000000",
        address: "Dhaka, Bangladesh",
      },
      copyrightText: "© {year} Masudur Rahman. All rights reserved.",
      socialLinks: {
        github: "https://github.com/masudparvez2050",
        linkedin: "https://www.linkedin.com/in/masudur-rahman-dev",
        twitter: "https://twitter.com/masudurrahman",
        website: "https://masudur-rahman.vercel.app/",
      },
    })

    return defaultFooter
  } catch (error) {
    console.error("Error initializing default footer:", error)
    throw error
  }
}

// Update or create footer
export async function upsertFooter(footerData: any) {
  try {
    await connectToDB()

    // Ensure socialLinks has default values if empty
    const dataToUpdate = {
      ...footerData,
      socialLinks: footerData.socialLinks && Object.keys(footerData.socialLinks).length > 0
        ? footerData.socialLinks
        : {
            github: "https://github.com/masudparvez2050",
            linkedin: "https://www.linkedin.com/in/masudur-rahman-dev",
            twitter: "https://twitter.com/masudurrahman",
            website: "https://masudur-rahman.vercel.app/",
          }
    }

    // Find the footer or create a new one
    const footer = await Footer.findOneAndUpdate(
      {}, // Find the first document (we only have one footer)
      dataToUpdate,
      { upsert: true, new: true, runValidators: true },
    )

    // Revalidate paths
    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: "Footer updated successfully",
      data: footer,
    }
  } catch (error) {
    console.error("Error updating footer:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update footer",
    }
  }
}
