import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, ChevronRight, Home } from "lucide-react";

export default function TutorialLoading() {
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
      {/* Left sidebar skeleton - Desktop */}
      <div className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-border/60 overflow-hidden">
        <ScrollArea className="h-full py-6 pl-2 pr-4">
          <div className="flex items-center mb-6">
            <Skeleton className="h-5 w-28 mr-2" />
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
          <div className="space-y-6">
            {/* Topic groups */}
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <div className="ml-2 space-y-2 mt-3">
                    {Array(3)
                      .fill(0)
                      .map((_, j) => (
                        <Skeleton key={j} className="h-8 w-full rounded-md" />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* Left sidebar button - Mobile */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed bottom-6 left-6 z-40 shadow-lg rounded-full h-12 px-4"
      >
        <BookOpen className="h-5 w-5 mr-2" />
        <span>Topics</span>
      </Button>

      {/* Main content area skeleton */}
      <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10 animate-in fade-in duration-300 bg-white/40 dark:bg-black dark:bg-transparent/40 backdrop-blur-sm shadow-md border border-border/50">
        {/* Breadcrumb navigation skeleton */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <Home className="h-3.5 w-3.5 mr-1" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <ChevronRight className="h-3.5 w-3.5 mx-1" />
          <Skeleton className="h-3.5 w-20" />
          <ChevronRight className="h-3.5 w-3.5 mx-1" />
          <Skeleton className="h-3.5 w-32" />
        </div>

        {/* Tutorial header skeleton */}
        <div className="mb-8 space-y-6">
          {/* Back to topic link */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          {/* Tutorial title skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full max-w-2xl" />
          </div>

          {/* Author and metadata skeleton */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 pr-3 border-r">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Skeleton className="h-4 w-4" />
            <div className="flex gap-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-5 w-16 rounded-full" />
                ))}
            </div>
          </div>
        </div>

        {/* Mobile table of contents skeleton */}
        <div className="p-4 mb-6 border rounded-lg bg-accent/10 xl:hidden">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
          </div>
        </div>

        {/* Main tutorial content skeleton */}
        <div className="space-y-6">
          {/* Heading skeletons */}
          <Skeleton className="h-8 w-full max-w-lg" />
          <div className="space-y-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
          </div>

          {/* Code block skeleton */}
          <Skeleton className="h-40 w-full rounded-lg" />

          {/* More content skeletons */}
          <Skeleton className="h-7 w-full max-w-md" />
          <div className="space-y-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
          </div>

          {/* Image placeholder */}
          <Skeleton className="h-72 w-full rounded-lg" />

          {/* Final paragraphs */}
          <div className="space-y-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
          </div>
        </div>

        {/* Like and bookmark section skeleton */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>

        {/* Previous/Next navigation skeleton */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>

        {/* Footer section skeleton */}
        <div className="mt-10 pt-6 border-t">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24" />
              <div className="h-6 w-px bg-border" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>
      </main>

      {/* Right sidebar skeleton */}
      <div className="hidden xl:block w-[240px] shrink-0">
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="border-l pl-5 py-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
            </div>

            {/* Related tutorials skeleton */}
            <div className="mt-8 pt-6 border-t border-border/40">
              <Skeleton className="h-5 w-36 mb-4" />
              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
              </div>
            </div>

            {/* Support section skeleton */}
            <div className="mt-8 pt-6 border-t border-border/40">
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
