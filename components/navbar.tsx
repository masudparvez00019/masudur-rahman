"use client";

import { cn } from "@/lib/utils";
import { MenuIcon, MoonIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SignInButton } from "./auth/auth-buttons";
import type { INavItem } from "@/lib/models/header";
import ThemeSwitchButton from "./theme-switch";

interface NavbarProps {
  navItems?: INavItem[];
  logoText?: string;
}

export default function Navbar({
  navItems = [],
  logoText = "Masudur Rahman",
}: NavbarProps) {
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Add timeout refs for smooth dropdown experience
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define which items should be in main navigation (by href)
  const mainNavHrefs = [
    "/#about",
    "/#skills",
    "/#experience",
    "/#services",
    "/#certifications",
    "/#contact",
  ];

  // Fallback data if no navItems provided
  const fallbackMainNavItems = [
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Experience", href: "/#experience" },
    { label: "Services", href: "/#services" },
    { label: "Certifications", href: "/#certifications" },
    { label: "Contact", href: "/#contact" },
  ];

  const fallbackDropdownItems = [
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Courses", href: "/courses" },
    { label: "Tutorial", href: "/tutorial" },
  ];

  // Separate main and dropdown items from API data or use fallback
  const allNavItems =
    navItems.length > 0
      ? navItems
      : [...fallbackMainNavItems, ...fallbackDropdownItems];

  const displayNavItems = allNavItems.filter((item) =>
    mainNavHrefs.includes(item.href)
  );
  const dropdownItems = allNavItems.filter(
    (item) => !mainNavHrefs.includes(item.href)
  );

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Active section detection
      const sections = [
        "about",
        "skills",
        "experience",
        "services",
        "certifications",
        "contact",
      ];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(`/#${currentSection}`);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Improved dropdown handlers
  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150); // 150ms delay before closing
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to check if a nav item is active
  const isNavItemActive = (href: string) => {
    // For hash links (/#about, /#skills, etc.)
    if (href.startsWith("/#")) {
      return activeSection === href;
    }
    // For regular paths (/projects, /blog, etc.)
    return pathname === href;
  };

  // Fix #1: Don't render motion component on server, use standard div instead
  if (!mounted) {
    return (
      <div className="fixed top-4 left-0 right-0 z-30 transition-all duration-300 flex justify-center">
        <div className="bg-background/80 backdrop-blur-md border border-border/30 rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between min-w-[300px]">
            <div className="font-bold text-xl font-['Caveat'] tracking-wider">
              {logoText}
            </div>
            {/* Skip rendering the nav links until client-side */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                className="rounded-full h-8 w-8"
              >
                <MoonIcon className="h-4 w-4" />
              </Button>
              {/* Other buttons without functionality */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fix #2: Only render full navbar with motion after mounting (client-side only)
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-40 flex justify-center"
    >
      <div
        className={cn(
          "relative bg-background/80 backdrop-blur-md border border-purple-600/50 rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-lg border-purple-600/30 shadow-xl transition-all duration-300"
            : ""
        )}
      >
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bold text-xl font-['Caveat'] tracking-wider hover:scale-105 transition-transform duration-200 bg-purple-600 rounded-full text-white px-3 py-1">
              {logoText}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center">
            {displayNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 px-3 py-2 rounded-full hover:bg-accent/50",
                  isNavItemActive(item.href)
                    ? "text-primary bg-accent/30 border border-purple-600 dark:text-white"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 px-3 py-2 rounded-full hover:bg-accent/50 flex items-center gap-1",
                  dropdownItems.some((item) => isNavItemActive(item.href))
                    ? "text-primary bg-accent/30"
                    : "text-muted-foreground"
                )}
              >
                More
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    dropdownOpen ? "rotate-180" : ""
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 min-w-[160px] bg-background/90 backdrop-blur-lg border border-border/60 rounded-2xl py-2 shadow-xl z-50"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block text-sm font-medium transition-all duration-200 px-4 py-2 mx-2 rounded-xl hover:bg-accent/50 hover:text-primary",
                        isNavItemActive(item.href)
                          ? "text-primary bg-accent/30"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <ThemeSwitchButton />
            <SignInButton />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bold text-xl text-primary font-['Caveat'] tracking-wider">
              {logoText}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeSwitchButton />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle mobile menu"
              className="rounded-full h-8 w-8 hover:bg-accent/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-4 w-4" />
              ) : (
                <MenuIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 bg-background/90 backdrop-blur-lg border border-border/60 rounded-2xl py-4 px-4 shadow-xl mx-2"
        >
          <nav className="flex flex-col space-y-2">
            {/* Main Navigation Items */}
            {displayNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "text-sm font-medium transition-all duration-200 p-3 rounded-xl hover:bg-accent/50 hover:scale-[1.02]",
                  isNavItemActive(item.href)
                    ? "text-primary bg-accent/30"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="my-2 h-px bg-border/40" />

            {/* Dropdown Items */}
            {dropdownItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "text-sm font-medium transition-all duration-200 p-3 rounded-xl hover:bg-accent/50 hover:scale-[1.02]",
                  isNavItemActive(item.href)
                    ? "text-primary bg-accent/30"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.div>
  );
}
