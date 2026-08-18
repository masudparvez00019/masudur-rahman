import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <BookX className="h-24 w-24 text-muted-foreground mb-8" />
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Topic Not Found
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        The tutorial topic you're looking for doesn't exist or has been moved.
      </p>
      <Button >
        <Link href="/tutorial">Browse All Topics</Link>
      </Button>
    </div>
  );
}
