import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import {
  getCourseBySlug,
  getChaptersByCourse,
  getUserCourseEnrollment,
} from "@/lib/server/courses";
import { CourseBreadcrumb } from "@/components/courses/course-breadcrumb";
import { ChapterAccordion } from "@/components/courses/chapter-accordion";
import { ChapterQuiz } from "@/components/courses/chapter-quiz"; // Import the ChapterQuiz component
import { CourseFinalQuiz } from "@/components/courses/course-final-quiz"; // Import the CourseFinalQuiz component
import { ProgressBar } from "@/components/courses/progress-bar";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, BookOpen, Award } from "lucide-react";

interface LearnPageProps {
  params: {
    id: string;
  };
  searchParams: {
    chapter?: string;
    final?: string;
  };
}

export async function generateMetadata({ params }: LearnPageProps) {
  const { id } = await params;
  const course = await getCourseBySlug(id);

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: `Learning: ${course.title}`,
    description: `Continue learning ${course.title}`,
  };
}

export default async function LearnPage({
  params,
  searchParams,
}: LearnPageProps) {
  const { id } = await params;
  const sParams = await searchParams;
  // Get user session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/login?callbackUrl=/courses/${id}/learn`);
  }

  const course = await getCourseBySlug(id);
  if (!course) {
    notFound();
  }

  // Check if user is enrolled
  const enrollment = await getUserCourseEnrollment(
    session.user.id,
    course._id.toString()
  );
  if (!enrollment) {
    redirect(`/courses/${id}`);
  }

  const chapters = await getChaptersByCourse(course._id.toString());

  // Calculate progress
  const totalLessons = chapters.reduce(
    (acc, chapter) => acc + (chapter.lessons?.length || 0),
    0
  );

  const completedLessons = enrollment.progress.filter(
    (p) => p.completed
  ).length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Find the first incomplete lesson or the first lesson if none started
  const firstIncompleteLesson = enrollment.progress.find((p) => !p.completed);

  // Get all lesson IDs from chapters
  const allLessons = chapters.flatMap((chapter) => chapter.lessons || []);

  // Find the first lesson if no progress yet
  const firstLesson = allLessons[0];

  // Determine which lesson to continue with
  const continueWithLessonId =
    firstIncompleteLesson?.lesson || firstLesson?._id;

  // Check if a specific chapter is requested
  const selectedChapterId = sParams.chapter;
  const showFinalQuiz = sParams.final === "true";

  // If a chapter is selected, find it
  const selectedChapter = selectedChapterId
    ? chapters.find((chapter) => chapter._id.toString() === selectedChapterId)
    : null;

  // Find the next chapter for navigation
  const selectedChapterIndex = selectedChapter
    ? chapters.findIndex(
        (chapter) => chapter._id.toString() === selectedChapter._id.toString()
      )
    : -1;

  const nextChapter =
    selectedChapterIndex >= 0 && selectedChapterIndex < chapters.length - 1
      ? chapters[selectedChapterIndex + 1]
      : null;

  return (
    <div className="container py-10">
      <CourseBreadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: course.title, href: `/courses/${course.slug}` },
          { label: "Learning" },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="mb-6 text-3xl font-bold">{course.title}</h1>

          {selectedChapter ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{selectedChapter.title}</h2>
              {selectedChapter.description && (
                <div className="rounded-lg border p-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <p>{selectedChapter.description}</p>
                  </div>
                </div>
              )}

              {/* Add the ChapterQuiz component here */}
              <ChapterQuiz
                courseId={course._id.toString()}
                courseSlug={course.slug}
                chapterId={selectedChapter._id.toString()}
                nextChapterId={nextChapter?._id.toString()}
              />
            </div>
          ) : showFinalQuiz ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Final Assessment</h2>
              <p className="text-muted-foreground">
                Complete this final assessment to demonstrate your mastery of
                the course material.
              </p>

              {/* Add the CourseFinalQuiz component here */}
              <CourseFinalQuiz
                courseId={course._id.toString()}
                courseSlug={course.slug}
              />
            </div>
          ) : (
            <div className="mb-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>
                    You've completed {completedLessons} out of {totalLessons}{" "}
                    lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressBar
                    value={completedLessons}
                    total={totalLessons}
                    size="lg"
                    showPercentage
                  />

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                    {continueWithLessonId ? (
                      <Button className="flex-1" asChild>
                        <Link
                          href={`/courses/${course.slug}/learn/${continueWithLessonId}`}
                        >
                          {completedLessons > 0
                            ? "Continue Learning"
                            : "Start Learning"}
                        </Link>
                      </Button>
                    ) : (
                      <Button className="flex-1" disabled>
                        Course Completed
                      </Button>
                    )}

                    {progressPercentage === 100 && (
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/dashboard/certificates`}>
                          <Award className="mr-2 h-4 w-4" />
                          View Certificate
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {progressPercentage === 100 && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <CheckCircle className="mr-3 h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-medium text-green-800">
                          Congratulations!
                        </h3>
                        <p className="text-green-700">
                          You have successfully completed this course.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Add a link to the final quiz when all lessons are completed */}
              {progressPercentage === 100 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Final Assessment</CardTitle>
                    <CardDescription>
                      Take the final assessment to test your knowledge and earn
                      your certificate
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href={`/courses/${course.slug}/learn?final=true`}>
                        Take Final Quiz
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!selectedChapter && !showFinalQuiz && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Course Content</h2>
              <Suspense fallback={<div>Loading course content...</div>}>
                <ChapterAccordion
                  chapters={chapters.map((chapter) => ({
                    ...chapter,
                    lessons: chapter.lessons || [],
                  }))}
                  courseId={course._id.toString()}
                  courseSlug={course.slug}
                  isEnrolled={true}
                  userProgress={{
                    completedLessons: enrollment.progress
                      .filter((p) => p.completed)
                      .map((p) => p.lesson.toString()),
                    currentLesson: firstIncompleteLesson?.lesson?.toString(),
                  }}
                  showChapterQuizLinks={true} // Add this prop to show chapter quiz links
                />
              </Suspense>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Completion
                  </span>
                  <span className="font-medium">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Lessons Completed
                  </span>
                  <span className="font-medium">
                    {completedLessons}/{totalLessons}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Enrolled On
                  </span>
                  <span className="font-medium">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/courses">
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Courses
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard">
                    <Award className="mr-2 h-4 w-4" />
                    My Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
