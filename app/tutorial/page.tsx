import { getTutorialTopics } from "@/lib/server/tutorials";
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
  BookOpen,
  GraduationCap,
  Clock,
  ArrowRight,
  Search,
  Calendar,
  ExternalLink,
  Menu,
  X,
  BookMarked,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Tutorials | Masudur Rahman",
  description:
    "Browse comprehensive tutorials on web development, programming, and software engineering",
};

// Enable SSG for this page
export const revalidate = 3600; // Revalidate every hour
export const dynamic = "force-static"; // Force static generation

export default async function TutorialsPage() {
  const topics = await getTutorialTopics();

  // Get latest 3 topics for featured section
  const featuredTopics = topics;

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_220px] gap-6 md:gap-10">
      {/* Left sidebar with mobile drawer support */}
      <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] md:sticky md:block">
        <ScrollArea className="h-full py-6 pl-2 pr-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold tracking-tight">Topics</h3>
            <Badge variant="secondary" className="font-mono">
              {topics.length}
            </Badge>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search topics..."
              className="w-full pl-8 py-2 h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5 mt-4">
            <Button
              variant="ghost"
              className="w-full justify-start font-medium text-primary"
              size="sm"
              asChild
            >
              <Link href="/tutorial">All Topics</Link>
            </Button>

            <div className="py-2">
              <h4 className="mb-1 px-2 text-sm font-medium text-muted-foreground">
                Popular Topics
              </h4>
              <div className="space-y-1">
                {topics.map((topic, index) => (
                  <Button
                    key={topic._id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-medium hover:bg-accent hover:text-accent-foreground transition-all group"
                    asChild
                  >
                    <Link href={`/tutorial/${topic.slug}`} className="truncate">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full mr-2 inline-block transition-transform",
                          "bg-primary/70 group-hover:bg-primary group-hover:scale-125"
                        )}
                      />
                      {topic.title}
                      {index < 2 && (
                        <Badge
                          variant="outline"
                          className="ml-2 text-[10px] font-normal py-0 h-4"
                        >
                          New
                        </Badge>
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t mt-4">
              <h4 className="mb-1 px-2 text-sm font-medium text-muted-foreground">
                Resources
              </h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/blog">Blog Articles</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/projects">Projects</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/#contact">Request Topic</Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile navigation drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden fixed bottom-4 right-4 z-40 shadow-md"
          >
            <Menu className="h-5 w-5" />
            <span className="ml-2">Browse Topics</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <div className="h-full py-6 pl-2 pr-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold tracking-tight">Topics</h3>
              <Badge variant="secondary" className="font-mono">
                {topics.length}
              </Badge>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search topics..."
                className="w-full pl-8 py-2 h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5 mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start font-medium text-primary"
                size="sm"
                asChild
              >
                <Link href="/tutorial">All Topics</Link>
              </Button>

              <div className="py-2">
                <h4 className="mb-1 px-2 text-sm font-medium text-muted-foreground">
                  Popular Topics
                </h4>
                <div className="space-y-1">
                  {topics.map((topic) => (
                    <Button
                      key={topic._id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start font-medium hover:bg-accent hover:text-accent-foreground transition-all group"
                      asChild
                    >
                      <Link
                        href={`/tutorial/${topic.slug}`}
                        className="truncate"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2 inline-block group-hover:bg-primary" />
                        {topic.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <h4 className="mb-1 px-2 text-sm font-medium text-muted-foreground">
                  Resources
                </h4>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/blog">Blog Articles</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/projects">Projects</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <main className="relative px-4 md:px-0 py-6 animate-in fade-in duration-300">
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <GraduationCap className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Learning Resource</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
            Technical Tutorials
          </h1>
          <p className="text-lg text-muted-foreground max-w-[46rem]">
            Comprehensive guides and resources to help you learn web
            development, programming, and software engineering concepts from
            fundamentals to advanced techniques.
          </p>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-xl border-border">
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/60 mb-4" />
            <h2 className="text-xl font-medium mb-2">No Tutorials Available</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're currently working on tutorials for various topics. Check
              back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Featured section for most popular topics */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Featured Topics</h2>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/tutorial">
                    View all
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                {featuredTopics.map((topic, index) => (
                  <Card
                    key={topic._id}
                    className="group overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-[16/9] relative overflow-hidden">
                      {topic.image ? (
                        <>
                          <Image
                            src={topic.image || "/placeholder.svg"}
                            alt={topic.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105 duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index < 2}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                          <BookMarked className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 hover:bg-primary">
                          Featured
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {topic.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Updated{" "}
                          {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Badge variant="outline" className="px-1.5 py-0 h-5">
                          {topic.tutorialCount || 0}{" "}
                          {topic.tutorialCount === 1 ? "tutorial" : "tutorials"}
                        </Badge>
                        <span>•</span>
                        <span>Beginner to Advanced</span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">
                        {topic.description}
                      </p>
                    </CardContent>

                    <CardFooter className="pt-3 border-t bg-accent/5 px-4 py-3">
                      <Button
                        asChild
                        className="w-full justify-between"
                        variant="secondary"
                      >
                        <Link
                          href={`/tutorial/${topic.slug}`}
                          className="flex items-center"
                        >
                          <span>Explore Topic</span>
                          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            {/* All topics section with improved grid layout */}
            <div className="pt-8 border-t">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">All Topics</h2>
                  <p className="text-muted-foreground text-sm">
                    Browse all available tutorial topics
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex"
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    Latest
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex"
                  >
                    <BookOpen className="mr-1 h-4 w-4" />
                    Popular
                  </Button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                {topics.slice(3).map((topic, index) => (
                  <Link
                    href={`/tutorial/${topic.slug}`}
                    key={topic._id}
                    className="flex gap-4 p-4 border rounded-lg hover:border-primary/30 hover:bg-accent/5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-accent/20 flex items-center justify-center">
                      {topic.image ? (
                        <Image
                          src={topic.image}
                          alt={topic.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <BookOpen className="h-6 w-6 text-primary/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {topic.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0 h-5 text-xs whitespace-nowrap"
                        >
                          {topic.tutorialCount || 0}{" "}
                          {topic.tutorialCount === 1 ? "tutorial" : "tutorials"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {topic.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 pt-8 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    Want to suggest a topic?
                  </h2>
                  <p className="text-muted-foreground">
                    Have an idea for a tutorial you'd like to see?
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button asChild variant="outline">
                    <Link href="/#contact">Contact Me</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/#contact">
                      Request Tutorial
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Right sidebar */}
      <aside className="hidden text-sm lg:block">
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="space-y-6 border-l pl-6">
            {/* Quick links section */}
            <div>
              <h2 className="mb-3 text-lg font-medium text-foreground">
                Quick Links
              </h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/tutorial/search">
                    <Search className="mr-2 h-4 w-4" />
                    Search Tutorials
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/tutorial/recent">
                    <Clock className="mr-2 h-4 w-4" />
                    Recently Added
                  </Link>
                </Button>
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="border-t pt-6">
              <h2 className="mb-3 text-lg font-medium text-foreground">
                Stay Updated
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                Get notified about new tutorials and updates
              </p>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full"
                />
                <Button className="w-full">Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* External resources */}
            <div className="border-t pt-6">
              <h2 className="mb-3 text-lg font-medium text-foreground">
                Recommended Resources
              </h2>
              <div className="space-y-2">
                <Link
                  href="https://developer.mozilla.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  <span>MDN Web Docs</span>
                </Link>
                <Link
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  <span>React Documentation</span>
                </Link>
                <Link
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  <span>Next.js Documentation</span>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} Masudur Rahman</p>
              <p className="mt-1">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
