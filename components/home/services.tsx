"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import SectionHeading from "../ui/section-heading";
import type { IService } from "@/lib/models/service";
import Link from "next/link";

// Icon mapping
const getIconComponent = (iconName: string) => {
  // This is a simple way to render icons based on their names
  // You can expand this with more icons as needed
  try {
    const LucideIcon = require("lucide-react")[iconName];
    return LucideIcon ? <LucideIcon className="h-6 w-6 text-primary" /> : null;
  } catch (error) {
    console.error(`Icon ${iconName} not found:`, error);
    return null;
  }
};

export default function Services() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Render loading skeleton if loading
  if (loading) {
    return (
      <section id="services" className="py-16 md:py-24 relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionHeading title="Services" subtitle="What I can do for you" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm animate-pulse"
              >
                <CardHeader className="pb-2">
                  <div className="h-6 bg-primary/20 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted/50 rounded w-full mb-4"></div>
                  <div className="h-4 bg-muted/50 rounded w-full mb-4"></div>
                  <div className="h-4 bg-muted/50 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2 mt-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary/20"></div>
                        <div className="h-4 bg-muted/50 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-primary/20 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading title="Services" subtitle="What I can do for you" />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {services.length > 0 ? (
            services.map((service) => (
              <motion.div key={service._id.toString()} variants={item}>
                <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 group transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-glow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {getIconComponent(service.icon)}
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                    {service.isPopular && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        Popular
                      </Badge>
                    )}
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex items-center justify-between">
                      {service.price && (
                        <p className="font-semibold">{service.price}</p>
                      )}
                      <Button
                        className="ml-auto gap-1 group-hover:gap-2 transition-all"
                        asChild
                      >
                        <Link href="#contact">
                          Get Started <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No services found. Add some services from the admin dashboard.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
