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

// Search Bar Shimmer
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

// Filter Sidebar Shimmer
function FilterSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search section */}
      <div>
        <Skeleton className="mb-3 h-5 w-20" />
        <SearchSkeleton />
      </div>

      {/* Category filter */}
      <div>
        <Skeleton className="mb-3 h-5 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Level filter */}
      <div>
        <Skeleton className="mb-3 h-5 w-16" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div>
        <Skeleton className="mb-3 h-5 w-16" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>

      {/* Free courses toggle */}
      <div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

// Results Header Shimmer
function ResultsHeaderSkeleton() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}

// Pagination Shimmer
function PaginationSkeleton() {
  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container py-10">
      {/* Page Title */}
      <Skeleton className="mb-6 h-8 w-48" />

      {/* Top Search Bar */}
      <div className="mb-8">
        <SearchSkeleton />
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Filter Sidebar */}
        <div className="md:col-span-1">
          <FilterSkeleton />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          {/* Results Header */}
          <ResultsHeaderSkeleton />

          {/* Separator */}
          <div className="mb-6">
            <Skeleton className="h-px w-full" />
          </div>

          {/* Course Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>

          {/* Pagination */}
          <PaginationSkeleton />
        </div>
      </div>
    </div>
  );
}
