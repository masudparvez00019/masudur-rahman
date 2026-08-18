"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  BookOpen,
  GraduationCap,
  Tag,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Tutorial {
  _id: string;
  title: string;
  slug: string;
}

interface Topic {
  _id: string;
  title: string;
  slug: string;
  tutorials: Tutorial[];
}

interface TopicSidebarProps {
  topics: Topic[];
  currentTopicSlug?: string;
}

export function TopicSidebar({ topics, currentTopicSlug }: TopicSidebarProps) {
  const pathname = usePathname();
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tutorials based on search query
  const filteredTopics = topics.map((topic) => ({
    ...topic,
    tutorials: searchQuery
      ? topic.tutorials.filter((tutorial) =>
          tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : topic.tutorials,
  }));

  // Initialize expanded state based on current topic and search query
  useEffect(() => {
    if (currentTopicSlug) {
      setExpandedTopics((prev) => ({
        ...prev,
        [currentTopicSlug]: true,
      }));
    }

    // Expand all topics when searching
    if (searchQuery) {
      const newExpanded: Record<string, boolean> = {};
      topics.forEach((topic) => {
        newExpanded[topic.slug] = true;
      });
      setExpandedTopics(newExpanded);
    }
  }, [currentTopicSlug, searchQuery, topics]);

  const toggleTopic = (slug: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedTopics((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // Expand all topics
  const expandAll = () => {
    const newExpanded: Record<string, boolean> = {};
    topics.forEach((topic) => {
      newExpanded[topic.slug] = true;
    });
    setExpandedTopics(newExpanded);
  };

  // Collapse all topics except current
  const collapseAll = () => {
    const newExpanded: Record<string, boolean> = {};
    if (currentTopicSlug) {
      newExpanded[currentTopicSlug] = true;
    }
    setExpandedTopics(newExpanded);
  };

  // Count total tutorials
  const totalTutorials = topics.reduce(
    (sum, topic) => sum + topic.tutorials.length,
    0
  );

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tutorials..."
          className="w-full pl-8 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          <h2 className="font-medium text-foreground">Topics</h2>
          <Badge variant="secondary" className="text-xs">
            {totalTutorials}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={expandAll}
            className="h-7 text-xs"
          >
            Expand
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={collapseAll}
            className="h-7 text-xs"
          >
            Collapse
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {filteredTopics.map((topic) => {
          const isCurrentTopic = currentTopicSlug === topic.slug;
          const hasVisibleTutorials = topic.tutorials.length > 0;

          return (
            <div
              key={topic._id}
              className="space-y-1 rounded-lg transition-all"
            >
              <div
                className={cn(
                  "flex items-center justify-between rounded-md transition-all",
                  isCurrentTopic && "bg-accent/50"
                )}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start font-medium text-sm py-2",
                    isCurrentTopic && "text-primary font-medium"
                  )}
                  onClick={() => hasVisibleTutorials && toggleTopic(topic.slug)}
                >
                  <Link
                    href={`/tutorial/${topic.slug}`}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="truncate">{topic.title}</span>
                    {!searchQuery && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {topic.tutorials.length}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {hasVisibleTutorials && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={(e) => toggleTopic(topic.slug, e)}
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedTopics[topic.slug] && "rotate-180"
                      )}
                    />
                  </Button>
                )}
              </div>

              <AnimatePresence initial={false}>
                {expandedTopics[topic.slug] && hasVisibleTutorials && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 pl-2 border-l space-y-1 py-1">
                      {topic.tutorials.map((tutorial) => {
                        const isCurrent =
                          pathname ===
                          `/tutorial/${topic.slug}/${tutorial.slug}`;

                        return (
                          <Button
                            key={tutorial._id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start text-sm h-auto py-1.5",
                              isCurrent
                                ? "bg-accent text-accent-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Link
                              href={`/tutorial/${topic.slug}/${tutorial.slug}`}
                              className="truncate"
                            >
                              {isCurrent && (
                                <span className="absolute left-0 w-1 h-4 bg-primary rounded-full" />
                              )}
                              {tutorial.title}
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredTopics.every((topic) => topic.tutorials.length === 0) &&
          searchQuery && (
            <div className="text-center py-8">
              <Tag className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">
                No tutorials found
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}
