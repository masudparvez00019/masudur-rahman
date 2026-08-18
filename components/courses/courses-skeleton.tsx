import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CoursesSkeletonLoaderProps {
  count?: number;
}

export function CoursesSkeletonLoader({
  count = 3,
}: CoursesSkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="mb-1 h-6 w-full" />
            <Skeleton className="mb-3 h-6 w-3/4" />
            <Skeleton className="mb-3 h-4 w-full" />
            <div className="mt-3 flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 p-4">
            <div className="flex w-full items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
