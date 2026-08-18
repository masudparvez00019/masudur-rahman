import { Card, CardContent } from "@/components/ui/card";

export default function BlogSkeleton({
  count = 6,
  featured = false,
}: {
  count?: number;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <div className="mb-12">
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm animate-pulse">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="h-64 md:h-80 bg-muted/40"></div>
            <CardContent className="p-8">
              <div className="space-y-5">
                <div className="h-6 bg-muted/60 rounded w-1/4"></div>
                <div className="h-8 bg-muted/60 rounded-lg w-3/4"></div>
                <div className="h-4 bg-muted/60 rounded w-full"></div>
                <div className="h-4 bg-muted/60 rounded w-5/6"></div>
                <div className="h-4 bg-muted/60 rounded w-4/5"></div>
                <div className="h-8 bg-muted/60 rounded w-1/4 mt-4"></div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
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
        <div className="space-y-3">
          <div className="h-3 bg-muted/60 rounded w-1/2"></div>
          <div className="h-6 bg-muted/60 rounded w-4/5"></div>
          <div className="h-4 bg-muted/60 rounded w-full"></div>
          <div className="h-4 bg-muted/60 rounded w-2/3"></div>
          <div className="h-8 bg-muted/60 rounded w-1/4 mt-2"></div>
        </div>
      </CardContent>
    </Card>
  );
}
