import { searchTutorials, getRecentTutorials } from "@/lib/server/tutorials";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Clock,
  Tag,
  Search,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileSearch,
  Filter,
  X,
  TrendingUp,
  Sparkles,
  History,
  Bookmark,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import SearchForm from "@/components/tutorial/SearchForm";
import { SearchFilters } from "@/components/tutorial/SearchFilters";
import { MobileSortDropdown } from "@/components/tutorial/MobileSortDropdown";

interface SearchPageProps {
  searchParams: {
    q?: string;
    filter?: string;
    sort?: string;
    difficulty?: string;
  };
}

export const metadata = {
  title: "Search Tutorials | Masudur Rahman",
  description:
    "Search for tutorials across all programming and development topics",
};

// Function to highlight search terms in text
function highlightSearchText(text: string, query: string) {
  if (!query || !text) return text;

  // Split the text and create an array of parts
  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return parts.map((part, i) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark key={i} className="bg-primary/20 text-foreground px-0.5 rounded">
          {part}
        </mark>
      );
    }
    return part;
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const search = await searchParams;
  const query = search.q || "";
  const filter = search.filter || "all";
  const sort = search.sort || "relevance";
  const difficulty = search.difficulty || "all";

  // Get search results or recent tutorials if no query
  const results = query ? await searchTutorials(query) : [];
  const recentTutorials = query ? [] : await getRecentTutorials(6);

  // Serialize to plain objects
  const serializedResults = JSON.parse(JSON.stringify(results));
  const serializedRecentTutorials = JSON.parse(JSON.stringify(recentTutorials));

  // Apply filters (would be handled by backend in production)
  let filteredResults = [...serializedResults];
  if (difficulty !== "all") {
    filteredResults = filteredResults.filter(
      (item) => item.difficulty?.toLowerCase() === difficulty.toLowerCase()
    );
  }

  if (filter !== "all") {
    filteredResults = filteredResults.filter(
      (item) => item.topic.slug === filter
    );
  }

  // Apply sorting (would be handled by backend in production)
  if (sort === "newest") {
    filteredResults.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sort === "oldest") {
    filteredResults.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  } else if (sort === "popularity") {
    filteredResults.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  }

  // Example popular searches
  const popularSearches = [
    "React",
    "NextJS",
    "TypeScript",
    "TailwindCSS",
    "GraphQL",
  ];

  // Suggested searches based on the current query
  const suggestedSearches = query
    ? popularSearches.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="container py-8 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left sidebar for filters (desktop only) */}
        <div className="hidden lg:block w-64 space-y-6">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold tracking-tight">Filters</h3>
            </div>

            <SearchFilters
              query={query}
              filter={filter}
              sort={sort}
              difficulty={difficulty}
            />

            {/* Popular searches */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Popular Searches</h4>
              <div className="flex flex-wrap gap-1.5">
                {popularSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Link href={`/tutorial/search?q=${term}`}>{term}</Link>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header and search form */}
          <div className="mb-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileSearch className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Tutorial Search
              </h1>
            </div>

            <SearchForm defaultQuery={query} />

            {/* Mobile filters button */}
            <div className="flex lg:hidden">
              <Button variant="outline" className="w-full" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter Results
              </Button>
            </div>

            {/* Search status bar */}
            {query && (
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 text-sm pt-2">
                <div>
                  Found <strong>{filteredResults.length}</strong>{" "}
                  {filteredResults.length === 1 ? "result" : "results"} for{" "}
                  <Badge variant="secondary" className="font-normal">
                    {query}
                  </Badge>
                </div>

                {/* Sort dropdown (mobile only) - This component is now client-side */}
                <p className="lg:hidden flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-1">
                    Sort:
                  </span>
                  <MobileSortDropdown
                    query={query}
                    filter={filter}
                    sort={sort}
                    difficulty={difficulty}
                  />
                </p>
              </div>
            )}
          </div>

          {/* Rest of your search page content */}
          {/* Suggested searches */}
          {query && suggestedSearches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Related Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestedSearches.map((term) => (
                  <Badge
                    key={term}
                    className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
                    
                  >
                    <Link href={`/tutorial/search?q=${term}`}>{term}</Link>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Results or empty state */}
          {query && filteredResults.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl bg-accent/5">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-primary/80" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Results Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No tutorials match your search for "<strong>{query}</strong>".
                Try using different keywords or checking your spelling.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline">
                  <Link href="/tutorial">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Browse All Tutorials
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/tutorial/search">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Search
                  </Link>
                </Button>
              </div>
            </div>
          ) : query ? (
            <>
              {/* Results display */}
              <div className="space-y-5">
                {filteredResults.map((tutorial) => (
                  <Card
                    key={tutorial._id}
                    className="overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                          {/* Difficulty badge */}
                          {tutorial.difficulty && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs py-0",
                                tutorial.difficulty?.toLowerCase() ===
                                  "beginner" &&
                                  "bg-green-500/20 text-green-600",
                                tutorial.difficulty?.toLowerCase() ===
                                  "intermediate" &&
                                  "bg-blue-500/20 text-blue-600",
                                tutorial.difficulty?.toLowerCase() ===
                                  "advanced" &&
                                  "bg-purple-500/20 text-purple-600"
                              )}
                            >
                              {tutorial.difficulty}
                            </Badge>
                          )}

                          <CardTitle className="text-xl">
                            <Link
                              href={`/tutorial/${tutorial.topic.slug}/${tutorial.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {highlightSearchText(tutorial.title, query)}
                            </Link>
                          </CardTitle>

                          <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                            <Link
                              href={`/tutorial/${tutorial.topic.slug}`}
                              className="flex items-center gap-1 text-primary/90 hover:text-primary transition-colors"
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                              {tutorial.topic.title}
                            </Link>
                            <span className="text-muted-foreground/60">•</span>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {tutorial.readTime} min read
                            </div>
                            <span className="text-muted-foreground/60">•</span>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <CalendarDays className="h-3.5 w-3.5" />
                              <span>
                                {new Date(
                                  tutorial.createdAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </CardDescription>
                        </div>

                        <Link
                          href={`/tutorial/${tutorial.topic.slug}/${tutorial.slug}`}
                          className="text-primary hover:text-primary/80 transition-colors hidden sm:block"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-5">
                      <p className="text-muted-foreground">
                        {tutorial.metaDescription
                          ? highlightSearchText(tutorial.metaDescription, query)
                          : "Learn more about this topic in this tutorial."}
                      </p>

                      {tutorial.tags && tutorial.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {tutorial.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={cn(
                                "text-xs",
                                tag
                                  .toLowerCase()
                                  .includes(query.toLowerCase()) &&
                                  "bg-primary/10 border-primary/30 text-primary"
                              )}
                            >
                              {highlightSearchText(tag, query)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="border-t bg-accent/5 py-3 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground text-xs"
                      >
                        <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                        Save
                      </Button>

                      <Button asChild size="sm">
                        <Link
                          href={`/tutorial/${tutorial.topic.slug}/${tutorial.slug}`}
                        >
                          Read Tutorial
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Bottom navigation */}
              <div className="text-center pt-8">
                <Button asChild variant="outline">
                  <Link href="/tutorial">Browse All Tutorials</Link>
                </Button>
              </div>
            </>
          ) : (
            /* No query state - show recent and popular */
            <Tabs defaultValue="recent" className="w-full">
              <TabsList>
                <TabsTrigger value="recent" className="flex gap-1.5">
                  <History className="h-4 w-4" />
                  Recent Tutorials
                </TabsTrigger>
                <TabsTrigger value="popular" className="flex gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  Popular
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="recent"
                className="mt-6 space-y-5 animate-in fade-in-50 duration-300"
              >
                {serializedRecentTutorials.length > 0 ? (
                  serializedRecentTutorials.map((tutorial) => (
                    <Card
                      key={tutorial._id}
                      className="overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1.5">
                            {tutorial.difficulty && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-xs py-0",
                                  tutorial.difficulty?.toLowerCase() ===
                                    "beginner" &&
                                    "bg-green-500/20 text-green-600",
                                  tutorial.difficulty?.toLowerCase() ===
                                    "intermediate" &&
                                    "bg-blue-500/20 text-blue-600",
                                  tutorial.difficulty?.toLowerCase() ===
                                    "advanced" &&
                                    "bg-purple-500/20 text-purple-600"
                                )}
                              >
                                {tutorial.difficulty}
                              </Badge>
                            )}

                            <CardTitle className="text-xl">
                              <Link
                                href={`/tutorial/${tutorial.topic.slug}/${tutorial.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {tutorial.title}
                              </Link>
                            </CardTitle>

                            <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                              <Link
                                href={`/tutorial/${tutorial.topic.slug}`}
                                className="flex items-center gap-1 text-primary/90 hover:text-primary transition-colors"
                              >
                                <BookOpen className="h-3.5 w-3.5" />
                                {tutorial.topic.title}
                              </Link>
                              <span className="text-muted-foreground/60">
                                •
                              </span>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                {tutorial.readTime} min read
                              </div>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-5">
                        <p className="text-muted-foreground">
                          {tutorial.metaDescription ||
                            "Learn more about this topic in this tutorial."}
                        </p>
                      </CardContent>

                      <CardFooter className="border-t bg-accent/5 py-3 justify-end">
                        <Button asChild size="sm">
                          <Link
                            href={`/tutorial/${tutorial.topic.slug}/${tutorial.slug}`}
                          >
                            Read Tutorial
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p>No recent tutorials available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="popular"
                className="mt-6 space-y-5 animate-in fade-in-50 duration-300"
              >
                {/* Popular tutorials content would go here */}
                <div className="text-center py-16">
                  <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Popular Tutorials
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Start your search to discover our most popular tutorials.
                  </p>
                  <Button asChild>
                    <Link href="/tutorial">Browse All Tutorials</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
          {/* ... */}
        </div>
      </div>
    </div>
  );
}
