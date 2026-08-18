import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IQuizQuestion {
  question: string
  options: string[]
  correctOption: number
  explanation?: string
}

export interface IQuiz extends Document {
  title: string
  description?: string
  course: mongoose.Types.ObjectId
  lesson?: mongoose.Types.ObjectId
  chapter?: mongoose.Types.ObjectId
  questions: IQuizQuestion[]
  passingScore: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
    chapter: { type: Schema.Types.ObjectId, ref: "Chapter" },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: Number, required: true },
        explanation: { type: String },
      },
    ],
    passingScore: { type: Number, default: 70 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema)
