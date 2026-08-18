import mongoose, { Schema, type Document } from "mongoose"

// Interfaces
export interface IFooterLink {
  label: string
  href: string
  isExternal: boolean
}

export interface IFooterSection {
  title: string
  links: IFooterLink[]
}

export interface IContactInfo {
  email: string
  phone: string
  address: string
}

export interface IFooter extends Document {
  companyName: string
  companyDescription: string
  sections: IFooterSection[]
  contactInfo: IContactInfo
  copyrightText: string
  socialLinks: Record<string, string>
}

// Schema
const FooterSchema = new Schema<IFooter>(
  {
    companyName: { type: String, required: true },
    companyDescription: { type: String, required: true },
    sections: [
      {
        title: { type: String, required: true },
        links: [
          {
            label: { type: String, required: true },
            href: { type: String, required: true },
            isExternal: { type: Boolean, default: false },
          },
        ],
      },
    ],
    contactInfo: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    copyrightText: { type: String, required: true },
    // Change from Map to Object
    socialLinks: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
)

// Create or retrieve model
export const Footer = mongoose.models.Footer || mongoose.model<IFooter>("Footer", FooterSchema)
