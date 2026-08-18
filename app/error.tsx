"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { HomeIcon, AlertOctagonIcon, RotateCwIcon } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <AlertOctagonIcon className="w-24 h-24 text-destructive" />
        </div>
        <h1 className="text-5xl font-bold text-gradient">Oops!</h1>
        <h2 className="text-3xl font-semibold">Something Went Wrong</h2>
        <p className="text-muted-foreground max-w-md">
          An unexpected error occurred. We've been notified and are working to
          fix it. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors rounded-md shadow bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <RotateCwIcon className="w-5 h-5 mr-2" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors rounded-md shadow border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Go to Homepage
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Masudur Rahman. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
