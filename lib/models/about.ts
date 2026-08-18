import mongoose, { Schema, type Document } from "mongoose"

// Education interface
export interface IEducation {
  degree: string
  institution: string
  year: string
  description?: string
}

// Language interface
export interface ILanguage {
  name: string
  proficiency: string
}

// About interface
export interface IAbout extends Document {
  fullName: string
  email: string
  bio: string
  bioExtended?: string
  bioConclusion?: string
  location: string
  availability: string
  resumeUrl: string
  education: IEducation[]
  languages: ILanguage[]
  interests: string[]
  createdAt: Date
  updatedAt: Date
}

// Education schema
const EducationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String },
})

// Language schema
const LanguageSchema = new Schema<ILanguage>({
  name: { type: String, required: true },
  proficiency: { type: String, required: true },
})

// About schema
const AboutSchema = new Schema<IAbout>(
  {
    fullName: { type: String, default: "Masudur Rahman" },
    email: { type: String, default: "contact@masudurrahman.com" },
    bio: {
      type: String,
      default:
        "Hello! I'm Masudur Rahman, a passionate full-stack web developer specializing in creating beautiful, functional, and user-friendly web applications. With over 5 years of experience in the field, I've worked on a diverse range of projects, from small business websites to complex enterprise applications.",
    },
    bioExtended: {
      type: String,
      default:
        "My journey in web development began during my university days, where I discovered my passion for coding. Since then, I've been constantly learning and expanding my skillset to stay on top of the latest industry trends and technologies.",
    },
    bioConclusion: {
      type: String,
      default:
        "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through blog posts and tutorials.",
    },
    location: { type: String, default: "Dhaka, Bangladesh" },
    availability: { type: String, default: "Full-time" },
    resumeUrl: { type: String, default: "/resume.pdf" },
    education: [EducationSchema],
    languages: [LanguageSchema],
    interests: [{ type: String }],
  },
  { timestamps: true },
)

// Create or retrieve the About model
export const About = mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema)

