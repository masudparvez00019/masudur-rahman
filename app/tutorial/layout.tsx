import { type ReactNode, Suspense } from "react";
import Link from "next/link";
import { getTutorialTopics } from "@/lib/server/tutorials";
import { Search, Book, Bookmark, Home, ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SearchBox from "@/components/tutorial/SearchBox";
import ThemeSwitchButton from "@/components/theme-switch";

interface TutorialLayoutProps {
  children: ReactNode;
}

export default async function TutorialLayout({
  children,
}: TutorialLayoutProps) {
  const topics = await getTutorialTopics();

  return (
    <div className="min-h-screen ">
      {/* Background with blur effect */}
      {/* <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-50 background-image blur-md backdrop-blur"></div> */}
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10 items-center">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label="Home"
            >
              <Home className="h-5 w-5 text-primary" />
              <span className="inline-block font-bold text-gradient">
                Portfolio
              </span>
            </Link>
            <div className="h-6 w-px bg-border hidden md:block" />
            <nav className="flex gap-6">
              <Link
                href="/tutorial"
                className="flex items-center text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Tutorials</span>
                <Badge variant="outline" className="ml-2 px-1.5 py-0.5">
                  {topics.length}
                </Badge>
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Suspense
                fallback={
                  <div className="relative w-full md:w-[200px] lg:w-[300px] h-9 rounded-md bg-accent/50 animate-pulse" />
                }
              >
                <SearchBox />
              </Suspense>
            </div>
            <nav className="flex space-x-2">
              <ThemeSwitchButton />
              <Button
                variant="outline"
                className="hidden md:flex gap-2 items-center"
              >
                <Link
                  className="flex items-center justify-between gap-2"
                  href="/profile"
                >
                  <Menu className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>{" "}
      {children}
    </div>
  );
}
