"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchFilters({
  query,
  filter = "all",
  sort = "relevance",
  difficulty = "all",
}) {
  const router = useRouter();

  // Function to update URL with new filter parameters
  const updateFilters = (newParams) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (newParams.filter && newParams.filter !== "all")
      params.set("filter", newParams.filter);
    if (newParams.sort && newParams.sort !== "relevance")
      params.set("sort", newParams.sort);
    if (newParams.difficulty && newParams.difficulty !== "all")
      params.set("difficulty", newParams.difficulty);

    router.push(`/tutorial/search?${params.toString()}`);
  };

  // Function to reset all filters
  const resetFilters = () => {
    if (query) {
      router.push(`/tutorial/search?q=${query}`);
    } else {
      router.push("/tutorial/search");
    }
  };

  return (
    <div className="space-y-5">
      {/* Reset filters button */}
      {(filter !== "all" || difficulty !== "all" || sort !== "relevance") && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground"
          onClick={resetFilters}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reset Filters
        </Button>
      )}

      {/* Difficulty filter buttons */}
      <div>
        <h4 className="text-sm font-medium mb-2">Difficulty Level</h4>
        <div className="grid grid-cols-1 gap-1">
          {["all", "beginner", "intermediate", "advanced"].map((level) => (
            <Button
              key={level}
              variant={difficulty === level ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "justify-start text-sm font-normal h-8",
                level === "beginner" &&
                  difficulty === level &&
                  "bg-green-500/20 hover:bg-green-500/30 text-green-600",
                level === "intermediate" &&
                  difficulty === level &&
                  "bg-blue-500/20 hover:bg-blue-500/30 text-blue-600",
                level === "advanced" &&
                  difficulty === level &&
                  "bg-purple-500/20 hover:bg-purple-500/30 text-purple-600"
              )}
              onClick={() => updateFilters({ filter, sort, difficulty: level })}
            >
              {level === "all"
                ? "All Levels"
                : level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Sort options */}
      <div>
        <h4 className="text-sm font-medium mb-2">Sort By</h4>
        <div className="grid grid-cols-1 gap-1">
          {[
            { value: "relevance", label: "Most Relevant" },
            { value: "newest", label: "Newest First" },
            { value: "oldest", label: "Oldest First" },
            { value: "popularity", label: "Most Popular" },
          ].map((option) => (
            <Button
              key={option.value}
              variant={sort === option.value ? "secondary" : "ghost"}
              size="sm"
              className="justify-start text-sm font-normal h-8"
              onClick={() =>
                updateFilters({ filter, sort: option.value, difficulty })
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
