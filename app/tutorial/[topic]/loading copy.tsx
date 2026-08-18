import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, ChevronRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TopicLoading() {
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
      {/* Left sidebar skeleton - Desktop */}
      <div className="hidden lg:block w-[350px] xl:w-[350px] shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-border/60 overflow-hidden">
        <ScrollArea className="h-full py-6 pl-2 pr-4">
          <div className="flex items-center mb-6">
            <Skeleton className="h-5 w-32 mr-2" />
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
          <div className="space-y-6">
            {/* Topic groups */}
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <div className="ml-2 space-y-2 mt-3">
                    {Array(3)
                      .fill(0)
                      .map((_, j) => (
                        <Skeleton key={j} className="h-9 w-full rounded-md" />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* Left sidebar - Mobile */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed bottom-6 left-6 z-40 shadow-lg rounded-full h-12 px-4"
      >
        <BookOpen className="h-5 w-5 mr-2" />
        <span>Topics</span>
      </Button>

      {/* Main content area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10 animate-in fade-in duration-300">
        {/* Breadcrumb and back navigation */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Skeleton className="h-4 w-16" />
            <ChevronRight className="h-4 w-4 mx-1" />
            <Skeleton className="h-4 w-24" />
          </nav>

          {/* Topic hero section */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Topic image skeleton */}
            <div className="w-full sm:w-2/3 lg:w-1/3 aspect-video relative rounded-xl overflow-hidden shadow-md border border-border/50 mx-auto lg:mx-0">
              <Skeleton className="h-full w-full" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <Skeleton className="h-9 w-full max-w-md" />
              <Skeleton className="h-6 w-full max-w-2xl" />

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden shadow-sm h-[280px] flex flex-col"
              >
                <div className="p-6 pb-3 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      {i < 2 && <Skeleton className="h-5 w-10 rounded-full" />}
                    </div>
                    <Skeleton className="h-5 w-12" />
                  </div>

                  <Skeleton className="h-7 w-full max-w-xs" />

                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-3 flex-grow">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                <div className="mt-auto border-t p-4 bg-accent/5">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Bottom navigation and back to top skeleton */}
        <div className="mt-10 flex flex-wrap items-center justify-between border-t pt-6 gap-4">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </main>

      {/* Right sidebar placeholder */}
      <div className="hidden xl:block w-[240px] shrink-0">
        {/* This space is intentionally left empty to match the layout structure */}
      </div>
    </div>
  );
}
