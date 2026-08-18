import { Card, CardContent } from "@/components/ui/card";

export default function ProjectsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <SkeletonCard key={i} delay={i * 0.05} />
        ))}
    </div>
  );
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <Card
      className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm animate-pulse"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative h-48 bg-muted/40"></div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-muted/60 rounded w-1/4"></div>
          <div className="h-6 bg-muted/60 rounded w-3/4"></div>
          <div className="h-4 bg-muted/60 rounded w-full"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-muted/60 rounded w-16"></div>
            <div className="h-6 bg-muted/60 rounded w-16"></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-8 bg-muted/60 rounded w-28"></div>
            <div className="h-8 bg-muted/60 rounded w-16"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
