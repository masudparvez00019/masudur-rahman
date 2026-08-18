import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getAllCoursesSerialize,
  getCourseSerializeCategories,
} from "@/lib/server/courses";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilter } from "@/components/courses/course-filter";
import { CourseSearch } from "@/components/courses/course-search";
import { CoursePagination } from "@/components/courses/course-pagination";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Search Courses | Learn and Grow",
  description: "Search and filter through our collection of courses.",
};

interface SearchPageProps {
  searchParams: {
    category?: string;
    search?: string;
    level?: string;
    isFree?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const {
    category,
    search,
    level,
    isFree,
    sort = "newest",
    minPrice = "0",
    maxPrice = "500",
    page = "1",
  } = await searchParams;

  // Convert page to number
  const currentPage = Number.parseInt(page, 10) || 1;
  const limit = 9;

  try {
    // Fetch courses with filters
    const { courses, pagination } = await getAllCoursesSerialize({
      category,
      search,
      level,
      isFree: isFree === "true",
      sort,
      limit,
      page: currentPage,
    });

    // Fetch categories for filter
    const categories = await getCourseSerializeCategories();

    console.log(categories);

    return (
      <div className="container py-10">
        <h1 className="mb-6 text-3xl font-bold">Search Courses</h1>

        <div className="mb-8">
          <CourseSearch />
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Filters */}
          <div className="md:col-span-1">
            <CourseFilter categories={categories} />
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {search ? `Results for "${search}"` : "All Courses"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Showing {courses.length} of {pagination?.total || 0} courses
              </p>
            </div>

            <Separator className="mb-6" />

            {courses.length === 0 ? (
              <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No courses found</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <Suspense fallback={<div>Loading courses...</div>}>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
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
                      category={course.category}
                    />
                  ))}
                </div>
              </Suspense>
            )}

            {pagination && pagination.pages > 1 && (
              <div className="mt-8">
                <CoursePagination
                  currentPage={currentPage}
                  totalPages={pagination.pages}
                  baseUrl="/courses/search"
                  searchParams={searchParams}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in search page:", error);

    // এরর হ্যান্ডলিং
    return (
      <div className="container py-10">
        <h1 className="mb-6 text-3xl font-bold">Search Courses</h1>

        <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-destructive border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium text-destructive">
            An error occurred
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Unable to load course data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
