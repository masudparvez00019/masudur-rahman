import mongoose, { Schema, type Document } from "mongoose"

export interface ICertification extends Document {
  title: string
  organization: string
  issueDate: Date
  description: string
  imagePath: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const CertificationSchema = new Schema<ICertification>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, "Issuing organization is required"],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    imagePath: {
      type: String,
      required: [true, "Image path is required"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Certification || mongoose.model<ICertification>("Certification", CertificationSchema)

