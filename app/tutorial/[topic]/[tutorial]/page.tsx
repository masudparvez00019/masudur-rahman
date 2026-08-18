import {
  getTutorialTopicBySlug,
  getTutorialBySlug,
  extractTableOfContents,
  getTopicsWithTutorials,
} from "@/lib/server/tutorials";
import { notFound } from "next/navigation";
import Link from "next/link";
import { serialize } from "next-mdx-remote/serialize";
import MDXRenderer from "@/components/mdx/mdx-renderer";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Tag,
  ArrowLeft,
  BookOpen,
  Share2,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Home,
} from "lucide-react";
import { TableOfContents } from "@/components/tutorial/table-of-contents";
import { TopicSidebar } from "@/components/tutorial/topic-sidebar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface TutorialPageProps {
  params: {
    topic: string;
    tutorial: string;
  };
}

export async function generateMetadata({ params }: TutorialPageProps) {
  try {
    // Fix 1: Destructure params to avoid direct access
    const { topic: topicSlug, tutorial: tutorialSlug } = await params;

    const topic = await getTutorialTopicBySlug(topicSlug);

    if (!topic) {
      return {
        title: "Topic Not Found",
        description: "The requested tutorial topic could not be found",
      };
    }

    const tutorial = await getTutorialBySlug(topicSlug, tutorialSlug);

    if (!tutorial) {
      return {
        title: "Tutorial Not Found",
        description: "The requested tutorial could not be found",
      };
    }

    return {
      title: `${tutorial.title} | ${topic.title} Tutorial`,
      description: tutorial.metaDescription || topic.description,
      openGraph: {
        title: `${tutorial.title} | ${topic.title} Tutorial`,
        description: tutorial.metaDescription || topic.description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Tutorial | Masudur Rahman",
      description: "Learn web development and programming",
    };
  }
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  try {
    // Fix 1: Destructure params to avoid direct access
    const { topic: topicSlug, tutorial: tutorialSlug } = await params;

    const topic = await getTutorialTopicBySlug(topicSlug);

    if (!topic) {
      notFound();
    }

    const tutorial = await getTutorialBySlug(topicSlug, tutorialSlug);

    if (!tutorial) {
      notFound();
    }

    // Get all topics with their tutorials for the sidebar
    const topics = await getTopicsWithTutorials();

    // Fix 2: Convert MongoDB objects to plain objects
    const serializedTopic = JSON.parse(JSON.stringify(topic));
    const serializedTutorial = JSON.parse(JSON.stringify(tutorial));
    const serializedTopics = JSON.parse(JSON.stringify(topics));

    // Extract table of contents from the content
    const toc = await extractTableOfContents(serializedTutorial.content);

    // Serialize the MDX content
    const mdxSource = await serialize(serializedTutorial.content);

    // Format date
    const formattedDate = new Date(
      serializedTutorial.createdAt
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Calculate reading progress percentage for a visual indicator
    const readingProgress = Math.min(100, serializedTutorial.readProgress || 0);

    return (
      <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto ">
        {/* Left sidebar - Desktop */}
        <div className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-border/60 overflow-hidden">
          <ScrollArea className="h-full py-6 pl-2 pr-4">
            <TopicSidebar
              topics={serializedTopics}
              currentTopicSlug={topicSlug}
            />
          </ScrollArea>
        </div>

        {/* Left sidebar - Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden fixed bottom-6 left-6 z-40 shadow-lg rounded-full h-12 px-4"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              <span>Topics</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] max-w-[350px] p-0">
            <ScrollArea className="h-full py-6 px-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-semibold text-lg">Topics</h3>
                <Badge variant="outline" className="font-mono">
                  {serializedTopics?.length || 0}
                </Badge>
              </div>
              <TopicSidebar
                topics={serializedTopics}
                currentTopicSlug={topicSlug}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Main content area */}
        <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10 animate-in fade-in duration-300     backdrop-blur-sm shadow-md border border-border/50">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Link
              href="/tutorial"
              className="hover:text-foreground transition-colors"
            >
              <Home className="h-3.5 w-3.5 mr-1 inline-block" />
              <span>Tutorials</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 mx-1" />
            <Link
              href={`/tutorial/${topicSlug}`}
              className="hover:text-foreground transition-colors max-w-[150px] truncate"
            >
              {serializedTopic.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 mx-1" />
            <span className="text-foreground font-medium max-w-[180px] truncate">
              {serializedTutorial.title}
            </span>
          </nav>

          {/* Tutorial header */}
          <div className="mb-8 space-y-4">
            {/* Topic tag and navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href={`/tutorial/${serializedTopic.slug}`}
                className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to {serializedTopic.title}</span>
              </Link>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {/* Source button */}
                <Button variant="outline" size="sm" className="h-8" asChild>
                  <Link href="#" target="_blank" rel="noopener noreferrer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                    Source
                  </Link>
                </Button>

                {/* Share button */}
                <Button variant="outline" size="sm" className="h-8">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            {/* Tutorial title with gradient */}
            <div>
              {serializedTutorial.difficulty && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "mb-3",
                    serializedTutorial.difficulty?.toLowerCase() ===
                      "beginner" &&
                      "bg-green-500/20 text-green-600 hover:bg-green-500/30",
                    serializedTutorial.difficulty?.toLowerCase() ===
                      "intermediate" &&
                      "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30",
                    serializedTutorial.difficulty?.toLowerCase() ===
                      "advanced" &&
                      "bg-purple-500/20 text-purple-600 hover:bg-purple-500/30"
                  )}
                >
                  {serializedTutorial.difficulty} Level
                </Badge>
              )}

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {serializedTutorial.title}
                </span>
              </h1>
            </div>

            {/* Author and metadata */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Author info */}
              <div className="flex items-center gap-2 pr-3 border-r">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Masudur Rahman" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium leading-none">Masudur Rahman</p>
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>

              {/* Metadata badges */}
              <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-2"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {formattedDate}
                </Badge>

                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-2"
                >
                  <Clock className="h-3.5 w-3.5" />
                  {serializedTutorial.readTime} min read
                </Badge>

                {/* Reading progress if available */}
                {readingProgress > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="bg-accent/50 h-2 w-20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                    <span className="text-xs">{readingProgress}% read</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {serializedTutorial.tags && serializedTutorial.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Tag className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                {serializedTutorial.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Mobile table of contents */}
          {toc.length > 0 && (
            <div className="p-4 mb-6 border rounded-lg bg-accent/10 xl:hidden">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> On This Page
              </h3>
              <div className="space-y-1">
                <TableOfContents toc={toc} />
              </div>
            </div>
          )}

          {/* Main tutorial content */}
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-img:rounded-lg prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h2:border-b prose-h2:pb-2 prose-pre:bg-accent/20 prose-pre:shadow-sm prose-pre:border prose-code:text-primary">
            <MDXRenderer source={mdxSource} />
          </div>

          {/* Like and bookmark section */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Helpful</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Bookmark className="h-4 w-4" />
                <span>Save</span>
              </Button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
              asChild
            >
              <Link href="#comment-section">
                <MessageSquare className="h-4 w-4" />
                <span>Leave feedback</span>
              </Link>
            </Button>
          </div>

          {/* Previous/Next navigation */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {serializedTutorial.previousTutorial ? (
              <Button
                variant="outline"
                className="justify-start h-auto py-3"
                asChild
              >
                <Link
                  href={`/tutorial/${serializedTopic.slug}/${serializedTutorial.previousTutorial.slug}`}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs text-muted-foreground">
                      Previous
                    </span>
                    <span className="text-sm truncate">
                      {serializedTutorial.previousTutorial.title}
                    </span>
                  </div>
                </Link>
              </Button>
            ) : (
              <div></div>
            )}

            {serializedTutorial.nextTutorial ? (
              <Button
                variant="outline"
                className="justify-end h-auto py-3"
                asChild
              >
                <Link
                  href={`/tutorial/${serializedTopic.slug}/${serializedTutorial.nextTutorial.slug}`}
                >
                  <div className="flex flex-col items-end text-right">
                    <span className="text-xs text-muted-foreground">Next</span>
                    <span className="text-sm truncate">
                      {serializedTutorial.nextTutorial.title}
                    </span>
                  </div>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <div></div>
            )}
          </div>

          {/* Footer section */}
          <div className="mt-10 pt-6 border-t">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Last updated on{" "}
                {new Date(
                  serializedTutorial.updatedAt || serializedTutorial.createdAt
                ).toLocaleDateString()}
              </p>

              <div className="flex flex-wrap gap-2 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-8"
                  asChild
                >
                  <Link href="/tutorial">All Topics</Link>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-8"
                  asChild
                >
                  <Link href={`/tutorial/${serializedTopic.slug}`}>
                    More in {serializedTopic.title}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Right sidebar with table of contents */}
        <div className="hidden xl:block w-[240px] shrink-0">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="border-l pl-5 py-4">
              <h3 className="font-medium text-foreground mb-3">On This Page</h3>
              {toc.length > 0 ? (
                <TableOfContents toc={toc} />
              ) : (
                <p className="text-muted-foreground text-sm">
                  No sections found
                </p>
              )}

              {/* Additional right sidebar content */}
              <div className="mt-8 pt-6 border-t border-border/40">
                <h4 className="font-medium mb-3 text-sm">Related Tutorials</h4>
                <ul className="space-y-2.5">
                  {serializedTopic.tutorials?.slice(0, 3).map(
                    (relatedTutorial) =>
                      relatedTutorial.slug !== serializedTutorial.slug && (
                        <li key={relatedTutorial._id}>
                          <Link
                            href={`/tutorial/${serializedTopic.slug}/${relatedTutorial.slug}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-2"
                          >
                            {relatedTutorial.title}
                          </Link>
                        </li>
                      )
                  )}
                </ul>
              </div>

              {/* Support section */}
              <div className="mt-8 pt-6 border-t border-border/40">
                <h4 className="font-medium mb-2 text-sm">Support</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Found this tutorial helpful? Consider supporting my work.
                </p>
                <Button size="sm" className="w-full">
                  Support ❤️
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in tutorial page:", error);
    notFound();
  }
}
