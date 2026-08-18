"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TableOfContentsProps {
  toc: Array<{
    level: number;
    text: string;
    slug: string;
  }>;
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeHeading, setActiveHeading] = useState("");

  useEffect(() => {
    if (toc.length === 0) return;

    const headingElements = toc
      .map(({ slug }) => document.getElementById(slug))
      .filter(Boolean) as HTMLElement[];

    const headingObserver = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is currently visible
        const visibleHeadings = entries.filter((entry) => entry.isIntersecting);

        if (visibleHeadings.length > 0) {
          // Get the ID of the first visible heading
          const visibleHeadingId = visibleHeadings[0].target.id;
          setActiveHeading(visibleHeadingId);
        }
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0.3,
      }
    );

    headingElements.forEach((element) => {
      headingObserver.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        headingObserver.unobserve(element);
      });
    };
  }, [toc]);

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Table of contents" className="space-y-1">
      <ul className="m-0 list-none space-y-1">
        {toc.map(({ level, text, slug }) => {
          const isActive = activeHeading === slug;
          return (
            <li
              key={slug}
              className={cn(
                "mt-0 relative",
                level === 2 ? "pt-1" : "pt-0.5",
                level === 3 && "pl-3",
                level === 4 && "pl-6"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-toc-item"
                  className="absolute left-0 w-0.5 h-full rounded-full bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <a
                href={`#${slug}`}
                className={cn(
                  "inline-block text-sm no-underline transition-colors duration-200 hover:text-primary py-0.5 pl-2",
                  isActive
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(slug)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest",
                  });
                }}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
