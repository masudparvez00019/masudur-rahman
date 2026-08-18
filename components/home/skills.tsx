"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Frontend,
  Backend,
  Database,
  Cloud,
  Design,
  Tools,
  Mobile,
} from "../icons/skill-icons";
import SectionHeading from "../ui/section-heading";
import type { ISkill } from "@/lib/models/skill";

// Icon mapping
const iconComponents: Record<string, React.ComponentType<any>> = {
  Frontend: Frontend,
  Backend: Backend,
  Database: Database,
  Cloud: Cloud,
  Design: Design,
  Tools: Tools,
  Mobile: Mobile,
};

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("/api/skills");
        if (response.ok) {
          const data = await response.json();
          setSkillCategories(data);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
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
      <section id="skills" className="py-16 md:py-24 relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <SectionHeading
            title="Skills & Expertise"
            subtitle="Technologies and tools I've worked with"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm animate-pulse"
              >
                <CardHeader className="pb-2">
                  <div className="h-6 bg-primary/20 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <div
                        key={j}
                        className="h-6 bg-primary/10 rounded-full w-16"
                      ></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Skills & Expertise"
          subtitle="Technologies and tools I've worked with"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {skillCategories.length > 0 ? (
            skillCategories.map((category) => {
              // Get the icon component or use Frontend as fallback
              const IconComponent = iconComponents[category.icon] || Frontend;

              return (
                <motion.div key={category._id.toString()} variants={item}>
                  <Card className="h-full overflow-hidden border-border/50 group hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <IconComponent className="h-6 w-6" />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground group-hover:bg-primary/20 transition-colors duration-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No skills found. Add some skills from the admin dashboard.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
