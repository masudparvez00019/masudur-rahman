"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

// Define categories and common tags
const categories = [
  "All",
  "Web App",
  "Mobile App",
  "UI/UX",
  "Backend",
  "Full Stack",
];
const popularTags = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "Tailwind",
];

export default function ProjectFilters({
  currentCategory,
  currentTag,
  searchQuery,
}: {
  currentCategory: string;
  currentTag: string;
  searchQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(searchQuery);

  function createQueryString(name: string, value: string) {
    const params = new URLSearchParams();

    if (currentCategory && name !== "category") {
      params.set("category", currentCategory);
    }

    if (currentTag && name !== "tag") {
      params.set("tag", currentTag);
    }

    if (searchQuery && name !== "q") {
      params.set("q", searchQuery);
    }

    if (value) {
      params.set(name, value);
    }

    return params.toString();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      const queryString = createQueryString("q", searchInput);
      router.push(`${pathname}?${queryString}`);
    });
  }

  function handleCategoryChange(value: string) {
    startTransition(() => {
      const queryString = createQueryString(
        "category",
        value === "All" ? "" : value
      );
      router.push(`${pathname}?${queryString}`);
    });
  }

  function handleTagChange(value: string) {
    startTransition(() => {
      const queryString = createQueryString(
        "tag",
        value === "All" ? "" : value
      );
      router.push(`${pathname}?${queryString}`);
    });
  }

  function clearAllFilters() {
    setSearchInput("");
    router.push(pathname);
  }

  const hasFilters = currentCategory || currentTag || searchQuery;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex gap-3">
          <Select
            value={currentCategory || "All"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-background/70">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentTag || "All"} onValueChange={handleTagChange}>
            <SelectTrigger className="w-full md:w-[180px] bg-background/70">
              <SelectValue placeholder="Technology" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Technologies</SelectItem>
              {popularTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 bg-background/70"
            />
          </div>
          <Button type="submit" disabled={isPending}>
            Search
          </Button>

          {hasFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearAllFilters}
              aria-label="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {currentCategory && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => handleCategoryChange("All")}
            >
              {currentCategory} <X className="h-3 w-3" />
            </Button>
          )}
          {currentTag && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => handleTagChange("All")}
            >
              {currentTag} <X className="h-3 w-3" />
            </Button>
          )}
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => {
                setSearchInput("");
                const queryString = createQueryString("q", "");
                router.push(`${pathname}?${queryString}`);
              }}
            >
              Search: "{searchQuery}" <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
