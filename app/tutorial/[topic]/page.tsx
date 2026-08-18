import {
  getTutorialTopicBySlug,
  getTutorialsByTopic,
  getTopicsWithTutorials,
  getTutorialTopics,
} from "@/lib/server/tutorials";
import { notFound } from "next/navigation";
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
import {
  ChevronRight,
  Clock,
  BookOpen,
  ArrowLeft,
  CalendarDays,
  ListFilter,
  Bookmark,
  Tag,
  Star,
  ArrowUp,
  Filter,
} from "lucide-react";
import Image from "next/image";
import { TopicSidebar } from "@/components/tutorial/topic-sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import BackToTopButton from "@/components/tutorial/backtotopButton";

interface TopicPageProps {
  params: {
    topic: string;
  };
}

// Generate static params for SSG
export async function generateStaticParams() {
  const topics = await getTutorialTopics();

  return topics.map((topic) => ({
    topic: topic.slug,
  }));
}

// Enable SSG with revalidation
export const revalidate = 3600; // Revalidate every hour
export const dynamic = "force-static"; // Force static generation

export async function generateMetadata({ params }: TopicPageProps) {
  const { topic: topicSlug } = await params;

  try {
    const topic = await getTutorialTopicBySlug(topicSlug);

    if (!topic) {
      return {
        title: "Topic Not Found | Masudur Rahman",
        description: "The requested tutorial topic could not be found",
      };
    }

    return {
      title: `${topic.title} Tutorials | Masudur Rahman`,
      description: topic.description,
      openGraph: {
        title: `${topic.title} - Web Development Tutorials`,
        description: topic.description,
        images: topic.image ? [{ url: topic.image }] : undefined,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Tutorial Topic | Masudur Rahman",
      description: "Explore tutorials on web development and programming",
    };
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic: topicSlug } = await params;

  try {
    const topic = await getTutorialTopicBySlug(topicSlug);

    if (!topic) {
      notFound();
    }

    const tutorials = await getTutorialsByTopic(topic._id);
    const topicsData = await getTopicsWithTutorials();

    // Convert MongoDB objects to plain objects
    const serializedTopic = JSON.parse(JSON.stringify(topic));
    const serializedTutorials = JSON.parse(JSON.stringify(tutorials));
    const serializedTopics = JSON.parse(JSON.stringify(topicsData));

    // Calculate difficulty distribution for progress indicators
    const difficultyCount = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    };

    serializedTutorials.forEach((tutorial: any) => {
      const difficulty = tutorial.difficulty?.toLowerCase() || "beginner";
      if (difficultyCount[difficulty] !== undefined) {
        difficultyCount[difficulty]++;
      }
    });

    return (
      <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        {/* Left sidebar - Desktop */}
        <div className="hidden lg:block w-[350px] xl:w-[350px] shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-border/60 overflow-hidden">
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
        <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10 animate-in fade-in duration-300">
          {/* Breadcrumb and back navigation */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-muted-foreground mb-4">
              <Link
                href="/tutorial"
                className="hover:text-foreground transition-colors"
              >
                Tutorials
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-foreground font-medium line-clamp-1">
                {serializedTopic.title}
              </span>
            </nav>

            {/* Topic hero section */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
              {serializedTopic.image && (
                <div className="w-full sm:w-2/3 lg:w-1/3 aspect-video relative rounded-xl overflow-hidden shadow-md border border-border/50 mx-auto lg:mx-0">
                  <Image
                    src={serializedTopic.image || "/placeholder.svg"}
                    alt={serializedTopic.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              )}

              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Learning Path</span>
                  </div>
                  {serializedTopic.isPublished ? (
                    <Badge
                      variant="default"
                      className="bg-green-500/90 hover:bg-green-500"
                    >
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    {serializedTopic.title}
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground">
                  {serializedTopic.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-primary/70" />
                    <span>
                      {serializedTutorials.length}{" "}
                      {serializedTutorials.length === 1
                        ? "tutorial"
                        : "tutorials"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-primary/70" />
                    <span>
                      Updated{" "}
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary/70" />
                    <span>
                      {serializedTutorials.reduce(
                        (total, t) => total + (t.readTime || 0),
                        0
                      )}{" "}
                      min total
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {serializedTutorials.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-border bg-accent/5 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                No Tutorials Available
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We're currently working on tutorials for this topic. Check back
                soon or explore other topics!
              </p>
              <Button asChild variant="outline" className="mr-3">
                <Link href="/tutorial">Browse All Topics</Link>
              </Button>
              <Button asChild>
                <Link href="/#contact">Request Content</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
              {serializedTutorials.map((tutorial, index) => (
                <Card
                  key={tutorial._id}
                  className="group overflow-hidden border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <CardHeader className="pb-3 space-y-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex gap-2 items-center">
                        {tutorial.difficulty && (
                          <Badge
                            variant="secondary"
                            className={`
                              text-xs py-0 px-1.5
                              ${
                                tutorial.difficulty?.toLowerCase() ===
                                "beginner"
                                  ? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
                                  : ""
                              }
                              ${
                                tutorial.difficulty?.toLowerCase() ===
                                "intermediate"
                                  ? "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30"
                                  : ""
                              }
                              ${
                                tutorial.difficulty?.toLowerCase() ===
                                "advanced"
                                  ? "bg-purple-500/20 text-purple-600 hover:bg-purple-500/30"
                                  : ""
                              }
                            `}
                          >
                            {tutorial.difficulty}
                          </Badge>
                        )}
                        {index < 2 && (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-primary/30 text-primary py-0 h-4"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground bg-background/80 backdrop-blur-sm border border-border/50 px-1.5 py-0.5 rounded">
                        Part {index + 1}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center text-xs">
                        <Clock className="h-3 w-3 mr-1 text-primary/70" />
                        {tutorial.readTime || 5} min read
                      </div>

                      {tutorial.tags && tutorial.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Tag className="h-3 w-3 text-primary/70" />
                          {tutorial.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs py-0 px-1.5 bg-accent/50 hover:bg-accent"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {tutorial.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{tutorial.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-3 flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tutorial.metaDescription ||
                        "Learn more about this topic in this detailed step-by-step tutorial."}
                    </p>
                  </CardContent>

                  <CardFooter className="border-t bg-accent/5 px-4 py-3 mt-auto">
                    <div className="w-full flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs py-1 h-8 opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                        Save
                      </Button>

                      <Button
                        asChild
                        variant="default"
                        size="sm"
                        className="text-xs py-1 h-8 group-hover:bg-primary/90 transition-colors"
                      >
                        <Link
                          href={`/tutorial/${topicSlug}/${tutorial.slug}`}
                          className="flex items-center"
                        >
                          <span>Read Tutorial</span>
                          <ChevronRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Bottom navigation and back to top */}
          {serializedTutorials.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-between border-t pt-6 gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/tutorial" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back to Topics
                </Link>
              </Button>

              <BackToTopButton />
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in topic page:", error);
    notFound();
  }
}
