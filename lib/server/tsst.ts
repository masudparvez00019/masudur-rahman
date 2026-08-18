import { connectToDB } from "../mongodb"
import { CourseCategory } from "@/lib/models/course-category"
import { Course } from "@/lib/models/course"
import { Chapter } from "@/lib/models/chapter"
import { Lesson } from "@/lib/models/lesson"
import { Quiz } from "@/lib/models/quiz"
import { Enrollment } from "@/lib/models/enrollment"
import { Payment } from "@/lib/models/payment"
import { ObjectId } from "mongodb"

// Course Categories
export async function getCourseCategories() {
  await connectToDB()
  return CourseCategory.find().sort({ order: 1 }).lean()
}

export async function getCategoryById(id: string) {
  await connectToDB()
  return CourseCategory.findById(id).lean()
}

export async function createCategory(data: any) {
  await connectToDB()

  // Generate slug from name
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Get the highest order value
  const highestOrder = await CourseCategory.findOne().sort({ order: -1 }).select("order").lean()
  const order = highestOrder ? highestOrder.order + 1 : 0

  return CourseCategory.create({
    ...data,
    slug,
    order,
  })
}

export async function updateCategory(id: string, data: any) {
  await connectToDB()

  // If name is updated, update slug as well
  if (data.name) {
    data.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  return CourseCategory.findByIdAndUpdate(id, data, { new: true }).lean()
}

export async function deleteCategory(id: string) {
  await connectToDB()

  // Check if category has courses
  const coursesCount = await Course.countDocuments({ category: id })
  if (coursesCount > 0) {
    throw new Error("Cannot delete category with associated courses")
  }

  return CourseCategory.findByIdAndDelete(id)
}

export async function updateCategoryOrder(orderData: { id: string; order: number }[]) {
  await connectToDB()

  const updateOperations = orderData.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: new ObjectId(id) },
      update: { $set: { order } },
    },
  }))

  return CourseCategory.bulkWrite(updateOperations)
}

// Courses
export async function getCourses(
  options: {
    limit?: number
    page?: number
    category?: string
    search?: string
    featured?: boolean
    sort?: string
  } = {},
) {
  await connectToDB()

  const { limit = 10, page = 1, category, search, featured, sort = "createdAt_desc" } = options

  const query: any = {}

  if (category) {
    query.category = category
  }

  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
  }

  if (featured !== undefined) {
    query.featured = featured
  }

  const [sortField, sortDirection] = sort.split("_")
  const sortOptions: any = {}
  sortOptions[sortField] = sortDirection === "asc" ? 1 : -1

  const skip = (page - 1) * limit

  const [courses, total] = await Promise.all([
    Course.find(query).populate("category", "name slug").sort(sortOptions).skip(skip).limit(limit).lean(),
    Course.countDocuments(query),
  ])

  return {
    courses,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function getCourseById(id: string) {
  await connectToDB()
  return Course.findById(id).populate("category", "name slug").lean()
}

export async function getCourseBySlug(slug: string) {
  await connectToDB()
  return Course.findOne({ slug }).populate("category", "name slug").lean()
}

export async function createCourse(data: any) {
  await connectToDB()

  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  return Course.create({
    ...data,
    slug,
  })
}

export async function updateCourse(id: string, data: any) {
  await connectToDB()

  // If title is updated, update slug as well
  if (data.title) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  return Course.findByIdAndUpdate(id, data, { new: true }).lean()
}

export async function deleteCourse(id: string) {
  await connectToDB()

  // Check if course has enrollments
  const enrollmentsCount = await Enrollment.countDocuments({ course: id })
  if (enrollmentsCount > 0) {
    throw new Error("Cannot delete course with active enrollments")
  }

  // Delete associated chapters, lessons, and quizzes
  const chapters = await Chapter.find({ course: id }).lean()

  for (const chapter of chapters) {
    // Delete lessons
    await Lesson.deleteMany({ chapter: chapter._id })

    // Delete quizzes
    await Quiz.deleteMany({ chapter: chapter._id })
  }

  // Delete chapters
  await Chapter.deleteMany({ course: id })

  // Delete the course
  return Course.findByIdAndDelete(id)
}

// Chapters
export async function getChaptersByCourse(courseId: string) {
  await connectToDB()
  return Chapter.find({ course: courseId }).sort({ order: 1 }).lean()
}

export async function getChapterById(id: string) {
  await connectToDB()
  return Chapter.findById(id).lean()
}

export async function createChapter(data: any) {
  await connectToDB()

  // Get the highest order value for this course
  const highestOrder = await Chapter.findOne({ course: data.course }).sort({ order: -1 }).select("order").lean()

  const order = highestOrder ? highestOrder.order + 1 : 0

  return Chapter.create({
    ...data,
    order,
  })
}

export async function updateChapter(id: string, data: any) {
  await connectToDB()
  return Chapter.findByIdAndUpdate(id, data, { new: true }).lean()
}

export async function deleteChapter(id: string) {
  await connectToDB()

  // Delete associated lessons and quizzes
  await Lesson.deleteMany({ chapter: id })
  await Quiz.deleteMany({ chapter: id })

  return Chapter.findByIdAndDelete(id)
}

export async function updateChapterOrder(orderData: { id: string; order: number }[]) {
  await connectToDB()

  const updateOperations = orderData.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: new ObjectId(id) },
      update: { $set: { order } },
    },
  }))

  return Chapter.bulkWrite(updateOperations)
}

// Lessons
export async function getLessonsByChapter(chapterId: string) {
  await connectToDB()
  return Lesson.find({ chapter: chapterId }).sort({ order: 1 }).lean()
}

export async function getLessonById(id: string) {
  await connectToDB()
  return Lesson.findById(id).lean()
}

export async function createLesson(data: any) {
  await connectToDB()

  // Get the highest order value for this chapter
  const highestOrder = await Lesson.findOne({ chapter: data.chapter }).sort({ order: -1 }).select("order").lean()

  const order = highestOrder ? highestOrder.order + 1 : 0

  return Lesson.create({
    ...data,
    order,
  })
}

export async function updateLesson(id: string, data: any) {
  await connectToDB()
  return Lesson.findByIdAndUpdate(id, data, { new: true }).lean()
}

export async function deleteLesson(id: string) {
  await connectToDB()
  return Lesson.findByIdAndDelete(id)
}

export async function updateLessonOrder(orderData: { id: string; order: number }[]) {
  await connectToDB()

  const updateOperations = orderData.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: new ObjectId(id) },
      update: { $set: { order } },
    },
  }))

  return Lesson.bulkWrite(updateOperations)
}

// Quizzes
export async function getQuizzesByChapter(chapterId: string) {
  await connectToDB()
  return Quiz.find({ chapter: chapterId }).lean()
}

export async function getQuizById(id: string) {
  await connectToDB()
  return Quiz.findById(id).lean()
}

export async function createQuiz(data: any) {
  await connectToDB()
  return Quiz.create(data)
}

export async function updateQuiz(id: string, data: any) {
  await connectToDB()
  return Quiz.findByIdAndUpdate(id, data, { new: true }).lean()
}

export async function deleteQuiz(id: string) {
  await connectToDB()
  return Quiz.findByIdAndDelete(id)
}

// Enrollments
export async function getUserEnrollments(userId: string) {
  await connectToDB()
  return Enrollment.find({ user: userId })
    .populate("course", "title slug featuredImage price")
    .sort({ createdAt: -1 })
    .lean()
}

export async function getEnrollmentById(id: string) {
  await connectToDB()
  return Enrollment.findById(id)
    .populate("user", "name email")
    .populate("course", "title slug featuredImage price")
    .lean()
}

export async function getEnrollmentByUserAndCourse(userId: string, courseId: string) {
  await connectToDB()
  return Enrollment.findOne({ user: userId, course: courseId }).lean()
}

export async function enrollUserInCourse(userId: string, courseId: string, paymentData?: any) {
  await connectToDB()

  // Check if user is already enrolled
  const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId }).lean()
  if (existingEnrollment) {
    return existingEnrollment
  }

  // Get the course to check if it's free
  const course = await Course.findById(courseId).lean()
  if (!course) {
    throw new Error("Course not found")
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    progress: [],
    quizAttempts: [],
    paymentStatus: course.price > 0 ? "pending" : "free",
  })

  // If payment data is provided and course is not free, create payment record
  if (paymentData && course.price > 0) {
    await Payment.create({
      user: userId,
      course: courseId,
      amount: course.price,
      currency: "USD",
      status: "pending",
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId,
    })
  }

  return enrollment
}

export async function updateLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  progressData: {
    completed?: boolean
    watchedSeconds?: number
    lastPosition?: number
  },
) {
  await connectToDB()

  // Find the enrollment
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId })
  if (!enrollment) {
    throw new Error("Enrollment not found")
  }

  // Check if the lesson progress already exists
  const lessonProgressIndex = enrollment.progress.findIndex((p) => p.lesson.toString() === lessonId)

  if (lessonProgressIndex >= 0) {
    // Update existing progress
    if (progressData.completed !== undefined) {
      enrollment.progress[lessonProgressIndex].completed = progressData.completed

      // If marked as completed, set completedAt
      if (progressData.completed && !enrollment.progress[lessonProgressIndex].completedAt) {
        enrollment.progress[lessonProgressIndex].completedAt = new Date()
      }
    }

    if (progressData.watchedSeconds !== undefined) {
      enrollment.progress[lessonProgressIndex].watchedSeconds = progressData.watchedSeconds
    }

    if (progressData.lastPosition !== undefined) {
      enrollment.progress[lessonProgressIndex].lastPosition = progressData.lastPosition
    }
  } else {
    // Add new progress
    enrollment.progress.push({
      lesson: lessonId,
      completed: progressData.completed || false,
      watchedSeconds: progressData.watchedSeconds || 0,
      lastPosition: progressData.lastPosition || 0,
      completedAt: progressData.completed ? new Date() : undefined,
    })
  }

  // Check if all lessons are completed to mark the course as completed
  await checkCourseCompletion(enrollment, courseId)

  await enrollment.save()
  return enrollment
}

export async function submitQuizAttempt(userId: string, courseId: string, quizId: string, score: number) {
  await connectToDB()

  // Find the enrollment
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId })
  if (!enrollment) {
    throw new Error("Enrollment not found")
  }

  // Get the quiz to check passing score
  const quiz = await Quiz.findById(quizId).lean()
  if (!quiz) {
    throw new Error("Quiz not found")
  }

  const passed = score >= quiz.passingScore

  // Add quiz attempt
  enrollment.quizAttempts.push({
    quiz: quizId,
    score,
    passed,
    attemptedAt: new Date(),
  })

  // If passed, check if all quizzes and lessons are completed
  if (passed) {
    await checkCourseCompletion(enrollment, courseId)
  }

  await enrollment.save()

  return {
    score,
    passed,
    passingScore: quiz.passingScore,
  }
}

async function checkCourseCompletion(enrollment: any, courseId: string) {
  // Get all lessons for the course
  const chapters = await Chapter.find({ course: courseId }).lean()
  const chapterIds = chapters.map((chapter) => chapter._id)

  const lessons = await Lesson.find({ chapter: { $in: chapterIds } }).lean()
  const lessonIds = lessons.map((lesson) => lesson._id.toString())

  // Get all quizzes for the course
  const quizzes = await Quiz.find({ chapter: { $in: chapterIds } }).lean()
  const quizIds = quizzes.map((quiz) => quiz._id.toString())

  // Check if all lessons are completed
  const completedLessons = enrollment.progress.filter((p: any) => p.completed).map((p: any) => p.lesson.toString())

  const allLessonsCompleted = lessonIds.every((id) => completedLessons.includes(id))

  // Check if all quizzes are passed
  const passedQuizzes = enrollment.quizAttempts.filter((a: any) => a.passed).map((a: any) => a.quiz.toString())

  const allQuizzesPassed = quizIds.every((id) => passedQuizzes.includes(id))

  // If all lessons and quizzes are completed, mark the course as completed
  if (allLessonsCompleted && allQuizzesPassed && !enrollment.completedAt) {
    enrollment.completedAt = new Date()
  }
}

// Payments
export async function createPayment(data: any) {
  await connectToDB()

  const payment = await Payment.create(data)

  // If payment is completed, update enrollment status
  if (data.status === "completed") {
    await Enrollment.findOneAndUpdate({ user: data.user, course: data.course }, { paymentStatus: "completed" })
  }

  return payment
}

export async function getPaymentById(id: string) {
  await connectToDB()
  return Payment.findById(id).populate("user", "name email").populate("course", "title slug").lean()
}

export async function getUserPayments(userId: string) {
  await connectToDB()
  return Payment.find({ user: userId }).populate("course", "title slug").sort({ createdAt: -1 }).lean()
}

export async function updatePaymentStatus(id: string, status: string, transactionId?: string) {
  await connectToDB()

  const payment = await Payment.findById(id)
  if (!payment) {
    throw new Error("Payment not found")
  }

  payment.status = status
  if (transactionId) {
    payment.transactionId = transactionId
  }

  await payment.save()

  // Update enrollment payment status if needed
  if (status === "completed") {
    await Enrollment.findOneAndUpdate({ user: payment.user, course: payment.course }, { paymentStatus: "completed" })
  } else if (status === "refunded") {
    await Enrollment.findOneAndUpdate({ user: payment.user, course: payment.course }, { paymentStatus: "refunded" })
  }

  return payment
}

// Helper Functions
async function updateCourseTotalLessons(courseId: string) {
  try {
    const totalLessons = await Lesson.countDocuments({
      course: courseId,
      isPublished: true,
    })

    await Course.findByIdAndUpdate(courseId, { totalLessons })
  } catch (error) {
    console.error("Error updating course total lessons:", error)
  }
}

// Dashboard Statistics
export async function getCourseStatistics() {
  try {
    await connectToDB()

    const totalCourses = await Course.countDocuments()
    const publishedCourses = await Course.countDocuments({ isPublished: true })
    const totalEnrollments = await Enrollment.countDocuments()
    const totalCompletions = await Enrollment.countDocuments({ completedAt: { $exists: true } })
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    return {
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalCompletions,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    }
  } catch (error) {
    console.error("Error getting course statistics:", error)
    throw new Error("Failed to get course statistics")
  }
}

export async function getUserCourseStatistics(userId: string) {
  try {
    await connectToDB()

    const enrollments = await Enrollment.find({ user: userId }).lean()

    const totalEnrolled = enrollments.length
    const completed = enrollments.filter((e) => e.completedAt).length
    const inProgress = totalEnrolled - completed

    // Calculate overall progress percentage
    let overallProgress = 0
    if (totalEnrolled > 0) {
      const totalProgress = enrollments.reduce((acc, enrollment) => {
        const completedLessons = enrollment.progress.filter((p) => p.completed).length
        const totalLessons = enrollment.progress.length
        return acc + (totalLessons > 0 ? completedLessons / totalLessons : 0)
      }, 0)

      overallProgress = Math.round((totalProgress / totalEnrolled) * 100)
    }

    return {
      totalEnrolled,
      completed,
      inProgress,
      overallProgress,
    }
  } catch (error) {
    console.error("Error getting user course statistics:", error)
    throw new Error("Failed to get user course statistics")
  }
}
