import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import {
  getCourseBySlug,
  getChaptersByCourse,
  getUserCourseEnrollment,
  enrollUserInCourse,
} from "@/lib/server/courses";
import { CourseBreadcrumb } from "@/components/courses/course-breadcrumb";
import { ChapterAccordion } from "@/components/courses/chapter-accordion";
import { PaymentModal } from "@/components/courses/payment-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  BarChart,
  CheckCircle,
  PlayCircle,
} from "lucide-react";

interface CoursePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CoursePageProps) {
  const {id} = await params;
  const course = await getCourseBySlug(id);

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: `${course.title} | Course`,
    description: course.subtitle || course.description.slice(0, 160),
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = await getCourseBySlug(id);

  if (!course) {
    notFound();
  }

  const chapters = await getChaptersByCourse(course._id.toString());

  // Get user session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Check if user is enrolled
  let isEnrolled = false;
  let enrollment = null;

  if (userId) {
    enrollment = await getUserCourseEnrollment(userId, course._id.toString());
    isEnrolled = !!enrollment;
  }

  // Calculate total course duration
  const totalLessons = course.totalLessons;

  // Handle enrollment for free courses
  const handleFreeEnrollment = async () => {
    "use server";

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to enroll" };
    }

    try {
      await enrollUserInCourse(session.user.id, course._id.toString());
      return { success: true };
    } catch (error) {
      return { success: false, message: "Failed to enroll in course" };
    }
  };

  return (
    <div className="container py-10">
      <CourseBreadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: course.title },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        {/* Course Details */}
        <div className="lg:col-span-2">
          <h1 className="mb-2 text-3xl font-bold">{course.title}</h1>
          {course.subtitle && (
            <p className="mb-4 text-xl text-muted-foreground">
              {course.subtitle}
            </p>
          )}

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {course.category.name}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {course.duration}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BarChart className="mr-1 h-4 w-4" />
              <span className="capitalize">
                {course.level.replace("-", " ")}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="mr-1 h-4 w-4" />
              {totalLessons} lessons
            </div>
          </div>

          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={course.featuredImage || "/placeholder.svg"}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
            {course.previewVideo && (
              <Link
                href={`/courses/${course.slug}/preview`}
                className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity hover:bg-black/60"
              >
                <div className="flex items-center rounded-full bg-primary p-3 text-primary-foreground">
                  <PlayCircle className="h-8 w-8" />
                  <span className="ml-2 mr-3 font-medium">Watch Preview</span>
                </div>
              </Link>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold">About This Course</h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>{course.description}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="mb-4 text-2xl font-bold">What You'll Learn</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {course.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="mb-4 text-2xl font-bold">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="mb-4 text-2xl font-bold">Course Content</h2>
              <Suspense fallback={<div>Loading course content...</div>}>
                <ChapterAccordion
                  chapters={chapters.map((chapter) => ({
                    ...chapter,
                    lessons: chapter.lessons || [],
                  }))}
                  courseId={course._id.toString()}
                  courseSlug={course.slug}
                  isEnrolled={isEnrolled}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Enrollment Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="mb-4">
                {course.isFree ? (
                  <div className="mb-2 text-2xl font-bold text-green-600">
                    Free
                  </div>
                ) : (
                  <div className="mb-2">
                    {course.salePrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          ${course.salePrice}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          ${course.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold">
                        ${course.price}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="rounded-md bg-green-50 p-4 text-green-800">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span className="font-medium">
                        You are enrolled in this course
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/courses/${course.slug}/learn`}>
                      Continue Learning
                    </Link>
                  </Button>
                </div>
              ) : course.isFree ? (
                <form action={handleFreeEnrollment}>
                  <Button type="submit" className="w-full">
                    Enroll Now (Free)
                  </Button>
                </form>
              ) : (
                <PaymentModal
                  courseId={course._id.toString()}
                  courseTitle={course.title}
                  courseImage={course.featuredImage}
                  price={course.price}
                  salePrice={course.salePrice}
                  trigger={
                    <Button className="w-full">
                      Enroll for ${course.salePrice || course.price}
                    </Button>
                  }
                />
              )}

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Level</span>
                  <span className="capitalize">
                    {course.level.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lessons</span>
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <Link
                    href={`/courses/category/${course.category.slug}`}
                    className="text-primary hover:underline"
                  >
                    {course.category.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
