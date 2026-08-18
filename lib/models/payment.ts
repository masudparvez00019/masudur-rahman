import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId
  course: mongoose.Types.ObjectId
  amount: number
  currency: string
  paymentMethod: string
  paymentId: string
  transactionId?: string
  status: "pending" | "completed" | "failed" | "refunded"
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "BDT" },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String, required: true },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
)

export const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)
