"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string | null;
}

interface CourseFilterProps {
  categories: Category[];
}

export function CourseFilter({ categories }: CourseFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentCategory = searchParams.get("category") || "";
  const currentLevel = searchParams.get("level") || "";
  const currentIsFree = searchParams.get("isFree") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search") || "";
  const currentMinPrice = searchParams.get("minPrice") || "0";
  const currentMaxPrice = searchParams.get("maxPrice") || "500";

  // Local state for filters
  const [category, setCategory] = useState(currentCategory);
  const [level, setLevel] = useState(currentLevel);
  const [isFree, setIsFree] = useState(currentIsFree === "true");
  const [sort, setSort] = useState(currentSort);
  const [priceRange, setPriceRange] = useState([
    Number.parseInt(currentMinPrice),
    Number.parseInt(currentMaxPrice),
  ]);

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) params.set("category", category);
    else params.delete("category");

    if (level) params.set("level", level);
    else params.delete("level");

    if (isFree) params.set("isFree", "true");
    else params.delete("isFree");

    params.set("sort", sort);

    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());

    if (currentSearch) params.set("search", currentSearch);

    router.push(`/courses/search?${params.toString()}`);
  };

  // Reset filters
  const resetFilters = () => {
    setCategory("");
    setLevel("");
    setIsFree(false);
    setSort("newest");
    setPriceRange([0, 500]);

    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);

    router.push(
      `/courses/search${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  // Group categories by parent
  const parentCategories = categories.filter((c) => !c.parentCategory);
  const childCategories = categories.filter((c) => c.parentCategory);

  return (
    <div className="space-y-4">
      {/* Mobile Filter */}
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="space-y-6 py-4">
              <div>
                <h3 className="mb-4 text-lg font-medium">Categories</h3>
                <div className="space-y-4">
                  {parentCategories.map((parentCat) => (
                    <Collapsible key={parentCat._id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-mobile-${parentCat._id}`}
                          checked={category === parentCat._id}
                          onCheckedChange={() =>
                            setCategory(
                              category === parentCat._id ? "" : parentCat._id
                            )
                          }
                        />
                        <Label
                          htmlFor={`category-mobile-${parentCat._id}`}
                          className="flex-1 cursor-pointer text-sm font-medium"
                        >
                          {parentCat.name}
                        </Label>

                        {childCategories.some(
                          (c) => c.parentCategory === parentCat._id
                        ) && (
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Toggle</span>
                            </Button>
                          </CollapsibleTrigger>
                        )}
                      </div>

                      <CollapsibleContent className="pl-6 pt-1">
                        <div className="space-y-2">
                          {childCategories
                            .filter((c) => c.parentCategory === parentCat._id)
                            .map((childCat) => (
                              <div
                                key={childCat._id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`category-mobile-${childCat._id}`}
                                  checked={category === childCat._id}
                                  onCheckedChange={() =>
                                    setCategory(
                                      category === childCat._id
                                        ? ""
                                        : childCat._id
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`category-mobile-${childCat._id}`}
                                  className="cursor-pointer text-sm"
                                >
                                  {childCat.name}
                                </Label>
                              </div>
                            ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-medium">Level</h3>
                <div className="space-y-2">
                  {["beginner", "intermediate", "advanced", "all-levels"].map(
                    (lvl) => (
                      <div key={lvl} className="flex items-center space-x-2">
                        <Checkbox
                          id={`level-mobile-${lvl}`}
                          checked={level === lvl}
                          onCheckedChange={() =>
                            setLevel(level === lvl ? "" : lvl)
                          }
                        />
                        <Label
                          htmlFor={`level-mobile-${lvl}`}
                          className="cursor-pointer text-sm capitalize"
                        >
                          {lvl.replace("-", " ")}
                        </Label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-medium">Price</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="free-mobile"
                      checked={isFree}
                      onCheckedChange={(checked) => setIsFree(checked === true)}
                    />
                    <Label
                      htmlFor="free-mobile"
                      className="cursor-pointer text-sm"
                    >
                      Free Courses
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">${priceRange[0]}</span>
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <Button onClick={applyFilters}>Apply Filters</Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="ml-2 flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                Sort:{" "}
                {sort === "newest"
                  ? "Newest"
                  : sort === "oldest"
                  ? "Oldest"
                  : sort === "price-low"
                  ? "Price: Low to High"
                  : "Price: High to Low"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="newest">
                  Newest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">
                  Oldest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-low">
                  Price: Low to High
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-high">
                  Price: High to Low
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Filter */}
      <div className="hidden md:block">
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Categories</h3>
            <div className="space-y-4">
              {parentCategories.map((parentCat) => (
                <Collapsible key={parentCat._id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${parentCat._id}`}
                      checked={category === parentCat._id}
                      onCheckedChange={() =>
                        setCategory(
                          category === parentCat._id ? "" : parentCat._id
                        )
                      }
                    />
                    <Label
                      htmlFor={`category-${parentCat._id}`}
                      className="flex-1 cursor-pointer text-sm font-medium"
                    >
                      {parentCat.name}
                    </Label>

                    {childCategories.some(
                      (c) => c.parentCategory === parentCat._id
                    ) && (
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>

                  <CollapsibleContent className="pl-6 pt-1">
                    <div className="space-y-2">
                      {childCategories
                        .filter((c) => c.parentCategory === parentCat._id)
                        .map((childCat) => (
                          <div
                            key={childCat._id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`category-${childCat._id}`}
                              checked={category === childCat._id}
                              onCheckedChange={() =>
                                setCategory(
                                  category === childCat._id ? "" : childCat._id
                                )
                              }
                            />
                            <Label
                              htmlFor={`category-${childCat._id}`}
                              className="cursor-pointer text-sm"
                            >
                              {childCat.name}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-medium">Level</h3>
            <div className="space-y-2">
              {["beginner", "intermediate", "advanced", "all-levels"].map(
                (lvl) => (
                  <div key={lvl} className="flex items-center space-x-2">
                    <Checkbox
                      id={`level-${lvl}`}
                      checked={level === lvl}
                      onCheckedChange={() => setLevel(level === lvl ? "" : lvl)}
                    />
                    <Label
                      htmlFor={`level-${lvl}`}
                      className="cursor-pointer text-sm capitalize"
                    >
                      {lvl.replace("-", " ")}
                    </Label>
                  </div>
                )
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-medium">Price</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free"
                  checked={isFree}
                  onCheckedChange={(checked) => setIsFree(checked === true)}
                />
                <Label htmlFor="free" className="cursor-pointer text-sm">
                  Free Courses
                </Label>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={500}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-medium">Sort By</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {sort === "newest"
                    ? "Newest"
                    : sort === "oldest"
                    ? "Oldest"
                    : sort === "price-low"
                    ? "Price: Low to High"
                    : "Price: High to Low"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  <DropdownMenuRadioItem value="newest">
                    Newest
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">
                    Oldest
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-low">
                    Price: Low to High
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-high">
                    Price: High to Low
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
