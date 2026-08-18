import { connectToDB } from "../mongodb"
import { Course, type ICourse } from "@/lib/models/course"
import { Chapter, type IChapter } from "@/lib/models/chapter"
import { Lesson, type ILesson } from "@/lib/models/lesson"
import { CourseCategory, type ICourseCategory } from "@/lib/models/course-category"
import { Quiz, type IQuiz } from "@/lib/models/quiz"
import { Enrollment } from "@/lib/models/enrollment"
import { Payment, type IPayment } from "@/lib/models/payment"
import mongoose from "mongoose"
import slugify from "slugify"
import { serializeMongoDoc } from "../utils/serialization"
import { ObjectId } from "mongodb"

// Course Category Functions
export async function getAllCourseCategories() {
  try {
    await connectToDB()
    return await CourseCategory.find().sort({ order: 1 }).lean()
  } catch (error) {
    console.error("Error getting course categories:", error)
    throw new Error("Failed to get course categories")
  }
}

export async function getCourseSerializeCategories() {
  try {
    await connectToDB();
    const categories = await CourseCategory.find().sort({ order: 1 }).lean();
    
    return serializeMongoDoc(categories); 
  } catch (error) {
    console.error("Error getting course categories:", error);
    return [];
  }
}

export async function getCategoryById(id: string) {
  try {
    await connectToDB()
    return await CourseCategory.findById(id).lean()
  } catch (error) {
    console.error("Error getting category:", error)
    throw new Error("Failed to get category")
  }
}

export async function createCategory(categoryData: Partial<ICourseCategory>) {
  try {
    await connectToDB()

    // Generate slug from name
    const slug = slugify(categoryData.name!, { lower: true })

    // Check if slug already exists
    const existingCategory = await CourseCategory.findOne({ slug })
    if (existingCategory) {
      throw new Error("A category with this name already exists")
    }

    const newCategory = new CourseCategory({
      ...categoryData,
      slug,
    })

    return await newCategory.save()
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

export async function updateCategory(id: string, categoryData: Partial<ICourseCategory>) {
  try {
    await connectToDB()

    // If name is being updated, update slug too
    if (categoryData.name) {
      categoryData.slug = slugify(categoryData.name, { lower: true })

      // Check if slug already exists for another category
      const existingCategory = await CourseCategory.findOne({
        slug: categoryData.slug,
        _id: { $ne: id },
      })

      if (existingCategory) {
        throw new Error("A category with this name already exists")
      }
    }

    return await CourseCategory.findByIdAndUpdate(id, { $set: categoryData }, { new: true })
  } catch (error) {
    console.error("Error updating category:", error)
    throw error
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectToDB()

    // Check if category has courses
    const coursesCount = await Course.countDocuments({ category: id })
    if (coursesCount > 0) {
      throw new Error("Cannot delete category with associated courses")
    }

    // Check if category has subcategories
    const subCategoriesCount = await CourseCategory.countDocuments({ parentCategory: id })
    if (subCategoriesCount > 0) {
      throw new Error("Cannot delete category with subcategories")
    }

    return await CourseCategory.findByIdAndDelete(id)
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}

export async function updateCategoryOrder(categories: { id: string; order: number }[]) {
  try {
    await connectToDB()

    const updateOperations = categories.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }))

    return await CourseCategory.bulkWrite(updateOperations)
  } catch (error) {
    console.error("Error updating category order:", error)
    throw error
  }
}


export async function getAllCourses(
  options: {
    limit?: number
    page?: number
    category?: string
    search?: string
    featured?: boolean
    sort?: string
    isFree?: boolean
  } = {},
) {
  await connectToDB()

  const { limit = 10, page = 1, category, search, featured, sort = "createdAt_desc" , isFree} = options

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

// Serialized version for client components
export async function getAllCoursesSerialize(
  options: {
    limit?: number
    page?: number
    category?: string
    search?: string
    featured?: boolean
    sort?: string
    isFree?: boolean
    level?: string
  } = {},
) {
  try {
    await connectToDB()

    const { limit = 10, page = 1, category, search, featured, sort = "createdAt_desc", isFree, level } = options

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

    if (isFree !== undefined) {
      query.isFree = isFree
    }

    if (level) {
      query.level = level
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
      courses: serializeMongoDoc(courses),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error getting serialized courses:", error)
    return {
      courses: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
      },
    }
  }
}

export async function getCourseById(id: string) {
  try {
    await connectToDB()
    return await Course.findById(id).populate("category", "name slug").lean()
  } catch (error) {
    console.error("Error getting course:", error)
    throw new Error("Failed to get course")
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    await connectToDB()
    return await Course.findOne({ slug }).populate("category", "name slug").lean()
  } catch (error) {
    console.error("Error getting course by slug:", error)
    throw new Error("Failed to get course")
  }
}

export async function createCourse(courseData: Partial<ICourse>) {
  try {
    await connectToDB()

    // Generate slug from title
    const slug = slugify(courseData.title!, { lower: true })

    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug })
    if (existingCourse) {
      throw new Error("A course with this title already exists")
    }

    const newCourse = new Course({
      ...courseData,
      slug,
    })

    return await newCourse.save()
  } catch (error) {
    console.error("Error creating course:", error)
    throw error
  }
}

export async function updateCourse(id: string, courseData: Partial<ICourse>) {
  try {
    await connectToDB()

    // If title is being updated, update slug too
    if (courseData.title) {
      courseData.slug = slugify(courseData.title, { lower: true })

      // Check if slug already exists for another course
      const existingCourse = await Course.findOne({
        slug: courseData.slug,
        _id: { $ne: id },
      })

      if (existingCourse) {
        throw new Error("A course with this title already exists")
      }
    }

    return await Course.findByIdAndUpdate(id, { $set: courseData }, { new: true })
  } catch (error) {
    console.error("Error updating course:", error)
    throw error
  }
}

export async function deleteCourse(id: string) {
  try {
    await connectToDB()

    // Start a session for transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Delete all chapters, lessons, quizzes, enrollments related to this course
      await Chapter.deleteMany({ course: id }, { session })
      await Lesson.deleteMany({ course: id }, { session })
      await Quiz.deleteMany({ course: id }, { session })
      await Enrollment.deleteMany({ course: id }, { session })
      await Payment.deleteMany({ course: id }, { session })

      // Delete the course
      await Course.findByIdAndDelete(id, { session })

      // Commit the transaction
      await session.commitTransaction()
      session.endSession()

      return { success: true }
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  } catch (error) {
    console.error("Error deleting course:", error)
    throw error
  }
}

// Chapter Functions
// export async function getChaptersByCourse(courseId: string) {
//   try {
//     await connectToDB()
//     return await Chapter.find({ course: courseId }).sort({ order: 1 }).lean()
//   } catch (error) {
//     console.error("Error getting chapters:", error)
//     throw new Error("Failed to get chapters")
//   }
// }

export async function getChaptersByCourse(courseId: string) {
  try {
    await connectToDB();
    
    
    const chapters = await Chapter.find({ course: courseId })
      .sort({ order: 1 })
      .lean();
    
    if (!chapters || chapters.length === 0) {
      return [];
    }
    
    
    const chapterIds = chapters.map(chapter => chapter._id);
    
    
    const lessons = await Lesson.find({ 
      chapter: { $in: chapterIds },
      course: courseId 
    })
      .sort({ order: 1 })
      .lean();
    
    
    const lessonsByChapter = lessons.reduce((acc, lesson) => {
      const chapterId = lesson.chapter.toString();
      if (!acc[chapterId]) {
        acc[chapterId] = [];
      }
      acc[chapterId].push(lesson);
      return acc;
    }, {});
    
    
    const chaptersWithLessons = chapters.map(chapter => {
      const chapterId = chapter._id.toString();
      return {
        ...chapter,
        lessons: lessonsByChapter[chapterId] || [],
        lessonsCount: (lessonsByChapter[chapterId] || []).length
      };
    });
    
    
    return serializeMongoDoc(chaptersWithLessons);
  } catch (error) {
    console.error("Error getting chapters with lessons:", error);
    throw new Error("Failed to get chapters with lessons");
  }
}

export async function getChapterById(id: string) {
  try {
    await connectToDB()
    return await Chapter.findById(id).lean()
  } catch (error) {
    console.error("Error getting chapter:", error)
    throw new Error("Failed to get chapter")
  }
}

export async function createChapter(chapterData: Partial<IChapter>) {
  try {
    await connectToDB()

    // Get the highest order number for this course
    const highestOrder = await Chapter.findOne({ course: chapterData.course })
      .sort({ order: -1 })
      .select("order")
      .lean()

    const newOrder = highestOrder ? highestOrder.order + 1 : 0

    const newChapter = new Chapter({
      ...chapterData,
      order: newOrder,
    })

    const savedChapter = await newChapter.save()

    // Update course total lessons count
    await updateCourseTotalLessons(chapterData.course as string)

    return savedChapter
  } catch (error) {
    console.error("Error creating chapter:", error)
    throw error
  }
}

export async function updateChapter(id: string, chapterData: Partial<IChapter>) {
  try {
    await connectToDB()

    return await Chapter.findByIdAndUpdate(id, { $set: chapterData }, { new: true })
  } catch (error) {
    console.error("Error updating chapter:", error)
    throw error
  }
}

export async function deleteChapter(id: string) {
  try {
    await connectToDB()

    // Start a session for transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Get chapter to find course ID
      const chapter = await Chapter.findById(id).lean()
      if (!chapter) throw new Error("Chapter not found")

      // Delete all lessons and quizzes related to this chapter
      await Lesson.deleteMany({ chapter: id }, { session })
      await Quiz.deleteMany({ chapter: id }, { session })

      // Delete the chapter
      await Chapter.findByIdAndDelete(id, { session })

      // Commit the transaction
      await session.commitTransaction()
      session.endSession()

      // Update course total lessons count
      await updateCourseTotalLessons(chapter.course.toString())

      return { success: true }
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  } catch (error) {
    console.error("Error deleting chapter:", error)
    throw error
  }
}

export async function updateChapterOrder(chapters: { id: string; order: number }[]) {
  try {
    await connectToDB()

    const updateOperations = chapters.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }))

    return await Chapter.bulkWrite(updateOperations)
  } catch (error) {
    console.error("Error updating chapter order:", error)
    throw error
  }
}

// Lesson Functions
export async function getLessonsByChapter(chapterId: string) {
  try {
    await connectToDB()
    return await Lesson.find({ chapter: chapterId }).sort({ order: 1 }).lean()
  } catch (error) {
    console.error("Error getting lessons:", error)
    throw new Error("Failed to get lessons")
  }
}

export async function getLessonById(id: string) {
  try {
    await connectToDB()
    return await Lesson.findById(id).lean()
  } catch (error) {
    console.error("Error getting lesson:", error)
    throw new Error("Failed to get lesson")
  }
}

export async function createLesson(lessonData: Partial<ILesson>) {
  try {
    await connectToDB()

    // Get the highest order number for this chapter
    const highestOrder = await Lesson.findOne({ chapter: lessonData.chapter })
      .sort({ order: -1 })
      .select("order")
      .lean()

    const newOrder = highestOrder ? highestOrder.order + 1 : 0

    const newLesson = new Lesson({
      ...lessonData,
      order: newOrder,
    })

    const savedLesson = await newLesson.save()

    // Update course total lessons count
    await updateCourseTotalLessons(lessonData.course as string)

    return savedLesson
  } catch (error) {
    console.error("Error creating lesson:", error)
    throw error
  }
}

export async function updateLesson(id: string, lessonData: Partial<ILesson>) {
  try {
    await connectToDB()

    return await Lesson.findByIdAndUpdate(id, { $set: lessonData }, { new: true })
  } catch (error) {
    console.error("Error updating lesson:", error)
    throw error
  }
}

export async function deleteLesson(id: string) {
  try {
    await connectToDB()

    // Get lesson to find course ID
    const lesson = await Lesson.findById(id).lean()
    if (!lesson) throw new Error("Lesson not found")

    // Delete the lesson
    await Lesson.findByIdAndDelete(id)

    // Delete any quizzes related to this lesson
    await Quiz.deleteMany({ lesson: id })

    // Update course total lessons count
    await updateCourseTotalLessons(lesson.course.toString())

    return { success: true }
  } catch (error) {
    console.error("Error deleting lesson:", error)
    throw error
  }
}

export async function updateLessonOrder(lessons: { id: string; order: number }[]) {
  try {
    await connectToDB()

    const updateOperations = lessons.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }))

    return await Lesson.bulkWrite(updateOperations)
  } catch (error) {
    console.error("Error updating lesson order:", error)
    throw error
  }
}

// Quiz Functions
export async function getQuizzesByCourse(courseId: string) {
  try {
    await connectToDB()
    return await Quiz.find({ course: courseId }).lean()
  } catch (error) {
    console.error("Error getting quizzes:", error)
    throw new Error("Failed to get quizzes")
  }
}

export async function getQuizById(id: string) {
  try {
    await connectToDB()
    return await Quiz.findById(id).lean()
  } catch (error) {
    console.error("Error getting quiz:", error)
    throw new Error("Failed to get quiz")
  }
}

export async function createQuiz(quizData: Partial<IQuiz>) {
  try {
    await connectToDB()

    const newQuiz = new Quiz(quizData)
    console.log(newQuiz)
    return await newQuiz.save()
  } catch (error) {
    console.error("Error creating quiz:", error)
    throw error
  }
}

export async function updateQuiz(id: string, quizData: Partial<IQuiz>) {
  try {
    await connectToDB()

    return await Quiz.findByIdAndUpdate(id, { $set: quizData }, { new: true })
  } catch (error) {
    console.error("Error updating quiz:", error)
    throw error
  }
}

export async function updateQuizQuestions(quizId: string, questions: any[]) {
  try {
    await connectToDB()

    // Ensure each question has the required fields
    const validatedQuestions = questions.map((question) => ({
      _id: question._id || new ObjectId(), // Keep existing ID or create new one
      question: question.question,
      options: question.options,
      correctOption: question.correctOption,
      explanation: question.explanation || "",
    }))

    return await Quiz.findByIdAndUpdate(
      quizId, 
      { questions: validatedQuestions }, 
      { new: true }
    ).lean()
  } catch (error) {
    console.error("Error updating quiz questions:", error)
    throw error
  }
}

export async function getQuizQuestions(quizId: string) {
  try {
    await connectToDB()
    
    const quiz = await Quiz.findById(quizId).select("questions").lean()
    
    if (!quiz) {
      throw new Error("Quiz not found")
    }
    
    return quiz.questions || []
  } catch (error) {
    console.error("Error getting quiz questions:", error)
    throw error
  }
}

export async function getQuizzesByChapter(chapterId: string) {
  try {
    await connectToDB()
    return await Quiz.find({ chapter: chapterId }).lean()
  } catch (error) {
    console.error("Error getting chapter quizzes:", error)
    throw new Error("Failed to get chapter quizzes")
  }
}

export async function getQuizzesByLesson(lessonId: string) {
  try {
    await connectToDB()
    return await Quiz.find({ lesson: lessonId }).lean()
  } catch (error) {
    console.error("Error getting lesson quizzes:", error)
    throw new Error("Failed to get lesson quizzes")
  }
}

export async function deleteQuiz(id: string) {
  try {
    await connectToDB()
    return await Quiz.findByIdAndDelete(id)
  } catch (error) {
    console.error("Error deleting quiz:", error)
    throw error
  }
}

// Enrollment Functions
export async function enrollUserInCourse(
  userId: string,
  courseId: string,
  paymentData?: {
    paymentMethod: string
    paymentId: string
    transactionId?: string
    amount: number
  },
) {
  try {
    await connectToDB()

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      throw new Error("Course not found")
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    })

    if (existingEnrollment) {
      return existingEnrollment
    }

    // Get all lessons for the course to initialize progress
    const lessons = await Lesson.find({ course: courseId }).lean()

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
      progress: lessons.map((lesson) => ({
        lesson: lesson._id,
        completed: false,
        watchedSeconds: 0,
        lastPosition: 0,
      })),
      paymentStatus: course.isFree ? "free" : paymentData ? "completed" : "pending",
      ...(paymentData && {
        paymentMethod: paymentData.paymentMethod,
        paymentId: paymentData.paymentId,
        transactionId: paymentData.transactionId,
        amount: paymentData.amount,
      }),
    })

    return await enrollment.save()
  } catch (error) {
    console.error("Error enrolling user in course:", error)
    throw error
  }
}

export async function getUserEnrollments(userId: string) {
  try {
    await connectToDB()

    return await Enrollment.find({ user: userId })
      .populate({
        path: "course",
        select: "title slug featuredImage totalLessons",
      })
      .lean()
  } catch (error) {
    console.error("Error getting user enrollments:", error)
    throw new Error("Failed to get enrollments")
  }
}

export async function getEnrollmentById(id: string) {
  try {
    await connectToDB()

    return await Enrollment.findById(id)
      .populate({
        path: "course",
        select: "title slug featuredImage totalLessons",
      })
      .lean()
  } catch (error) {
    console.error("Error getting enrollment:", error)
    throw new Error("Failed to get enrollment")
  }
}

export async function getUserCourseEnrollment(userId: string, courseId: string) {
  try {
    await connectToDB()

    return await Enrollment.findOne({
      user: userId,
      course: courseId,
    }).lean()
  } catch (error) {
    console.error("Error getting user course enrollment:", error)
    throw new Error("Failed to get enrollment")
  }
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
  try {
    await connectToDB()

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    })

    if (!enrollment) {
      throw new Error("Enrollment not found")
    }

    // Find the lesson progress in the enrollment
    const lessonProgressIndex = enrollment.progress.findIndex((p) => p.lesson.toString() === lessonId)

    if (lessonProgressIndex === -1) {
      // If lesson progress doesn't exist, add it
      enrollment.progress.push({
        lesson: new mongoose.Types.ObjectId(lessonId),
        completed: progressData.completed || false,
        watchedSeconds: progressData.watchedSeconds || 0,
        lastPosition: progressData.lastPosition || 0,
        ...(progressData.completed && { completedAt: new Date() }),
      })
    } else {
      // Update existing progress
      if (progressData.completed !== undefined) {
        enrollment.progress[lessonProgressIndex].completed = progressData.completed
        if (progressData.completed) {
          enrollment.progress[lessonProgressIndex].completedAt = new Date()
        }
      }

      if (progressData.watchedSeconds !== undefined) {
        enrollment.progress[lessonProgressIndex].watchedSeconds = progressData.watchedSeconds
      }

      if (progressData.lastPosition !== undefined) {
        enrollment.progress[lessonProgressIndex].lastPosition = progressData.lastPosition
      }
    }

    // Check if all lessons are completed
    const allLessonsCompleted = enrollment.progress.every((p) => p.completed)
    if (allLessonsCompleted && !enrollment.completedAt) {
      enrollment.completedAt = new Date()
    }

    await enrollment.save()
    return enrollment
  } catch (error) {
    console.error("Error updating lesson progress:", error)
    throw error
  }
}

export async function submitQuizAttempt(userId: string, courseId: string, quizId: string, score: number) {
  try {
    await connectToDB()

    // Get the quiz to check passing score
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
      throw new Error("Quiz not found")
    }

    const passed = score >= quiz.passingScore

    // Update enrollment with quiz attempt
    const enrollment = await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      {
        $push: {
          quizAttempts: {
            quiz: quizId,
            score,
            passed,
            completedAt: new Date(),
          },
        },
      },
      { new: true },
    )

    if (!enrollment) {
      throw new Error("Enrollment not found")
    }

    return { enrollment, passed }
  } catch (error) {
    console.error("Error submitting quiz attempt:", error)
    throw error
  }
}

// Payment Functions
export async function createPayment(paymentData: Partial<IPayment>) {
  try {
    await connectToDB()

    const newPayment = new Payment(paymentData)
    return await newPayment.save()
  } catch (error) {
    console.error("Error creating payment:", error)
    throw error
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: "pending" | "completed" | "failed" | "refunded",
  transactionId?: string,
) {
  try {
    await connectToDB()

    const payment = await Payment.findById(paymentId)
    if (!payment) {
      throw new Error("Payment not found")
    }

    payment.status = status
    if (transactionId) {
      payment.transactionId = transactionId
    }

    await payment.save()

    // If payment is completed, update enrollment status
    if (status === "completed") {
      await Enrollment.findOneAndUpdate(
        { user: payment.user, course: payment.course },
        {
          $set: {
            paymentStatus: "completed",
            transactionId: transactionId || payment.transactionId,
          },
        },
      )
    }

    return payment
  } catch (error) {
    console.error("Error updating payment status:", error)
    throw error
  }
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
