"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Award, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

interface Certification {
  _id: string;
  title: string;
  organization: string;
  issueDate: string;
  description: string;
  imagePath: string;
}

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertification, setSelectedCertification] =
    useState<Certification | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize Embla carousel with autoplay plugin - memoized options
  const carouselOptions = useMemo(
    () => ({
      loop: true,
      align: "start",
      slidesToScroll: 1,
    }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  // Memoized fetch function to avoid recreation on each render
  const fetchCertifications = useCallback(async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("/api/certifications", {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch certifications: ${response.status}`);
      }

      const data = await response.json();
      setCertifications(data);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching certifications:", error);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to fetch data when component mounts
  useEffect(() => {
    fetchCertifications();

    // Cleanup function
    return () => {
      // Will clean up any pending state updates
    };
  }, [fetchCertifications]);

  // Memoized event handlers to avoid recreation on each render
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleCardClick = useCallback((certification: Certification) => {
    setSelectedCertification(certification);
    setOpen(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  // Memoize the renderable certificates to prevent unnecessary re-renders
  const renderableCertifications = useMemo(() => {
    return certifications.map((certification, index) => (
      <motion.div
        key={certification._id}
        className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4"
        variants={cardVariants}
        custom={index}
      >
        <motion.div
          className="border border-border/50 hover:border-primary/50 group transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-glow rounded-xl h-full"
          onClick={() => handleCardClick(certification)}
          tabIndex={0}
          role="button"
          aria-label={`View ${certification.title} certificate`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleCardClick(certification);
            }
          }}
          whileHover={{
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(var(--primary-rgb), 0.3)",
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
            <Image
              src={certification.imagePath || "/placeholder.svg"}
              alt={certification.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {certification.title}
            </h3>

            <div className="flex items-center text-muted-foreground mb-2">
              <Award className="h-4 w-4 mr-2" />
              <span>{certification.organization}</span>
            </div>

            <div className="flex items-center text-muted-foreground mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {new Date(certification.issueDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <p className="text-muted-foreground line-clamp-3">
              {certification.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    ));
  }, [certifications, handleCardClick]);

  if (loading) {
    return (
      <section id="certifications" className="py-20">
        <div className="container px-4 mx-auto">
          <SectionHeading
            title="Certifications & Achievements"
            subtitle="A showcase of my professional certifications and achievements that validate my expertise and skills."
          />
          <div className="flex justify-center items-center h-40 mt-12">
            <motion.div
              className="text-muted-foreground"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.98, 1, 0.98],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Loading certifications...
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="certifications" className="py-20">
        <div className="container px-4 mx-auto">
          <SectionHeading
            title="Certifications & Achievements"
            subtitle="A showcase of my professional certifications and achievements."
          />
          <div className="flex flex-col justify-center items-center h-40 mt-12 gap-4">
            <div className="text-muted-foreground">
              Failed to load certifications. Please try again.
            </div>
            <Button
              variant="outline"
              onClick={fetchCertifications}
              className="bg-primary/10 hover:bg-primary/20"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="certifications"
      className="py-20 z-10 relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container px-4 mx-auto">
        <SectionHeading
          title="Certifications & Achievements"
          subtitle="A showcase of my professional certifications and achievements that validate my expertise and skills."
        />

        <motion.div
          className="relative mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {certifications.map((certification, index) => (
                <motion.div
                  key={certification._id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4"
                  variants={cardVariants}
                  custom={index}
                >
                  <motion.div
                    className="border border-border/50 hover:border-primary/50 group transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-glow rounded-xl h-full"
                    onClick={() => handleCardClick(certification)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${certification.title} certificate`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleCardClick(certification);
                      }
                    }}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 10px 25px -5px rgba(var(--primary-rgb), 0.3)",
                      transition: { duration: 0.3 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                      <Image
                        src={certification.imagePath || "/placeholder.svg"}
                        alt={certification.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {certification.title}
                      </h3>

                      <div className="flex items-center text-muted-foreground mb-2">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{certification.organization}</span>
                      </div>

                      <div className="flex items-center text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(certification.issueDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <p className="text-muted-foreground line-clamp-3">
                        {certification.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {/* <motion.button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/80 hover:bg-background text-primary p-3 rounded-full shadow-md z-10"
            aria-label="Previous slide"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
          <motion.button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/80 hover:bg-background text-primary p-3 rounded-full shadow-md z-10"
            aria-label="Next slide"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button> */}
        </motion.div>
      </div>

      {/* Certificate Image Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none sm:max-w-[90vw] md:max-w-[85vw] overflow-hidden">
            {selectedCertification && (
              <DialogTitle className="sr-only">
                {selectedCertification.title} Certificate
              </DialogTitle>
            )}
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-50 bg-background/80 hover:bg-background"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>

              <motion.div
                className="relative rounded-lg overflow-hidden w-full"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {selectedCertification && (
                  <>
                    <div className="aspect-[16/9] w-full max-h-[80vh] relative">
                      <Image
                        src={
                          selectedCertification.imagePath || "/placeholder.svg"
                        }
                        alt={selectedCertification.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, 85vw"
                        priority
                        quality={100}
                      />
                    </div>
                    <motion.div
                      className="p-3 sm:p-4 bg-background"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg sm:text-xl font-bold truncate">
                        {selectedCertification.title}
                      </h3>
                      <div className="flex flex-wrap items-center text-muted-foreground mt-1 text-sm sm:text-base">
                        <div className="flex items-center mr-3">
                          <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="truncate">
                            {selectedCertification.organization}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span>
                            {new Date(
                              selectedCertification.issueDate
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </motion.section>
  );
}
