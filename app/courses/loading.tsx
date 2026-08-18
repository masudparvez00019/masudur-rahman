import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Course Card Shimmer Component
function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full" />
        {/* Badge skeleton */}
        <div className="absolute right-2 top-2">
          <Skeleton className="h-6 w-12" />
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category and level badges */}
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Title */}
        <Skeleton className="mb-1 h-6 w-full" />
        <Skeleton className="mb-1 h-6 w-3/4" />

        {/* Subtitle */}
        <Skeleton className="mb-3 h-4 w-full" />
        <Skeleton className="mb-3 h-4 w-2/3" />

        {/* Stats row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/30 p-4">
        <div className="flex w-full items-center justify-between">
          {/* Price */}
          <Skeleton className="h-6 w-16" />
          {/* View Course button */}
          <Skeleton className="h-8 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}

// Search Shimmer Component
function SearchSkeleton() {
  return (
    <div className="relative w-full">
      <Skeleton className="h-10 w-full" />
      <div className="absolute right-0 top-0 h-full px-3 flex items-center">
        <Skeleton className="h-5 w-5" />
      </div>
    </div>
  );
}

// Tabs Shimmer Component
function TabsSkeleton() {
  return (
    <div className="w-full">
      {/* Tabs list */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-20" />
      </div>

      {/* Course grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Call to Action Shimmer
function CTASkeleton() {
  return (
    <div className="rounded-xl bg-muted p-8 md:p-12">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-6 h-4 w-3/4" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex items-center justify-center">
          <Skeleton className="h-[300px] w-[400px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container py-10">
      {/* Featured Courses Section */}
      <section id="featured" className="mb-16 scroll-mt-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-20" />
        </div>

        {/* Search */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <div className="md:col-span-4">
            <SearchSkeleton />
          </div>
        </div>

        {/* Tabs and Course Grid */}
        <TabsSkeleton />
      </section>

      {/* Call to Action */}
      <section>
        <CTASkeleton />
      </section>
    </div>
  );
}
