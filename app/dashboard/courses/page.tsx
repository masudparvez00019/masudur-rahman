// import type { Metadata } from "next";
// import { EnrolledCourses } from "@/components/dashboard/enrolled-courses";

// export const metadata: Metadata = {
//   title: "My Courses",
//   description: "View and manage your enrolled courses",
// };

// export default function CoursesPage() {
//   return (
//     <div className="container py-10">
//       <h1 className="mb-6 text-3xl font-bold">My Courses</h1>
//       <EnrolledCourses />
//     </div>
//   );
// }

import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { getUserEnrollments } from "@/lib/server/courses";
import { CourseCard } from "@/components/courses/course-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "My Courses | Dashboard",
  description: "Manage your enrolled courses",
};

export default async function DashboardCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/courses");
  }

  const enrollments = await getUserEnrollments(session.user.id);

  // Group enrollments by status
  const inProgressEnrollments = enrollments.filter(
    (enrollment) => !enrollment.completedAt
  );
  const completedEnrollments = enrollments.filter(
    (enrollment) => enrollment.completedAt
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Courses</h1>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">
            All Courses ({enrollments.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressEnrollments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedEnrollments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Suspense
              fallback={Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
                ))}
            >
              {enrollments.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mb-2 text-lg font-medium">
                    You haven't enrolled in any courses yet
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Browse our courses and start learning new skills today!
                  </p>
                  <a
                    href="/courses"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Browse Courses
                  </a>
                </div>
              ) : (
                enrollments.map((enrollment) => {
                  const course = enrollment.course as any;
                  const completedLessons = enrollment.progress.filter(
                    (p) => p.completed
                  ).length;
                  const totalLessons = enrollment.progress.length;
                  const progress = Math.round(
                    (completedLessons / totalLessons) * 100
                  );

                  return (
                    <CourseCard
                      key={enrollment._id.toString()}
                      id={course._id}
                      title={course.title}
                      slug={course.slug}
                      featuredImage={course.featuredImage}
                      price={0}
                      isFree={true}
                      duration={course.duration || ""}
                      level={course.level || "beginner"}
                      totalLessons={course.totalLessons}
                      category={{ name: "", slug: "" }}
                      progress={progress}
                      isEnrolled={true}
                      enrollmentId={enrollment._id.toString()}
                      completedAt={enrollment.completedAt}
                    />
                  );
                })
              )}
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Suspense
              fallback={Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
                ))}
            >
              {inProgressEnrollments.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mb-2 text-lg font-medium">
                    No courses in progress
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Continue learning or enroll in new courses to see them here.
                  </p>
                  <a
                    href="/courses"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Browse Courses
                  </a>
                </div>
              ) : (
                inProgressEnrollments.map((enrollment) => {
                  const course = enrollment.course as any;
                  const completedLessons = enrollment.progress.filter(
                    (p) => p.completed
                  ).length;
                  const totalLessons = enrollment.progress.length;
                  const progress = Math.round(
                    (completedLessons / totalLessons) * 100
                  );

                  return (
                    <CourseCard
                      key={enrollment._id.toString()}
                      id={course._id}
                      title={course.title}
                      slug={course.slug}
                      featuredImage={course.featuredImage}
                      price={0}
                      isFree={true}
                      duration={course.duration || ""}
                      level={course.level || "beginner"}
                      totalLessons={course.totalLessons}
                      category={{ name: "", slug: "" }}
                      progress={progress}
                      isEnrolled={true}
                      enrollmentId={enrollment._id.toString()}
                    />
                  );
                })
              )}
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Suspense
              fallback={Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
                ))}
            >
              {completedEnrollments.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mb-2 text-lg font-medium">
                    No completed courses yet
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Complete your enrolled courses to see them here.
                  </p>
                  <a
                    href="/dashboard"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Go to Dashboard
                  </a>
                </div>
              ) : (
                completedEnrollments.map((enrollment) => {
                  const course = enrollment.course as any;
                  return (
                    <CourseCard
                      key={enrollment._id.toString()}
                      id={course._id}
                      title={course.title}
                      slug={course.slug}
                      featuredImage={course.featuredImage}
                      price={0}
                      isFree={true}
                      duration={course.duration || ""}
                      level={course.level || "beginner"}
                      totalLessons={course.totalLessons}
                      category={{ name: "", slug: "" }}
                      progress={100}
                      isEnrolled={true}
                      enrollmentId={enrollment._id.toString()}
                      completedAt={enrollment.completedAt}
                    />
                  );
                })
              )}
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
