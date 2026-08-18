"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeSwitchButton() {
  const { theme, setTheme } = useTheme();
  // Add this state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Only show the UI after component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before mounting, render a placeholder with same dimensions
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Loading theme"
        className="rounded-full"
      >
        <div className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="rounded-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
