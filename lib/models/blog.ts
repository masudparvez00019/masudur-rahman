import mongoose, { Schema, models } from "mongoose"
// No need to import User here anymore as we're using the centralized models system

export interface IBlog extends mongoose.Document {
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  tags: string[]
  author: mongoose.Types.ObjectId
  readTime: string
  published: boolean
  comments: {
    author: mongoose.Types.ObjectId
    content: string
    date: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    published: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
)

export const Blog = models.Blog || mongoose.model<IBlog>("Blog", blogSchema)

