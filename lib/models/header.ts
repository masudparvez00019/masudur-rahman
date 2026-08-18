import mongoose, { Schema, type Document } from "mongoose"

// Interfaces
export interface INavItem {
  label: string
  href: string
  isExternal: boolean
}

export interface IHero {
  title: string
  subtitle: string
  description: string
  typingTexts: string[]
  tags: string[]
  ctaText: string
  ctaLink: string
  showProfileImage: boolean
  profileImageUrl?: string // Make it optional but ensure it's defined
}

export interface IHeader extends Document {
  navItems: INavItem[]
  hero: IHero
  socialLinks: Record<string, string>
  logoText: string
}

// Schema
const HeaderSchema = new Schema<IHeader>(
  {
    navItems: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true },
        isExternal: { type: Boolean, default: false },
      },
    ],
    hero: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      description: { type: String, required: true },
      typingTexts: [{ type: String }],
      tags: [{ type: String }],
      ctaText: { type: String, required: true },
      ctaLink: { type: String, required: true },
      showProfileImage: { type: Boolean, default: true },
      profileImageUrl: { type: String, default: "" }, // Ensure it's defined in the schema
    },
    socialLinks: { type: Map, of: String, default: {} },
    logoText: { type: String, required: true },
  },
  { timestamps: true },
)

// Create or retrieve model
export const Header = mongoose.models.Header || mongoose.model<IHeader>("Header", HeaderSchema)
