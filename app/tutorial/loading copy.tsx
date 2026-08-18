import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  BookOpen,
  GraduationCap,
  Clock,
  ArrowRight,
  Search,
  ExternalLink,
  Menu,
  BookMarked,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function TutorialsLoading() {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_220px] gap-6 md:gap-10">
      {/* Left sidebar with mobile drawer support */}
      <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] md:sticky md:block">
        <ScrollArea className="h-full py-6 pl-2 pr-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Topics</h3>
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search topics..."
              className="w-full pl-8 py-2 h-9 text-sm"
              disabled
            />
          </div>

          <div className="space-y-1.5 mt-4">
            <Skeleton className="h-8 w-full" />

            <div className="py-2">
              <h4 className="mb-1 px-2 text-sm font-medium text-muted-foreground">
                Popular Topics
              </h4>
              <div className="space-y-1">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t mt-4">
              <h4 className="mb-1 px-2 text-sm font-medium text-muted-foreground">
                Resources
              </h4>
              <div className="space-y-1">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile navigation drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden fixed bottom-4 right-4 z-40 shadow-md"
          >
            <Menu className="h-5 w-5" />
            <span className="ml-2">Browse Topics</span>
          </Button>
        </SheetTrigger>
      </Sheet>

      {/* Main content area */}
      <main className="relative px-4 md:px-0 py-6 animate-in fade-in duration-300">
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <GraduationCap className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Learning Resource</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
            Technical Tutorials
          </h1>
          <Skeleton className="h-6 w-full max-w-[46rem]" />
        </div>

        {/* Featured section for most popular topics */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Featured Topics</h2>
            <Button variant="ghost" size="sm" className="gap-1" disabled>
              View all
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="aspect-[16/9] relative overflow-hidden bg-accent/20">
                    <div className="w-full h-full flex items-center justify-center">
                      <BookMarked className="h-12 w-12 text-primary/30" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90">Featured</Badge>
                    </div>
                  </div>

                  <div className="p-5 pb-2">
                    <Skeleton className="h-7 w-3/4 mb-2" />
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>

                  <div className="px-5 pb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <span>•</span>
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>

                  <div className="pt-3 border-t bg-accent/5 px-4 py-3">
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* All topics section with improved grid layout */}
        <div className="pt-8 border-t">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">All Topics</h2>
              <Skeleton className="h-5 w-56" />
            </div>
            <div className="flex gap-2">
              <div className="hidden md:block">
                <Skeleton className="h-9 w-24" />
              </div>
              <div className="hidden md:block">
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-md flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Want to suggest a topic?
              </h2>
              <Skeleton className="h-5 w-64" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </main>

      {/* Right sidebar */}
      <aside className="hidden text-sm lg:block">
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="space-y-6 border-l pl-6">
            {/* Quick links section */}
            <div>
              <h2 className="mb-3 text-lg font-medium text-foreground">
                Quick Links
              </h2>
              <div className="space-y-3">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="border-t pt-6">
              <h2 className="mb-3 text-lg font-medium text-foreground">
                Stay Updated
              </h2>
              <Skeleton className="h-5 w-full mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-4 w-4/5 mt-2" />
            </div>

            {/* External resources */}
            <div className="border-t pt-6">
              <h2 className="mb-3 text-lg font-medium text-foreground">
                Recommended Resources
              </h2>
              <div className="space-y-2">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center">
                      <ExternalLink className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-xs text-muted-foreground">
              <Skeleton className="h-3 w-40 mb-1" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
