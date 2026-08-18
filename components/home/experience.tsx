"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { calculateDuration, cn, formatDate } from "@/lib/utils";
import SectionHeading from "../ui/section-heading";
import {
  Calendar,
  ChevronDown,
  MapPin,
  Briefcase,
  Building2,
  ExternalLink,
} from "lucide-react";
import { fallbackExperiences } from "@/lib/data";
import { IExperience } from "@/lib/models/experience";
import Link from "next/link";

// Define employment type badges
const typeColors: Record<string, string> = {
  "Full-time":
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "Part-time":
    "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Contract:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Freelance:
    "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Internship: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
  Remote:
    "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
};

// Experience Timeline Item Component
const ExperienceItem = ({
  experience,
  index,
  isExpanded,
  toggleExpand,
  isLast,
  position,
}: {
  experience: IExperience;
  index: number;
  isExpanded: boolean;
  toggleExpand: () => void;
  isLast: boolean;
  position: "left" | "right";
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Animation for card entry
  const entryAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={entryAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-[26px] top-14 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 to-primary/10 md:left-1/2 md:ml-[-1px]"></div>
      )}

      {/* Timeline bullet */}
      <div className="absolute left-5 top-6 z-10 md:left-1/2 md:ml-[-10px]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
          className={cn(
            "w-5 h-5 rounded-full border-2",
            experience.featured
              ? "bg-primary border-primary shadow-glow-sm"
              : "bg-background border-primary/50"
          )}
        />
      </div>

      {/* Experience card with time indicator */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-2 pt-1 pb-10">
        {/* Date column - visible based on position */}
        {position === "right" ? (
          <>
            {/* Date on left, Card on right (for 'right' positioned items) */}
            <div className="hidden md:flex flex-col items-end pr-10 pt-4 text-right">
              <div className="flex items-center justify-end gap-2 mb-2">
                <span className="font-medium">
                  {/* {formatDate(experience.startDate)} */}
                  {experience.duration}
                </span>
                <Calendar className="h-4 w-4 text-primary/70" />
              </div>
              <span className="text-sm text-muted-foreground">
                {/* {experience.current
                  ? "Present"
                  : formatDate(experience.endDate || "")} */}
              </span>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1">
                {/* {calculateDuration(
                  experience.startDate,
                  experience.endDate || "Present"
                )} */}
                {experience.duration}
              </span>
            </div>

            {/* Card column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="md:pl-10 ml-12 md:ml-0"
            >
              <Card
                className={cn(
                  "overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300",
                  experience.featured
                    ? "shadow-md hover:shadow-xl hover:shadow-primary/5"
                    : "shadow-sm hover:shadow-md",
                  experience.featured
                    ? "border-primary/30"
                    : "hover:border-primary/20"
                )}
              >
                {experience.featured && (
                  <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
                )}

                <CardContent className="p-0">
                  {/* Header section with position, company */}
                  <div className="p-5 pb-3">
                    <div className="flex md:hidden items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{experience.duration}</span>
                    </div>

                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {experience.position}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {experience.company}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {experience.location}
                        </span>
                      </div>
                    </div>

                    {/* Employment type badge */}
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-3 font-normal",
                        typeColors[experience.type] ||
                          "bg-primary/10 text-primary"
                      )}
                    >
                      <Briefcase className="h-3 w-3 mr-1" />
                      {experience.type}
                    </Badge>
                  </div>

                  {/* Description section - collapsible */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500",
                      isExpanded
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-5 py-3 border-t border-border/50">
                      <h4 className="text-sm font-medium mb-3">
                        Responsibilities & Achievements
                      </h4>
                      <ul className="space-y-3">
                        {experience.description.map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary font-medium text-sm mt-1">
                              •
                            </span>
                            <p className="text-sm text-muted-foreground">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags section */}
                    <div className="px-5 py-3 border-t border-border/50">
                      <h4 className="text-sm font-medium mb-2">
                        Technologies & Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {experience.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="rounded-md text-xs bg-secondary/40"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Website link if available */}
                    {experience.website && (
                      <div className="px-5 pb-4 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 gap-1.5 text-primary hover:text-primary hover:bg-primary/5"
                          asChild
                        >
                          <Link
                            href={experience.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit company website
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Expand/Collapse button */}
                  <div
                    className="border-t border-border/50 p-2 flex justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={toggleExpand}
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground animate-bounce" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <>
            {/* Card on left, Date on right (for 'left' positioned items) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="md:pr-10 ml-12 md:ml-0"
            >
              <Card
                className={cn(
                  "overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300",
                  experience.featured
                    ? "shadow-md hover:shadow-xl hover:shadow-primary/5"
                    : "shadow-sm hover:shadow-md",
                  experience.featured
                    ? "border-primary/30"
                    : "hover:border-primary/20"
                )}
              >
                {experience.featured && (
                  <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
                )}

                <CardContent className="p-0">
                  {/* Header section - same as above */}
                  <div className="p-5 pb-3">
                    <div className="flex md:hidden items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{experience.duration}</span>
                    </div>

                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {experience.position}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {experience.company}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {experience.location}
                        </span>
                      </div>
                    </div>

                    {/* Employment type badge */}
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-3 font-normal",
                        typeColors[experience.type] ||
                          "bg-primary/10 text-primary"
                      )}
                    >
                      <Briefcase className="h-3 w-3 mr-1" />
                      {experience.type}
                    </Badge>
                  </div>

                  {/* Description section - collapsible */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500",
                      isExpanded
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-5 py-3 border-t border-border/50">
                      <h4 className="text-sm font-medium mb-3">
                        Responsibilities & Achievements
                      </h4>
                      <ul className="space-y-3">
                        {experience.description.map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary font-medium text-sm mt-1">
                              •
                            </span>
                            <p className="text-sm text-muted-foreground">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags section */}
                    <div className="px-5 py-3 border-t border-border/50">
                      <h4 className="text-sm font-medium mb-2">
                        Technologies & Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {experience.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="rounded-md text-xs bg-secondary/40"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Website link if available */}
                    {experience.website && (
                      <div className="px-5 pb-4 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 gap-1.5 text-primary hover:text-primary hover:bg-primary/5"
                          asChild
                        >
                          <Link
                            href={experience.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit company website
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Expand/Collapse button */}
                  <div
                    className="border-t border-border/50 p-2 flex justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={toggleExpand}
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground animate-bounce" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Date column on the right */}
            <div className="hidden md:flex flex-col items-start pl-10 pt-4 text-left">
              <div className="flex items-center justify-start gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary/70" />
                <span className="font-medium">
                  {/* {formatDate(experience.startDate)} */}
                  {experience.duration}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {/* {experience.current
                  ? "Present"
                  : formatDate(experience.endDate || "")} */}
              </span>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1">
                {/* {calculateDuration(
                  experience.startDate,
                  experience.endDate || "Present"
                )} */}
                {experience.duration}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Update the main component to pass alternating position props
export default function Experience({
  experiences,
}: {
  experiences?: IExperience[];
}) {
  // const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 0.5, 0.5, 0]
  );

  // useEffect(() => {
  //   async function fetchExperiences() {
  //     setLoading(true);
  //     try {
  //       const response = await fetch("/api/experiences");
  //       if (response.ok) {
  //         const data = await response.json();
  //         setExperiences(data);
  //       } else {
  //         throw new Error("Failed to fetch experiences");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching experiences:", error);
  //       // Use fallback data
  //       setExperiences(fallbackExperiences);
  //       setError(true);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchExperiences();
  // }, []);

  // Toggle expanded state of an item
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter experiences based on selected filter
  const filteredExperiences = experiences.filter((exp) => {
    if (filter === "all") return true;
    if (filter === "featured") return exp.featured;
    if (filter === "current") return exp.current;
    return exp.type === filter;
  });

  // Render loading skeleton if loading
  if (loading) {
    return (
      <section id="experience" className="py-16 md:py-24 relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionHeading
            title="Work Experience"
            subtitle="My professional journey and roles"
            align="left"
          />

          {/* Experience summary skeleton */}

          <div className="mt-12 space-y-12">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative grid md:grid-cols-[1fr_3fr] gap-6 group animate-pulse"
              >
                <div className="space-y-2">
                  <div className="h-6 bg-primary/20 rounded w-3/4"></div>
                  <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 bg-muted/50 rounded-full w-24"></div>
                    <div className="h-6 bg-muted/50 rounded-full w-20"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className="h-4 bg-muted/50 rounded w-full"
                      ></div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div
                        key={j}
                        className="h-6 bg-muted/50 rounded-full w-16"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="py-16 md:py-24 relative"
      ref={sectionRef}
    >
      {/* Background decoration */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"
        style={{ opacity: backgroundOpacity }}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Work Experience"
          subtitle="My professional journey and career milestones"
          align="center"
        />

        {error && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-md">
            <p className="text-amber-600 dark:text-amber-400 text-sm text-center">
              Could not load data from server. Showing example content instead.
            </p>
          </div>
        )}

        <div className="mt-10 relative">
          {filteredExperiences.length > 0 ? (
            <div className="relative">
              {/* Timeline */}
              <div className="relative">
                {filteredExperiences.map((exp, index) => (
                  <ExperienceItem
                    key={exp._id.toString()}
                    experience={exp}
                    index={index}
                    isExpanded={!!expandedItems[exp._id.toString()]}
                    toggleExpand={() => toggleExpand(exp._id.toString())}
                    isLast={index === filteredExperiences.length - 1}
                    position={index % 2 === 0 ? "right" : "left"} // Alternate left and right
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border/30">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 mb-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No experience entries found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {filter !== "all" ? (
                  <>
                    No experiences match the current filter. Try selecting a
                    different filter.
                  </>
                ) : (
                  <>
                    There are no experience entries available. Please add some
                    from the admin dashboard.
                  </>
                )}
              </p>
              {filter !== "all" && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setFilter("all")}
                >
                  Show All Experience
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
