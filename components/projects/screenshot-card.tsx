"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";

type ScreenshotCardProps = {
  src: string;
  alt: string;
};

export default function ScreenshotCard({ src, alt }: ScreenshotCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Card Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-lg overflow-hidden border border-border/50 bg-background/40 shadow-md hover:shadow-lg cursor-pointer group"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={src || "/placeholder.svg?height=400&width=600"}
            alt={alt}
            width={400}
            height={300}
            className={cn(
              "w-full h-full object-cover transition-all duration-3000 ease-linear",
              isHovering && "scroll-animation"
            )}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/70 text-white py-2 px-4 rounded-md text-sm">
              View Full Size
            </div>
          </div>
        </div>
      </motion.div>{" "}
      {/* Dialog for image preview */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-fit max-w-fit p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {alt || "Image Preview"}
          </DialogTitle>
          <ImageContent src={src} alt={alt} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function ImageContent({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <>
      {/* Modal Toolbar */}
      <div className="sticky top-0 bg-background/90 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <div className="flex gap-2">
          <button
            onClick={zoomIn}
            className="p-2 rounded-md hover:bg-muted transition"
            aria-label="Zoom In"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button
            onClick={zoomOut}
            className="p-2 rounded-md hover:bg-muted transition"
            aria-label="Zoom Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button
            onClick={resetZoom}
            className="p-2 rounded-md hover:bg-muted transition"
            aria-label="Reset Zoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
        <DialogClose
          className="p-2 rounded-md hover:bg-muted transition"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </DialogClose>
      </div>

      {/* Image Container */}
      <motion.div
        className="overflow-auto p-4 flex items-center justify-center h-[80vh]"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          style={{ transform: `scale(${scale})` }}
          className="origin-center"
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          animate={{ scale }}
        >
          <Image
            src={src || "/placeholder.svg?height=800&width=1200"}
            alt={alt}
            width={1200}
            height={800}
            className="max-w-none"
          />
        </motion.div>
      </motion.div>
    </>
  );
}
