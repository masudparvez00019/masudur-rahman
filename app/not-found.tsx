import Link from "next/link";
import { HomeIcon, AlertTriangleIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <AlertTriangleIcon className="w-24 h-24 text-destructive" />
        </div>
        <h1 className="text-6xl font-bold text-gradient">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors rounded-md shadow bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Go to Homepage
        </Link>
      </div>
      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
}
