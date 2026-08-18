"use client";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProjectLinksProps {
  githubUrl?: string;
  demoUrl?: string;
}

export default function ProjectLinks({
  githubUrl,
  demoUrl,
}: ProjectLinksProps) {
  return (
    <div className="flex gap-2">
      {githubUrl && (
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <Github className="h-5 w-5" />
        </Link>
      )}
      {demoUrl && (
        <Link
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}
