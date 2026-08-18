"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  "All",
  "Web Development",
  "UI/UX",
  "Backend",
  "Frontend",
  "React",
  "Next.js",
  "TypeScript",
  "Database",
  "DevOps",
];

export default function CategoryFilter({
  currentCategory,
}: {
  currentCategory: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams();
    if (category !== "All") {
      params.set("category", category);
    }
    router.push(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  return (
    <ScrollArea className="w-full pb-4">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={
              currentCategory === category ||
              (category === "All" && !currentCategory)
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() => handleCategoryClick(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
