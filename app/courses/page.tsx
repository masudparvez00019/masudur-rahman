import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getAllCoursesSerialize,
  getCourseSerializeCategories,
} from "@/lib/server/courses";
import { CourseCard } from "@/components/courses/course-card";
import { CourseSearch } from "@/components/courses/course-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Courses | Learn and Grow",
  description:
    "Browse our collection of courses to enhance your skills and knowledge.",
};

// Enable SSG for courses page
export const revalidate = 3600; // Revalidate every hour
export const dynamic = "force-static"; // Force static generation

export default async function CoursesPage() {
  // Fetch featured courses, categories, and stats
  const { courses: allCourses } = await getAllCoursesSerialize({ limit: 6 });
  const { courses: freeCourses } = await getAllCoursesSerialize({
    limit: 3,
    isFree: true,
  });
  const { courses: popularCourses } = await getAllCoursesSerialize({
    limit: 3,
    sort: "popular",
  });
  const categories = await getCourseSerializeCategories();

  // Filter parent categories
  const parentCategories = categories.filter((cat) => !cat.parentCategory);

  return (
    <div className="container py-10">
      {/* Featured Courses */}
      <section id="featured" className="mb-16 scroll-mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Courses</h2>
          <Button variant="ghost" asChild>
            <Link href="/courses/search">View All</Link>
          </Button>
        </div>
        {/* Search and Stats */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <div className="md:col-span-4">
            <CourseSearch />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="free">Free Courses</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
          <TabsContent
            value="all"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <Suspense fallback={<div>Loading courses...</div>}>
              {allCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  slug={course.slug}
                  subtitle={course.subtitle}
                  featuredImage={course.featuredImage}
                  price={course.price}
                  salePrice={course.salePrice}
                  isFree={course.isFree}
                  duration={course.duration}
                  level={course.level}
                  totalLessons={course.totalLessons}
                  category={course.category as any}
                />
              ))}
            </Suspense>
          </TabsContent>
          <TabsContent
            value="free"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <Suspense fallback={<div>Loading courses...</div>}>
              {freeCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  slug={course.slug}
                  subtitle={course.subtitle}
                  featuredImage={course.featuredImage}
                  price={course.price}
                  salePrice={course.salePrice}
                  isFree={course.isFree}
                  duration={course.duration}
                  level={course.level}
                  totalLessons={course.totalLessons}
                  category={course.category as any}
                />
              ))}
            </Suspense>
          </TabsContent>
          <TabsContent
            value="popular"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <Suspense fallback={<div>Loading courses...</div>}>
              {popularCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  slug={course.slug}
                  subtitle={course.subtitle}
                  featuredImage={course.featuredImage}
                  price={course.price}
                  salePrice={course.salePrice}
                  isFree={course.isFree}
                  duration={course.duration}
                  level={course.level}
                  totalLessons={course.totalLessons}
                  category={course.category as any}
                />
              ))}
            </Suspense>
          </TabsContent>
        </Tabs>
      </section>

      {/* Call to Action */}
      <section className="rounded-xl bg-muted p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Start Learning?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Join thousands of students who are already learning and growing
              with our courses. Whether you're looking to advance your career or
              pursue a passion, we have the right course for you.
            </p>
            <Button size="lg" asChild>
              <Link href="/courses/search">Explore All Courses</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Students learning"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
