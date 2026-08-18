import mongoose, { Schema, models } from "mongoose"

export interface ISettings extends mongoose.Document {
  fullName: string
  email: string
  bio: string
  location: string
  profileImage: string
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
    website: string
  }
  appearance: {
    accentColor: string
    defaultTheme: string
    enableAnimations: boolean
    enableParticles: boolean
  }
  emailSettings: {
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPass: string
    emailFrom: string
    emailTo: string
    enableNotifications: boolean
  }
}

const settingsSchema = new Schema<ISettings>(
  {
    fullName: {
      type: String,
      default: "Masudur Rahman",
    },
    email: {
      type: String,
      default: process.env.EMAIL_FROM,
    },
    bio: {
      type: String,
      default: "Web developer focused on creating beautiful and user-friendly web applications.",
    },
    location: {
      type: String,
      default: "Dhaka, Bangladesh",
    },
    profileImage: {
      type: String,
      default: "https://lh3.googleusercontent.com/a/ACg8ocIF1Rg3m2zyC5Hc1es-xsAmDlEzqSpgOOBHQgkWH0276zTUltPk-A=s96-c",
    },
    socialLinks: {
      github: {
        type: String,
        default: "https://github.com/masudurrahman",
      },
      linkedin: {
        type: String,
        default: "https://linkedin.com/in/masudurrahman",
      },
      twitter: {
        type: String,
        default: "https://twitter.com/masudurrahman",
      },
      website: {
        type: String,
        default: "https://masudurrahman.com",
      },
    },
    appearance: {
      accentColor: {
        type: String,
        default: "#7c3aed",
      },
      defaultTheme: {
        type: String,
        default: "dark",
      },
      enableAnimations: {
        type: Boolean,
        default: true,
      },
      enableParticles: {
        type: Boolean,
        default: true,
      },
    },
    emailSettings: {
      smtpHost: {
        type: String,
        default: process.env.EMAIL_SERVER_HOST,
      },
      smtpPort: {
        type: Number,
        default: process.env.EMAIL_SERVER_PORT,
      },
      smtpUser: {
        type: String,
        default: process.env.EMAIL_SERVER_USER,
      },
      smtpPass: {
        type: String,
        default: process.env.EMAIL_SERVER_PASSWORD,
      },
      emailFrom: {
        type: String,
        default: process.env.EMAIL_FROM,
      },
      emailTo: {
        type: String,
        default: process.env.EMAIL_TO,
      },
      enableNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true },
)

export const Settings = models.Settings || mongoose.model<ISettings>("Settings", settingsSchema)

