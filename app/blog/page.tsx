import { Suspense } from "react";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { connectToDB } from "@/lib/mongodb";
import { Blog, User } from "@/lib/models";
import { fallbackBlogPosts } from "@/lib/data";
import BlogSkeleton from "../../components/blog/blog-skeleton";
import CategoryFilter from "../../components/blog/category-filter";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog | Web Development Insights & Tutorials",
  description:
    "Explore articles on web development, programming tutorials, tech insights, and industry trends.",
  openGraph: {
    title: "Blog | Web Development Insights & Tutorials",
    description:
      "Expert articles on web development, tech trends, and programming tutorials.",
    type: "website",
    images: [
      {
        url: "/images/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "Blog Cover Image",
      },
    ],
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const { category, q } = await searchParams;
  const selectedCategory = await category || "";
  const searchQuery = q || "";

  return (
    <div className="min-h-screen">
      {/* Background with blur effect */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-80 background-image blur-md backdrop-blur"></div>

      <main className="animate-fade-in pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Blog Header */}
          <section className="relative text-center space-y-4 mb-16 animate-fade-in-up animation-delay-300">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
              Insights & Tutorials
            </span>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Thoughts, tutorials, and insights about web development, design,
              and technology.
            </p>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-primary/20 blur-[100px]"></div>
            <div className="absolute -z-10 top-1/3 left-1/4 w-[150px] h-[150px] rounded-full bg-purple-500/20 blur-[80px]"></div>
          </section>

          {/* Search & Filter Section */}
          <Suspense
            fallback={
              <div className="h-16 bg-muted/30 animate-pulse rounded-lg mb-8"></div>
            }
          >
            <BlogControls
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </Suspense>

          {/* Featured Post (First Post) */}
          <Suspense fallback={<BlogSkeleton featured />}>
            <FeaturedPost
              category={selectedCategory}
              searchQuery={searchQuery}
            />
          </Suspense>

          {/* Regular Blog Posts */}
          <Suspense fallback={<BlogSkeleton count={6} />}>
            <BlogGrid category={selectedCategory} searchQuery={searchQuery} />
          </Suspense>

          {/* Newsletter Section */}
          <section className="mt-20 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 md:p-12 animate-fade-in-up animation-delay-600">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Subscribe to My Newsletter
              </h2>
              <p className="text-muted-foreground mb-6">
                Get the latest articles, tutorials and updates delivered
                straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-background/70"
                  required
                />
                <Button type="submit" className="hover-button-effect">
                  Subscribe
                </Button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Blog Controls Component
function BlogControls({
  selectedCategory,
  searchQuery,
}: {
  selectedCategory: string;
  searchQuery: string;
}) {
  return (
    <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in-up animation-delay-400">
      <div className="w-full md:w-auto">
        <CategoryFilter currentCategory={selectedCategory} />
      </div>

      <form className="w-full md:w-auto flex" action="/blog">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search articles..."
            className="pl-9 w-full md:w-[250px] bg-background/70"
          />
          {selectedCategory && (
            <input type="hidden" name="category" value={selectedCategory} />
          )}
        </div>
        <Button type="submit" className="ml-2">
          Search
        </Button>
      </form>
    </div>
  );
}

// Featured Post Component
async function FeaturedPost({
  category,
  searchQuery,
}: {
  category: string;
  searchQuery: string;
}) {
  let featuredPost;

  try {
    const db = await connectToDB();
    if (db) {
      // Build query for featured post
      let query: any = { published: true, featured: true };

      if (category) {
        query.category = category;
      }

      if (searchQuery) {
        query.$or = [
          { title: { $regex: searchQuery, $options: "i" } },
          { excerpt: { $regex: searchQuery, $options: "i" } },
          { content: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const post = await Blog.findOne(query)
        .sort({ createdAt: -1 })
        .populate("author", "name image");

      if (post) {
        featuredPost = JSON.parse(JSON.stringify(post));
      }
    }
  } catch (error) {
    console.error("Error fetching featured post:", error);
  }

  // If no featured post found with filters, or in case of error, don't show this section
  if (!featuredPost) {
    return null;
  }

  return (
    <section className="mb-12 animate-fade-in-up animation-delay-500">
      <Link href={`/blog/${featuredPost._id}`}>
        <Card className="overflow-hidden border-border/50 group transition-all duration-300 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-full overflow-hidden">
              <Image
                src={
                  featuredPost.image || "/placeholder.svg?height=600&width=800"
                }
                alt={featuredPost.title}
                fill
                priority
                className="object-cover transition duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <CardContent className="p-8 flex flex-col justify-center">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="default"
                    className="bg-primary text-primary-foreground"
                  >
                    Featured
                  </Badge>
                  <Badge variant="outline">{featuredPost.category}</Badge>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-muted-foreground line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {new Date(featuredPost.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime || "5 min read"}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="default"
                  className="w-fit gap-2 mt-2 hover-button-effect"
                >
                  Read Article <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    </section>
  );
}

// Blog Grid Component
async function BlogGrid({
  category,
  searchQuery,
}: {
  category: string;
  searchQuery: string;
}) {
  let blogPosts = [];

  try {
    // Connect to database
    const db = await connectToDB();

    if (db) {
      // Build query based on filters
      let query: any = { published: true };

      if (category) {
        query.category = category;
      }

      if (searchQuery) {
        query.$or = [
          { title: { $regex: searchQuery, $options: "i" } },
          { excerpt: { $regex: searchQuery, $options: "i" } },
          { content: { $regex: searchQuery, $options: "i" } },
        ];
      }

      // For regular posts, exclude featured post if it's shown separately
      const featuredPostId = await Blog.findOne({
        published: true,
        featured: true,
      }).select("_id");

      if (featuredPostId) {
        query._id = { $ne: featuredPostId._id };
      }

      const posts = await Blog.find(query)
        .sort({ createdAt: -1 })
        .populate("author", "name image");

      if (posts && posts.length > 0) {
        blogPosts = JSON.parse(JSON.stringify(posts));
      } else {
        // Filter fallback data
        let fallbackResults = Object.values(fallbackBlogPosts);

        if (category) {
          fallbackResults = fallbackResults.filter(
            (p) => p.category === category
          );
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          fallbackResults = fallbackResults.filter(
            (p) =>
              p.title.toLowerCase().includes(query) ||
              p.excerpt?.toLowerCase().includes(query)
          );
        }

        blogPosts = fallbackResults;
      }
    } else {
      blogPosts = fallbackBlogPosts;
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // Use fallback data
    blogPosts = fallbackBlogPosts;
  }

  if (blogPosts.length === 0) {
    return (
      <div className="text-center py-16 mt-8 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No articles found</h2>
        <p className="text-muted-foreground mb-6">
          {category || searchQuery
            ? "Try changing your filters or search query"
            : "Check back later for new content"}
        </p>
        <Link href="/blog">
          <Button variant="outline">View All Articles</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Latest Articles</h2>
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {blogPosts.length}
          </span>{" "}
          posts
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <BlogCard key={post._id.toString()} post={post} index={index} />
        ))}
      </div>
    </>
  );
}

// Blog Card Component
function BlogCard({ post, index }: { post: any; index: number }) {
  return (
    <Link href={`/blog/${post._id}`}>
      <Card
        className={cn(
          "h-full overflow-hidden border-border/50 hover:border-primary/50 group transition-all duration-300 bg-card/50 backdrop-blur-sm hover-card-effect animate-slide-up"
        )}
        style={{ animationDelay: `${300 + index * 100}ms` }}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg?height=400&width=600"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 ease-in-out group-hover:scale-105"
            priority={index < 3} // Prioritize loading for first 3 cards
          />
          <div className="absolute top-2 right-2 z-10">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm"
            >
              {post.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.readTime || "5 min read"}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <Button
                variant="ghost"
                className="gap-1 px-0 text-primary hover:text-primary/80 hover:bg-transparent group-hover:translate-x-1 transition-transform"
              >
                Read More <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Author info */}
              {post.author && (
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden">
                    <Image
                      src={post.author.image || "/placeholder-avatar.svg"}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {post.author.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
