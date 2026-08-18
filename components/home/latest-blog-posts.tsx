"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Clock,
  ArrowRight,
  BookOpen,
  ChevronRight,
  AlertCircle,
  LayoutGrid,
  BookMarked,
  Hash,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "../ui/section-heading";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { IBlog } from "@/lib/models/blog";
import { fallbackArticlePosts } from "@/lib/data";

// Article card component with enhanced features
const BlogCard = ({ post, index }: { post: IBlog; index: number }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Calculate if the post is new (less than 7 days old)
  const isNew =
    new Date().getTime() - new Date(post.createdAt).getTime() <
    7 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post._id}`} className="block h-full group">
        <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-lg relative flex flex-col">
          {/* Image container with category badge and new indicator */}
          <div className="relative">
            <div className="relative h-52 overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg?height=400&width=600"}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={90}
                priority={index < 2}
                className="object-cover transition duration-500 ease-in-out group-hover:scale-105"
              />

              {/* Category badge */}
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-black/70 hover:bg-black/80 backdrop-blur-sm text-white border-none">
                  {post.category}
                </Badge>
              </div>

              {/* New post indicator */}
              {isNew && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground text-xs py-1 px-2 rounded-md">
                    <Sparkles className="h-3 w-3" />
                    <span>New</span>
                  </div>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-60 group-hover:opacity-80 transition-opacity"></div>
            </div>

            {/* Bottom metadata */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10">
              <div className="flex items-center gap-2 text-xs text-white">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-white bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Content area */}
          <CardContent className="p-5 flex-grow">
            <div className="space-y-3">
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-secondary/40 text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>

          {/* Footer with read more button */}
          <CardFooter className="px-5 pb-5 pt-0 mt-auto">
            <Button
              variant="ghost"
              className="gap-1 px-0 text-primary hover:text-primary hover:bg-transparent group"
            >
              <span>Read Article</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function LatestBlogPosts() {
  const [blogPosts, setBlogPosts] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function fetchBlogPosts() {
      setLoading(true);
      try {
        const response = await fetch("/api/blogs?published=true", {
          next: { revalidate: 3600 }, // Revalidate cache every hour
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }

        const data = await response.json();
        setBlogPosts(data.length > 0 ? data : fallbackArticlePosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts(fallbackArticlePosts);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  // Extract unique categories for filtering
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(blogPosts.map((post) => post.category))
    );
    return ["all", ...uniqueCategories];
  }, [blogPosts]);

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") {
      return blogPosts;
    }
    return blogPosts.filter((post) => post.category === activeCategory);
  }, [blogPosts, activeCategory]);

  // Get the posts to display (latest 3 or by category)
  const postsToDisplay = filteredPosts.slice(0, 3);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const emptyState = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.2 } },
  };

  return (
    <section id="blog" className="py-16 md:py-24 relative">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/4 -z-10 transform translate-x-1/2 ">
        <svg
          width="404"
          height="404"
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
          className="text-primary/10"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="404"
            height="404"
            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <SectionHeading
            title="Latest Articles"
            subtitle="Insights, tutorials, and industry trends"
            align="left"
            className="mb-0"
          />

          <div className="flex items-center">
            <div className="flex items-center gap-2 text-sm border-l pl-4 border-border">
              <BookMarked className="h-4 w-4 text-primary" />
              <span>
                <span className="font-medium">{blogPosts.length}</span> articles
                published
              </span>
            </div>
          </div>
        </div>

        {/* Error message if API fails */}
        {error && (
          <div className="mb-6">
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-lg py-2 px-4 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Could not load blog posts from the server. Showing example
                content instead.
              </p>
            </div>
          </div>
        )}

        {/* Category filter - only show if we have categories */}
        {/* {categories.length > 1 && !loading && (
          <div className="mb-8">
            <Tabs
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList className="h-9 p-1 grid grid-flow-col auto-cols-max gap-1 overflow-x-auto max-w-full">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className={cn(
                      "px-3 rounded-md",
                      category === "all" ? "gap-1" : ""
                    )}
                  >
                    {category === "all" ? (
                      <>
                        <LayoutGrid className="h-3.5 w-3.5 mr-1" />
                        All Categories
                      </>
                    ) : (
                      <>
                        <Hash className="h-3.5 w-3.5 mr-1" />
                        {category}
                      </>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )} */}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory} // Re-render animation when filter changes
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={`skeleton-${index}`}>
                  <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="relative h-52 bg-muted/70 animate-pulse"></div>
                    <CardContent className="p-5 space-y-3">
                      <div className="h-6 bg-muted/70 animate-pulse rounded w-3/4"></div>
                      <div className="h-4 bg-muted/70 animate-pulse rounded w-full"></div>
                      <div className="h-4 bg-muted/70 animate-pulse rounded w-2/3"></div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-5 w-16 bg-muted/70 animate-pulse rounded-full"
                          ></div>
                        ))}
                      </div>
                    </CardContent>
                    <div className="px-5 py-3 border-t border-border/40">
                      <div className="h-4 bg-muted/70 animate-pulse rounded w-1/4"></div>
                    </div>
                  </Card>
                </div>
              ))
            ) : postsToDisplay.length > 0 ? (
              // Blog posts grid
              postsToDisplay.map((post, index) => (
                <BlogCard key={post._id.toString()} post={post} index={index} />
              ))
            ) : (
              // Empty state
              <motion.div
                className="col-span-full flex flex-col items-center justify-center py-16 bg-muted/30 rounded-lg border border-dashed border-border/60"
                variants={emptyState}
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-medium mb-2">No articles found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {activeCategory !== "all"
                    ? `No articles found in the "${activeCategory}" category`
                    : "No blog posts have been published yet"}
                </p>

                {activeCategory !== "all" && (
                  <Button
                    variant="outline"
                    onClick={() => setActiveCategory("all")}
                    className="gap-2"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    View All Categories
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Only show button if we have blog posts and not in loading state */}
        {!loading && blogPosts.length > 0 && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button asChild size="lg" className="gap-2 group">
              <Link href="/blog">
                <span>Browse All Articles</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Blog stats */}
        {/* {!loading && blogPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border/40 text-center">
              <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Articles
              </h4>
              <p className="text-2xl font-bold mt-1">{blogPosts.length}</p>
            </div>

            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border/40 text-center">
              <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                Categories
              </h4>
              <p className="text-2xl font-bold mt-1">{categories.length - 1}</p>
            </div>

            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border/40 text-center">
              <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                Latest Topic
              </h4>
              <p className="text-lg font-bold mt-1 truncate">
                {blogPosts.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )[0]?.category || "N/A"}
              </p>
            </div>

            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border/40 text-center">
              <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                Average Read Time
              </h4>
              <p className="text-2xl font-bold mt-1">
                {blogPosts.length > 0
                  ? `${Math.round(
                      blogPosts.reduce(
                        (acc, post) =>
                          acc + parseInt(post.readTime?.split(" ")[0] || "0"),
                        0
                      ) / blogPosts.length
                    )} min`
                  : "N/A"}
              </p>
            </div>
          </motion.div>
        )} */}
      </div>
    </section>
  );
}
