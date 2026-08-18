import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IProgress {
  lesson: mongoose.Types.ObjectId
  completed: boolean
  watchedSeconds: number
  lastPosition: number
  completedAt?: Date
}

export interface IQuizAttempt {
  quiz: mongoose.Types.ObjectId
  score: number
  passed: boolean
  completedAt: Date
}

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId
  course: mongoose.Types.ObjectId
  enrolledAt: Date
  completedAt?: Date
  progress: IProgress[]
  quizAttempts: IQuizAttempt[]
  certificateIssued: boolean
  certificateUrl?: string
  paymentStatus: "free" | "pending" | "completed" | "failed"
  paymentMethod?: string
  paymentId?: string
  transactionId?: string
  amount?: number
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    progress: [
      {
        lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
        completed: { type: Boolean, default: false },
        watchedSeconds: { type: Number, default: 0 },
        lastPosition: { type: Number, default: 0 },
        completedAt: { type: Date },
      },
    ],
    quizAttempts: [
      {
        quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
        score: { type: Number, required: true },
        passed: { type: Boolean, required: true },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    certificateIssued: { type: Boolean, default: false },
    certificateUrl: { type: String },
    paymentStatus: {
      type: String,
      enum: ["free", "pending", "completed", "failed"],
      default: "free",
    },
    paymentMethod: { type: String },
    paymentId: { type: String },
    transactionId: { type: String },
    amount: { type: Number },
  },
  { timestamps: true },
)

// Create a compound index to ensure a user can only enroll once in a course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true })

export const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema)
