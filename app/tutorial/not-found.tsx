import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookX, Home, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center max-w-xl mx-auto animate-in fade-in duration-500">
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <BookX className="h-16 w-16 text-destructive" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-3 text-gradient">
        Tutorial Not Found
      </h1>

      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        The tutorial or topic you're looking for doesn't exist or may have been
        moved to a different location.
      </p>

      
    </div>
  );
}
