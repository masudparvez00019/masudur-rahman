// import { Suspense } from "react";
// import Link from "next/link";
// import { notFound, redirect } from "next/navigation";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth-options";
// import {
//   getCourseBySlug,
//   getChaptersByCourse,
//   getLessonById,
//   getUserCourseEnrollment,
//   updateLessonProgress,
// } from "@/lib/server/courses";
// import { CourseBreadcrumb } from "@/components/courses/course-breadcrumb";
// import { VideoPlayer } from "@/components/courses/video-player";
// import { ChapterAccordion } from "@/components/courses/chapter-accordion";
// import { LessonQuiz } from "@/components/courses/lesson-quiz"; // Import the LessonQuiz component
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

// interface LessonPageProps {
//   params: {
//     id: string;
//     lessonId: string;
//   };
// }

// export async function generateMetadata({ params }: LessonPageProps) {
//   const { id, lessonId } = await params;
//   const lesson = await getLessonById(lessonId);
//   const course = await getCourseBySlug(id);

//   if (!lesson || !course) {
//     return {
//       title: "Lesson Not Found",
//     };
//   }

//   return {
//     title: `${lesson.title} | ${course.title}`,
//     description:
//       lesson.description || `Learn ${lesson.title} in ${course.title}`,
//   };
// }

// export default async function LessonPage({ params }: LessonPageProps) {
//   const { id, lessonId } = await params;

//   // Get user session

//   const session = await getServerSession(authOptions);
//   if (!session?.user) {
//     redirect(`/login?callbackUrl=/courses/${id}/learn/${lessonId}`);
//   }

//   const course = await getCourseBySlug(id);
//   if (!course) {
//     notFound();
//   }

//   const lesson = await getLessonById(lessonId);
//   if (!lesson) {
//     notFound();
//   }

//   // Check if user is enrolled
//   const enrollment = await getUserCourseEnrollment(
//     session.user.id,
//     course._id.toString()
//   );
//   if (!enrollment) {
//     redirect(`/courses/${id}`);
//   }

//   const chapters = await getChaptersByCourse(course._id.toString());

//   // Find the current chapter
//   const currentChapter = chapters.find((chapter) =>
//     chapter.lessons?.some((l) => l._id.toString() === lessonId)
//   );

//   if (!currentChapter) {
//     notFound();
//   }

//   // Get all lessons from all chapters in order
//   const allLessons = chapters.flatMap((chapter) => chapter.lessons || []);

//   // Find current lesson index
//   const currentLessonIndex = allLessons.findIndex(
//     (l) => l._id.toString() === lessonId
//   );

//   // Get previous and next lessons
//   const previousLesson =
//     currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
//   const nextLesson =
//     currentLessonIndex < allLessons.length - 1
//       ? allLessons[currentLessonIndex + 1]
//       : null;

//   // Check if lesson is completed
//   const lessonProgress = enrollment.progress.find(
//     (p) => p.lesson.toString() === lessonId
//   );
//   const isCompleted = lessonProgress?.completed || false;

//   // Mark lesson as completed
//   const markAsCompleted = async (formData: FormData) => {
//     "use server";

//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return;
//     }

//     try {
//       await updateLessonProgress(
//         session.user.id,
//         course._id.toString(),
//         lessonId,
//         { completed: true }
//       );
//     } catch (error) {
//       console.error("Failed to mark lesson as completed:", error);
//     }
//   };

//   // Update lesson progress
//   const updateProgress = async (data: {
//     currentTime: number;
//     duration: number;
//   }) => {
//     "use server";

//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return { success: false };
//     }

//     try {
//       // Mark as completed if watched more than 90% of the video
//       const completed = data.currentTime >= data.duration * 0.9;

//       await updateLessonProgress(
//         session.user.id,
//         course._id.toString(),
//         lessonId,
//         {
//           watchedSeconds: Math.floor(data.currentTime),
//           lastPosition: Math.floor(data.currentTime),
//           completed,
//         }
//       );
//       return { success: true };
//     } catch (error) {
//       return { success: false };
//     }
//   };

//   console.log("Course ID: ",course._id.toString());
//   console.log("Lesson ID: ",lessonId);

//   return (
//     <div className="container py-10">
//       <CourseBreadcrumb
//         items={[
//           { label: "Courses", href: "/courses" },
//           { label: course.title, href: `/courses/${course.slug}` },
//           { label: "Learning", href: `/courses/${course.slug}/learn` },
//           { label: lesson.title },
//         ]}
//       />

//       <div className="mt-6 grid gap-10 lg:grid-cols-3">
//         {/* Main Content */}
//         <div className="lg:col-span-2">
//           <h1 className="mb-2 text-2xl font-bold">{lesson.title}</h1>
//           <p className="mb-6 text-muted-foreground">
//             {currentChapter.title} • {lesson.duration}
//           </p>

//           <div className="mb-8">
//             <VideoPlayer
//               title={lesson.title}
//               src={lesson.videoUrl || ""}
//               poster={course.featuredImage}
//               onProgress={updateProgress}
//               startTime={lessonProgress?.lastPosition || 0}
//             />
//           </div>

//           {lesson.description && (
//             <div className="mb-8 rounded-lg border p-6">
//               <h2 className="mb-4 text-xl font-semibold">About this lesson</h2>
//               <div className="prose max-w-none dark:prose-invert">
//                 <p>{lesson.description}</p>
//               </div>
//             </div>
//           )}

//           {/* Add the LessonQuiz component here */}
//           <LessonQuiz courseId={course._id.toString()} lessonId={lessonId} />

//           <Separator className="my-8" />

//           <div className="flex flex-col justify-between gap-4 sm:flex-row">
//             <div className="flex gap-2">
//               {previousLesson ? (
//                 <Button variant="outline" asChild>
//                   <Link
//                     href={`/courses/${course.slug}/learn/${previousLesson._id}`}
//                   >
//                     <ChevronLeft className="mr-2 h-4 w-4" />
//                     Previous Lesson
//                   </Link>
//                 </Button>
//               ) : (
//                 <Button variant="outline" disabled>
//                   <ChevronLeft className="mr-2 h-4 w-4" />
//                   Previous Lesson
//                 </Button>
//               )}

//               {nextLesson ? (
//                 <Button asChild>
//                   <Link
//                     href={`/courses/${course.slug}/learn/${nextLesson._id}`}
//                   >
//                     Next Lesson
//                     <ChevronRight className="ml-2 h-4 w-4" />
//                   </Link>
//                 </Button>
//               ) : (
//                 <Button disabled>
//                   Next Lesson
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               )}
//             </div>

//             <form action={markAsCompleted}>
//               <Button
//                 type="submit"
//                 variant={isCompleted ? "outline" : "default"}
//                 className={
//                   isCompleted
//                     ? "border-green-200 bg-green-50 text-green-800 hover:bg-green-100 hover:text-green-900"
//                     : ""
//                 }
//                 disabled={isCompleted}
//               >
//                 {isCompleted ? (
//                   <>
//                     <CheckCircle className="mr-2 h-4 w-4" />
//                     Completed
//                   </>
//                 ) : (
//                   "Mark as Completed"
//                 )}
//               </Button>
//             </form>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-20">
//             <h2 className="mb-4 text-xl font-bold">Course Content</h2>
//             <Suspense fallback={<div>Loading course content...</div>}>
//               <ChapterAccordion
//                 chapters={chapters.map((chapter) => ({
//                   ...chapter,
//                   lessons: chapter.lessons || [],
//                 }))}
//                 courseId={course._id.toString()}
//                 courseSlug={course.slug}
//                 isEnrolled={true}
//                 userProgress={{
//                   completedLessons: enrollment.progress
//                     .filter((p) => p.completed)
//                     .map((p) => p.lesson.toString()),
//                   currentLesson: lessonId,
//                 }}
//               />
//             </Suspense>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import {
  getCourseBySlug,
  getChaptersByCourse,
  getLessonById,
  getUserCourseEnrollment,
  updateLessonProgress,
} from "@/lib/server/courses";
import { CourseBreadcrumb } from "@/components/courses/course-breadcrumb";
import { VideoPlayer } from "@/components/courses/video-player";
import { ChapterAccordion } from "@/components/courses/chapter-accordion";
import { LessonQuiz } from "@/components/courses/lesson-quiz";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";

interface LessonPageProps {
  params: {
    id: string;
    lessonId: string;
  };
}

export async function generateMetadata({ params }: LessonPageProps) {
  const lesson = await getLessonById(params.lessonId);
  const course = await getCourseBySlug(params.id);

  if (!lesson || !course) {
    return {
      title: "Lesson Not Found",
    };
  }

  return {
    title: `${lesson.title} | ${course.title}`,
    description:
      lesson.description || `Learn ${lesson.title} in ${course.title}`,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  // Get user session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(
      `/login?callbackUrl=/courses/${params.id}/learn/${params.lessonId}`
    );
  }

  const course = await getCourseBySlug(params.id);
  if (!course) {
    notFound();
  }

  const lesson = await getLessonById(params.lessonId);
  if (!lesson) {
    notFound();
  }

  // Check if user is enrolled
  const enrollment = await getUserCourseEnrollment(
    session.user.id,
    course._id.toString()
  );
  if (!enrollment) {
    redirect(`/courses/${params.id}`);
  }

  const chapters = await getChaptersByCourse(course._id.toString());

  // Find the current chapter
  const currentChapter = chapters.find((chapter) =>
    chapter.lessons?.some((l) => l._id.toString() === params.lessonId)
  );

  if (!currentChapter) {
    notFound();
  }

  // Find the current chapter index
  const currentChapterIndex = chapters.findIndex(
    (chapter) => chapter._id.toString() === currentChapter._id.toString()
  );

  // Get the next chapter
  const nextChapter =
    currentChapterIndex < chapters.length - 1
      ? chapters[currentChapterIndex + 1]
      : null;

  // Get all lessons from all chapters in order
  const allLessons = chapters.flatMap((chapter) => chapter.lessons || []);

  // Find current lesson index
  const currentLessonIndex = allLessons.findIndex(
    (l) => l._id.toString() === params.lessonId
  );

  // Get previous and next lessons
  const previousLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  // Check if this is the last lesson in the current chapter
  const isLastLessonInChapter =
    currentChapter.lessons.findIndex(
      (l) => l._id.toString() === params.lessonId
    ) ===
    currentChapter.lessons.length - 1;

  // Check if lesson is completed
  const lessonProgress = enrollment.progress.find(
    (p) => p.lesson.toString() === params.lessonId
  );
  const isCompleted = lessonProgress?.completed || false;

  // Mark lesson as completed
  const markAsCompleted = async () => {
    "use server";

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false };
    }

    try {
      await updateLessonProgress(
        session.user.id,
        course._id.toString(),
        params.lessonId,
        { completed: true }
      );
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  // Update lesson progress
  const updateProgress = async (data: {
    currentTime: number;
    duration: number;
  }) => {
    "use server";

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false };
    }

    try {
      // Mark as completed if watched more than 90% of the video
      const completed = data.currentTime >= data.duration * 0.9;

      await updateLessonProgress(
        session.user.id,
        course._id.toString(),
        params.lessonId,
        {
          watchedSeconds: Math.floor(data.currentTime),
          lastPosition: Math.floor(data.currentTime),
          completed,
        }
      );
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  return (
    <div className="container py-10">
      <CourseBreadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: course.title, href: `/courses/${course.slug}` },
          { label: "Learning", href: `/courses/${course.slug}/learn` },
          { label: lesson.title },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="mb-2 text-2xl font-bold">{lesson.title}</h1>
          <p className="mb-6 text-muted-foreground">
            {currentChapter.title} • {lesson.duration}
          </p>

          <div className="mb-8">
            <VideoPlayer
              src={lesson.videoUrl || ""}
              poster={course.featuredImage}
              onProgress={updateProgress}
              startTime={lessonProgress?.lastPosition || 0}
            />
          </div>

          {lesson.description && (
            <div className="mb-8 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">About this lesson</h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>{lesson.description}</p>
              </div>
            </div>
          )}

          {/* Add the LessonQuiz component here */}
          <LessonQuiz
            courseId={course._id.toString()}
            lessonId={params.lessonId}
          />

          <Separator className="my-8" />

          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex gap-2">
              {previousLesson ? (
                <Button variant="outline" asChild>
                  <Link
                    href={`/courses/${course.slug}/learn/${previousLesson._id}`}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Lesson
                </Button>
              )}

              {nextLesson ? (
                <Button asChild>
                  <Link
                    href={`/courses/${course.slug}/learn/${nextLesson._id}`}
                  >
                    Next Lesson
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button disabled>
                  Next Lesson
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {isCompleted && isLastLessonInChapter && nextChapter && (
                <Button variant="secondary" asChild>
                  <Link
                    href={`/courses/${course.slug}/learn?chapter=${nextChapter._id}`}
                  >
                    Next Chapter
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}

              <Button variant="outline" asChild>
                <Link href="/dashboard/courses">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <form action={markAsCompleted}>
                <Button
                  type="submit"
                  variant={isCompleted ? "outline" : "default"}
                  className={
                    isCompleted
                      ? "border-green-200 bg-green-50 text-green-800 hover:bg-green-100 hover:text-green-900"
                      : ""
                  }
                  disabled={isCompleted}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    "Mark as Completed"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <h2 className="mb-4 text-xl font-bold">Course Content</h2>
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
                  currentLesson: params.lessonId,
                }}
              />
            </Suspense>

            <div className="mt-6 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/courses/${course.slug}/learn`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Course Overview
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/courses">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  My Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
