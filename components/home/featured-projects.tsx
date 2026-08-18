"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  ArrowUpRight,
  Code2,
  ExternalLink,
  Eye,
  Github,
  GraduationCap,
  LayoutGrid,
  Lightbulb,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "../ui/section-heading";
import { cn } from "@/lib/utils";
import type { IProject } from "@/lib/models/project";
import { fallbackProjects } from "@/lib/data";

type SerializedProject = Omit<IProject, "_id"> & {
  _id: string;
};

// Project category icons
const categoryIcons: Record<string, React.ReactNode> = {
  "Web Application": <LayoutGrid className="h-4 w-4" />,
  "Mobile App": <Lightbulb className="h-4 w-4" />,
  "AI Tool": <Code2 className="h-4 w-4" />,
  "Data Visualization": <Eye className="h-4 w-4" />,
  Educational: <GraduationCap className="h-4 w-4" />,
};

// Project Card Component
const ProjectCard = ({
  project,
  index,
}: {
  project: SerializedProject;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const categoryIcon = categoryIcons[project.category] || (
    <Code2 className="h-4 w-4" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 group transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-lg relative flex flex-col">
        {/* Image container without wrapping Link */}
        <div className="relative">
          <div className="relative h-56 overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg?height=600&width=800"}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={90}
              priority={index < 3}
              className="object-cover transition duration-500 ease-in-out group-hover:scale-105"
            />

            {/* Tags overlay */}
            <div className="absolute top-0 left-0 right-0 px-3 py-2 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-center">
              <Badge
                variant="secondary"
                className="backdrop-blur-md bg-black/40 text-white border-white/10"
              >
                {categoryIcon}
                <span className="ml-1">{project.category}</span>
              </Badge>

              {project.completionDate && (
                <Badge
                  variant="outline"
                  className="backdrop-blur-md bg-black/40 text-white border-white/10"
                >
                  {new Date(project.completionDate).getFullYear()}
                </Badge>
              )}
            </div>

            {/* Main clickable overlay for project details - simply add z-index to ensure it's under the buttons */}
            <Link
              href={`/projects/${project._id}`}
              className="absolute inset-0 z-10"
              aria-label={`View ${project.title} details`}
            >
              <span className="sr-only">View project details</span>
            </Link>

            {/* Hover overlay with buttons - higher z-index */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full"
                asChild
              >
                <Link href={`/projects/${project._id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  Details
                </Link>
              </Button>

              <div className="flex gap-2">
                {project.demoUrl && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    asChild
                  >
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View live demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                )}

                {project.githubUrl && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    asChild
                  >
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View source code on GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <CardContent className="p-5 flex-grow">
          <div className="space-y-3">
            <Link href={`/projects/${project._id}`}>
              <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>
            </Link>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.tags.slice(0, 4).map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-secondary/40 text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 4 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{project.tags.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        {project.role && (
          <CardFooter className="px-5 py-3 border-t border-border/40 bg-muted/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {project.role
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span>
                My role:{" "}
                <span className="font-medium text-foreground">
                  {project.role}
                </span>
              </span>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<SerializedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const response = await fetch("/api/projects?featured=true", {
          next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data.length > 0 ? data : fallbackProjects);
        setError(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(fallbackProjects);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Extract unique categories for filter tabs
  // const categories = useMemo(() => {
  //   const uniqueCategories = Array.from(
  //     new Set(projects.map((project) => project.category))
  //   );
  //   return ["all", ...uniqueCategories];
  // }, [projects]);

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.category === filter);
  }, [projects, filter]);

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

  return (
    <section id="projects" className="py-16 md:py-24 relative">
      {/* Background decoration */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-500/5 rounded-full filter blur-[80px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Featured Projects"
          subtitle="Showcasing my best work and contributions"
          align="center"
        />

        {error && (
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-lg py-2 px-4 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Could not load projects from the server. Showing examples
                instead.
              </p>
            </div>
          </div>
        )}

        {/* Category filter tabs - only show if we have multiple categories */}
        {/* {categories.length > 1 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-8 mb-10"
          >
            <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
              <TabsList className="h-9 grid grid-flow-col auto-cols-max gap-1">
                <TabsTrigger value="all" className="px-3">
                  All Projects
                </TabsTrigger>

                {categories.slice(1).map((category, i) => (
                  <TabsTrigger key={i} value={category} className="px-3">
                    <span className="flex items-center gap-1.5">
                      {categoryIcons[category]}
                      {category}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        )} */}

        <AnimatePresence mode="wait">
          <motion.div
            key={filter} // Re-render when filter changes
            variants={container}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card
                  key={`skeleton-${index}`}
                  className="h-full overflow-hidden border-border/50 bg-card/50"
                >
                  <div className="relative h-56 bg-muted/70 animate-pulse"></div>
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
                    <div className="h-4 bg-muted/70 animate-pulse rounded w-1/2"></div>
                  </div>
                </Card>
              ))
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={index}
                />
              ))
            ) : (
              // Empty state
              <motion.div
                className="col-span-full flex flex-col items-center justify-center py-16 bg-muted/30 rounded-lg border border-dashed border-border/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-primary/60" />
                </div>
                <h3 className="text-xl font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {filter !== "all"
                    ? `No projects found in the "${filter}" category`
                    : "No featured projects have been added yet"}
                </p>

                {filter !== "all" && (
                  <Button variant="outline" onClick={() => setFilter("all")}>
                    View All Projects
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Show View All button only if we have projects and we're not loading */}
        {!loading && projects.length > 0 && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild size="lg" className="px-8 gap-2 group">
              <Link href="/projects">
                <span>View All Projects</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Project stats */}
        {/* {!loading && projects.length > 0 && (
          <motion.div
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border/40 text-center">
              <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Projects
              </h4>
              <p className="text-2xl font-bold mt-1">{projects.length}</p>
            </div>

            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border/40 text-center">
              <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                Top Technology
              </h4>
              <p className="text-lg font-bold mt-1">
                {(() => {
                  const allTags = projects.flatMap((p) => p.tags);
                  const tagCounts = allTags.reduce((acc, tag) => {
                    acc[tag] = (acc[tag] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  const topTag =
                    Object.entries(tagCounts).sort(
                      (a, b) => b[1] - a[1]
                    )[0]?.[0] || "N/A";
                  return topTag;
                })()}
              </p>
            </div>

            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border/40 text-center">
              <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                Categories
              </h4>
              <p className="text-2xl font-bold mt-1">{categories.length - 1}</p>
            </div>

            <div className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border/40 text-center">
              <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                Latest Project
              </h4>
              <p className="text-lg font-bold mt-1 truncate">
                {projects.sort(
                  (a, b) =>
                    new Date(b.completionDate || "").getTime() -
                    new Date(a.completionDate || "").getTime()
                )[0]?.title || "N/A"}
              </p>
            </div>
          </motion.div>
        )} */}
      </div>
    </section>
  );
}
