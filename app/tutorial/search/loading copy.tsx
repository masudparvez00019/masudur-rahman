import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container max-w-4xl py-8 animate-in fade-in duration-300">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-5 w-full max-w-lg mb-4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-64 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Results placeholder */}
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-6 w-64 mb-2" />
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />

            <div className="pt-2 flex flex-wrap gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Empty state placeholder - conditionally shown */}
      <div className="hidden text-center py-16 border border-dashed rounded-xl">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-7 w-64 mx-auto mb-3" />
        <Skeleton className="h-5 w-full max-w-md mx-auto" />
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}
