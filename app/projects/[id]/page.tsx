import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Code,
  Layers,
  Lightbulb,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/mongodb";
import { Project } from "@/lib/models/project";
import ScreenshotCard from "@/components/projects/screenshot-card";
import mongoose from "mongoose";
import type { Metadata, ResolvingMetadata } from "next/types";
import { fallbackProject } from "@/lib/data";

// Types
type Props = {
  params: { id: string };
};

// Metadata generation for SEO
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  let project;

  try {
    const db = await connectToDB();
    if (db) {
      project = await Project.findOne({
        $or: [{ slug: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
      });
    }

    if (!project) {
      project = fallbackProject[id as keyof typeof fallbackProject];
    }

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
      };
    }

    // Enhanced metadata with more SEO details
    return {
      title: `${project.title} | Portfolio Project`,
      description: project.description,
      openGraph: {
        title: `${project.title} | Professional Portfolio Project`,
        description: project.description,
        images: [
          {
            url: project.image || "/placeholder.svg?height=600&width=800",
            width: 800,
            height: 600,
            alt: project.title,
          },
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: project.description,
        images: [project.image || "/placeholder.svg?height=600&width=800"],
      },
    };
  } catch (error) {
    return {
      title: "Project Details",
      description: "View detailed information about this portfolio project",
    };
  }
}

// Main component
export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const project = await fetchProjectData(id);

  if (!project) {
    return notFound();
  }

  // Generate JSON-LD structured data for better SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    author: {
      "@type": "Person",
      name: "Portfolio Owner",
    },
    datePublished: project.createdAt || new Date().toISOString(),
    screenshot: project.screenshots?.[0] || project.image,
    softwareVersion: project.version || "1.0",
    keywords: project.tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat">
      {/* Background element with animation */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-80 background-image blur-md backdrop-blur"></div>

      {/* JSON-LD structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Progress indicator for long scrolls */}
      <div
        id="progress-bar"
        className="fixed top-0 left-0 h-1 bg-primary z-50"
      ></div>

      <main className="animate-fade-in">
        {/* Back navigation */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="group mb-8 hover:bg-background/60"
          >
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16 space-y-16">
          {/* Hero Section */}
          <section className="animate-fade-in-up animation-delay-200">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Project details */}
              <div className="space-y-6 rounded-lg bg-background/40 backdrop-blur-md border border-border/50 shadow-lg p-6 lg:p-8 order-2 lg:order-1">
                <div>
                  {project.category && (
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2 inline-block">
                      {project.category}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
                    {project.title}
                  </h1>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Description */}
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {/* Project metadata */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border/50">
                  {project.client && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Client:
                      </span>
                      <span className="font-medium">{project.client}</span>
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{project.duration}</span>
                    </div>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="hover-button-effect" asChild>
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="hover-button-effect"
                    asChild
                  >
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Featured Image */}
              <div className="rounded-lg overflow-hidden border border-border/50 shadow-lg h-fit lg:h-fit lg:flex lg:items-center order-1 lg:order-2 group animate-fade-in-right">
                <Image
                  src={project.image || "/placeholder.svg?height=600&width=800"}
                  alt={project.title}
                  width={800}
                  height={600}
                  priority={true}
                  className="w-full h-fit object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </section>

          {/* Features & Tech Stack */}
          <section className="animate-fade-in-up animation-delay-400">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Key Features */}
              <div className="bg-background/40 backdrop-blur-md border border-border/50 shadow-lg p-6 md:p-8 rounded-lg hover-card-effect">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Key Features</h2>
                </div>

                <ul className="space-y-4">
                  {project.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary text-lg font-bold mt-1">
                        •
                      </span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="bg-background/40 backdrop-blur-md border border-border/50 shadow-lg p-6 md:p-8 rounded-lg hover-card-effect">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Tech Stack</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      className="text-sm py-1.5 px-4 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {project.challenges && (
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <h3 className="text-xl font-semibold mb-3">
                      Challenges & Solutions
                    </h3>
                    <p className="text-muted-foreground">
                      {project.challenges}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Screenshots section with better organization */}
          <section className="animate-fade-in-up animation-delay-600">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-full bg-primary/10">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Project Screenshots</h2>
            </div>

            <Suspense fallback={<ScreenshotsSkeleton />}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.screenshots.map(
                  (screenshot: string, index: number) => (
                    <ScreenshotCard
                      key={index}
                      src={
                        screenshot || "/placeholder.svg?height=400&width=600"
                      }
                      alt={`${project.title} screenshot ${index + 1}`}
                      priority={index < 3} // Only prioritize loading for the first 3 images
                    />
                  )
                )}
              </div>
            </Suspense>
          </section>

          {/* Related Projects or Additional Info if available */}
          {project.relatedProjects && project.relatedProjects.length > 0 && (
            <section className="animate-fade-in-up animation-delay-800">
              <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Related projects would be mapped here */}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

// Helper function to fetch project data
async function fetchProjectData(id: string) {
  try {
    const db = await connectToDB();

    let project;

    if (db) {
      project = await Project.findOne({
        $or: [{ slug: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
      });
    }

    if (!project) {
      project = fallbackProject[id as keyof typeof fallbackProject];
    }

    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return fallbackProject[id as keyof typeof fallbackProject];
  }
}

// Skeleton loader for screenshots
function ScreenshotsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="aspect-video rounded-lg overflow-hidden bg-muted/30 animate-pulse"
        />
      ))}
    </div>
  );
}
