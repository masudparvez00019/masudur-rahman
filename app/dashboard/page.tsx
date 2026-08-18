import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import {
  getUserEnrollments,
  getUserCourseStatistics,
} from "@/lib/server/courses";
import { ProgressBar } from "@/components/courses/progress-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  GraduationCap,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;

  // Get user enrollments and statistics
  const enrollments = await getUserEnrollments(userId);
  const stats = await getUserCourseStatistics(userId);

  // Sort enrollments by most recent
  const sortedEnrollments = [...enrollments].sort(
    (a, b) =>
      new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
  );

  // Get in-progress and completed courses
  const inProgressCourses = sortedEnrollments.filter((e) => !e.completedAt);
  const completedCourses = sortedEnrollments.filter((e) => e.completedAt);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold ">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BookOpen className="mb-2 h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">Enrolled Courses</p>
            <h3 className="text-2xl font-bold">{stats.totalEnrolled}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Clock className="mb-2 h-8 w-8 text-amber-500" />
            <p className="text-sm text-muted-foreground">In Progress</p>
            <h3 className="text-2xl font-bold">{stats.inProgress}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
            <p className="text-sm text-muted-foreground">Completed</p>
            <h3 className="text-2xl font-bold">{stats.completed}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Award className="mb-2 h-8 w-8 text-yellow-500" />
            <p className="text-sm text-muted-foreground">Certificates</p>
            <h3 className="text-2xl font-bold">{stats.completed}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            Your learning progress across all courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={stats.overallProgress}
            total={100}
            size="lg"
            showPercentage
          />
        </CardContent>
      </Card>

      {/* Courses Tabs */}
      <Tabs defaultValue="in-progress">
        <TabsList className="mb-6">
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inProgressCourses.length === 0 ? (
              <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <GraduationCap className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">No courses in progress</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Start learning by enrolling in a course
                </p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <Suspense fallback={<div>Loading courses...</div>}>
                {inProgressCourses.map((enrollment) => {
                  const course = enrollment.course as any;
                  const completedLessons = enrollment.progress.filter(
                    (p) => p.completed
                  ).length;
                  const totalLessons = enrollment.progress.length;
                  const progressPercentage = Math.round(
                    (completedLessons / totalLessons) * 100
                  );

                  return (
                    <Card
                      key={enrollment._id.toString()}
                      className="overflow-hidden"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={course.featuredImage || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">
                          {course.title}
                        </CardTitle>
                        <CardDescription>
                          {completedLessons} of {totalLessons} lessons completed
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <ProgressBar
                          value={completedLessons}
                          total={totalLessons}
                          showPercentage
                        />
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href={`/courses/${course.slug}/learn`}>
                            Continue Learning
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </Suspense>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {completedCourses.length === 0 ? (
              <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Award className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">
                  No completed courses yet
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Complete your enrolled courses to see them here
                </p>
                <Button asChild>
                  <Link href="/dashboard/courses">View My Courses</Link>
                </Button>
              </div>
            ) : (
              <Suspense fallback={<div>Loading courses...</div>}>
                {completedCourses.map((enrollment) => {
                  const course = enrollment.course as any;

                  return (
                    <Card
                      key={enrollment._id.toString()}
                      className="overflow-hidden"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={course.featuredImage || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="rounded-full bg-green-500 p-2">
                            <CheckCircle className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">
                          {course.title}
                        </CardTitle>
                        <CardDescription>
                          Completed on{" "}
                          {new Date(
                            enrollment.completedAt!
                          ).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="grid grid-cols-2 gap-2">
                        <Button variant="outline" asChild>
                          <Link href={`/courses/${course.slug}/learn`}>
                            Review
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link href="/dashboard/certificates">
                            Certificate
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </Suspense>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedEnrollments.length === 0 ? (
              <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <BookOpen className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">No enrolled courses</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Start learning by enrolling in a course
                </p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <Suspense fallback={<div>Loading courses...</div>}>
                {sortedEnrollments.map((enrollment) => {
                  const course = enrollment.course as any;
                  const completedLessons = enrollment.progress.filter(
                    (p) => p.completed
                  ).length;
                  const totalLessons = enrollment.progress.length;
                  const isCompleted = !!enrollment.completedAt;

                  return (
                    <Card
                      key={enrollment._id.toString()}
                      className="overflow-hidden"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={course.featuredImage || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        {isCompleted && (
                          <div className="absolute right-2 top-2 rounded-full bg-green-500 p-1">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">
                          {course.title}
                        </CardTitle>
                        <CardDescription>
                          {isCompleted
                            ? `Completed on ${new Date(
                                enrollment.completedAt!
                              ).toLocaleDateString()}`
                            : `${completedLessons} of ${totalLessons} lessons completed`}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        {isCompleted ? (
                          <Button variant="outline" asChild>
                            <Link href={`/courses/${course.slug}/learn`}>
                              Review
                            </Link>
                          </Button>
                        ) : (
                          <Button asChild>
                            <Link href={`/courses/${course.slug}/learn`}>
                              Continue Learning
                            </Link>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </Suspense>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
