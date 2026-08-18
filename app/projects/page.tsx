import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Filter, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import { Project } from "@/lib/models/project";
import ProjectLinks from "@/components/project-links";
import { fallbackProjects } from "@/lib/data";
import { Suspense } from "react";
import ProjectsSkeleton from "../../components/projects/projects-skeleton";
import ProjectFilters from "../../components/projects/project-filters";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects Portfolio | Professional Web Development Projects",
  description:
    "Explore my collection of web development projects showcasing expertise in React, Next.js, TypeScript, and modern web technologies.",
  openGraph: {
    title: "Professional Web Development Portfolio Projects",
    description:
      "Discover my professional web development projects showcasing expertise in React, Next.js, TypeScript, and more.",
    type: "website",
  },
};

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string; q?: string };
}) {
  const { category, tag, q } = await searchParams;
  const selectedCategory = category || "";
  const selectedTag = tag || "";
  const searchQuery = q || "";

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat text-foreground">
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-80 background-image blur-md backdrop-blur"></div>

      <div className="min-h-screen">
        <main className="pt-24 pb-16 px-4 md:px-8 animate-fade-in animation-delay-200">
          <div className="max-w-6xl mx-auto">
            <div className="relative text-center space-y-4 mb-16 animate-fade-in-up animation-delay-300">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                My Portfolio
              </span>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
                Creative Projects
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
                Explore my portfolio of web development projects, showcasing
                creative solutions and technical expertise.
              </p>

              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-primary/20 blur-[100px]"></div>
              <div className="absolute -z-10 top-1/3 left-1/4 w-[150px] h-[150px] rounded-full bg-purple-500/20 blur-[80px]"></div>
            </div>

            <Suspense
              fallback={
                <div className="h-12 w-full bg-muted/30 animate-pulse rounded-lg mb-8"></div>
              }
            >
              <ProjectFilters
                currentCategory={category}
                currentTag={tag}
                searchQuery={searchQuery}
              />
            </Suspense>

            <Suspense fallback={<ProjectsSkeleton />}>
              <ProjectsGrid
                category={category}
                tag={tag}
                searchQuery={searchQuery}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

async function ProjectsGrid({
  category,
  tag,
  searchQuery,
}: {
  category: string;
  tag: string;
  searchQuery: string;
}) {
  let projects = [];

  try {
    await connectToDB();

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const dbProjects = await Project.find(query).sort({
      featured: -1,
      createdAt: -1,
    });

    if (dbProjects && dbProjects.length > 0) {
      projects = JSON.parse(JSON.stringify(dbProjects));
    } else {
      let fallbackResults = Object.values(fallbackProjects);

      if (category) {
        fallbackResults = fallbackResults.filter(
          (p) => p.category === category
        );
      }

      if (tag) {
        fallbackResults = fallbackResults.filter((p) => p.tags.includes(tag));
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        fallbackResults = fallbackResults.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      projects = fallbackResults;
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    projects = Object.values(fallbackProjects);
  }

  if (!projects.length) {
    return (
      <div className="text-center py-12">
        <div className="bg-background/60 backdrop-blur-sm p-8 rounded-xl border border-border/50 inline-block">
          <h2 className="text-xl font-semibold mb-2">No projects found</h2>
          <p className="text-muted-foreground mb-4">
            Try changing your filters or search query
          </p>
          <Link href="/projects">
            <Button>View All Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{projects.length}</span>{" "}
          projects
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in animation-delay-500">
        {projects.map((project, index) => (
          <ProjectCard
            key={project._id.toString()}
            project={project}
            index={index}
          />
        ))}
      </div>
    </>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const isFeatured = project.featured;

  return (
    <Card
      key={project._id.toString()}
      className={cn(
        "h-full overflow-hidden border-border/50 group transition-all duration-300 bg-card/50 backdrop-blur-sm hover-card-effect animate-slide-up relative",
        isFeatured && "ring-2 ring-primary/20"
      )}
      style={{ animationDelay: `${300 + index * 100}ms` }}
    >
      {isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground"
          >
            Featured
          </Badge>
        </div>
      )}

      <Link
        href={`/projects/${project._id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg?height=600&width=800"}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 ease-in-out group-hover:scale-105"
            priority={index < 6}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>

      <CardContent className="p-6 relative">
        <div className="space-y-4">
          {project.category && (
            <span className="text-xs font-medium text-muted-foreground">
              {project.category}
            </span>
          )}

          <Link
            href={`/projects/${project._id}`}
            className="block group/title focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <h3 className="text-xl font-bold group-hover/title:text-primary transition-colors line-clamp-2">
              {project.title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link href={`/projects/${project._id}`}>
              <Button
                variant="ghost"
                className="gap-1 px-0 text-primary hover:text-primary/80 hover:bg-transparent group-hover:translate-x-1 transition-transform"
                aria-label={`View details for ${project.title}`}
              >
                View Details <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <ProjectLinks
              githubUrl={project.githubUrl}
              demoUrl={project.demoUrl}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
