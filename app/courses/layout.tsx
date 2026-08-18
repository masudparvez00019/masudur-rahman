import { type ReactNode } from "react";
import Link from "next/link";
import { Home, Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitchButton from "@/components/theme-switch";
import Footer from "@/components/footer";

import { getFooter } from "@/lib/server/footer";

interface CoursesLayoutProps {
  children: ReactNode;
}

export default async function CoursesLayout({ children }: CoursesLayoutProps) {
  const footer = await getFooter();

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
                href="/courses"
                className="flex items-center text-md font-medium text-foreground transition-colors hover:text-primary"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                <span className="">Courses</span>
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
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
      <Footer footer={footer} />
    </div>
  );
}
