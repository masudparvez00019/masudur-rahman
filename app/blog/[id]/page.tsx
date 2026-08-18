import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models/blog";
import { Suspense } from "react";
import BlogComments from "@/components/blog/blog-comments";
import { Metadata } from "next";
import { fallbackBlogPost } from "@/lib/data";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;

  // Try to get blog post data
  let post;
  try {
    const db = await connectToDB();
    if (db) {
      post = await Blog.findById(id).lean();
    }

    if (!post) {
      post = fallbackBlogPost[id as keyof typeof fallbackBlogPost];
    }
  } catch (error) {
    post = fallbackBlogPost[id as keyof typeof fallbackBlogPost];
  }

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
      images: [post.image || "/placeholder.svg?height=600&width=1200"],
      type: "article",
    },
  };
}

// Helper function to transform comments to match the Comment interface
function transformComments(comments = []) {
  return comments.map((comment) => ({
    _id: comment._id.toString(),
    author: {
      _id: comment.author?._id?.toString() || "",
      name: comment.author?.name || "Anonymous",
      image: comment.author?.image || undefined,
    },
    content: comment.content || "",
    date: comment.createdAt || comment.date || new Date().toISOString(),
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  let post;
  let settings = {};

  try {
    // Connect to database
    const db = await connectToDB();

    // Only fetch from DB if we're not in build phase
    if (db) {
      // Fetch blog post by ID with populated author and comments
      const blogPost = await Blog.findById(id)
        .populate("author", "name image")
        .populate("comments.author", "name image")
        .lean(); // Use .lean() to get plain JavaScript object

      if (blogPost) {
        // Create the post object with transformed comments
        post = {
          ...blogPost,
          _id: blogPost._id.toString(),
          comments: transformComments(blogPost.comments),
        };
      }
    }

    // If no post found in DB, try fallback data
    if (!post) {
      const fallbackPost =
        fallbackBlogPost[id as keyof typeof fallbackBlogPost];
      if (fallbackPost) {
        post = {
          ...fallbackPost,
          comments: transformComments(fallbackPost.comments),
        };
      }
    }

    // If still no post, return 404
    if (!post) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
    // Try fallback data
    const fallbackPost = fallbackBlogPost[id as keyof typeof fallbackBlogPost];
    if (fallbackPost) {
      post = {
        ...fallbackPost,
        comments: transformComments(fallbackPost.comments),
      };
    }

    // If no fallback data, return 404
    if (!post) {
      return notFound();
    }
  }

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-80 background-image blur-md backdrop-blur"></div>

      <main className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge>{post?.category}</Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post?.readTime}</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{post?.title}</h1>

              <div className="flex items-center gap-3 pt-4">
                <Avatar>
                  <AvatarImage
                    src={
                      post.author?.image ||
                      "/placeholder.svg?height=40&width=40"
                    }
                    alt={post.author?.name || "Author"}
                  />
                  <AvatarFallback>
                    {(post.author?.name || "A").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {post.author?.name || "Anonymous"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Web Developer and Tech Enthusiast
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-80 md:h-96 overflow-hidden rounded-lg ">
              <Image
                src={post?.image || "/placeholder.svg?height=600&width=1200"}
                alt={post?.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div
              className="prose prose-lg dark:prose-invert max-w-none bg-background/40 backdrop-blur-md border border-border/50  p-6 rounded-lg"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />

            <div className="flex flex-wrap gap-2 pt-6 bg-background/40 backdrop-blur-md border border-border/50  p-6 rounded-lg">
              {Array.isArray(post.tags) &&
                post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          <Suspense fallback={<div>Loading comments...</div>}>
            <BlogComments
              postId={post._id.toString()}
              initialComments={post.comments}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
