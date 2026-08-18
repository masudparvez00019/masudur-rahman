"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Globe,
  Heart,
  Github,
  Linkedin,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "../ui/section-heading";
import type { IAbout } from "@/lib/models/about";
import { IHeader } from "@/lib/models/header";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AboutProps {
  about?: Partial<IAbout>;
  header?: Partial<IHeader>;
}

export default function About({ about, header, experiences }: AboutProps) {
  const [activeTab, setActiveTab] = useState("bio");

  // Extract profile image from about object or use default
  const profileImage = header?.hero?.profileImageUrl || "/profile.webp";
  const socialLinks = header?.socialLinks;

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Children animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="about"
      className="py-16 md:py-24 relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 -z-10 opacity-20 w-[300px] h-[300px] rounded-full bg-primary/20 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-20 w-[200px] h-[200px] rounded-full bg-purple-500/20 blur-[80px]"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="About Me"
          subtitle="Learn more about my background, qualifications, and interests"
        />

        <div className="grid md:grid-cols-12 gap-8 mt-12">
          {/* Profile & Bio Column */}
          <motion.div
            className="md:col-span-5 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Profile Card */}
            <Card className="shadow-lg overflow-hidden border-border/50 hover:border-primary/50 group transition-all duration-300 bg-background/60 backdrop-blur-sm hover:shadow-glow">
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={profileImage}
                  alt={about?.fullName || "Masudur Rahman"}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              </div>
              <CardContent className="pt-4 pb-6 relative -mt-14 text-center">
                <div className="bg-background/70 backdrop-blur-md shadow-lg rounded-full mx-auto p-1 w-24 h-24 ring-4 ring-background mb-3">
                  <Image
                    src={profileImage || "/profile.webp"}
                    alt={about?.fullName || "Masudur Rahman"}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  {about?.fullName || "Masudur Rahman"}
                </h3>
                <p className="text-primary font-medium">
                  {about?.jobTitle || "Full Stack Developer"}
                </p>

                {/* Social Media Links */}
                <div className="flex justify-center gap-3 mt-4">
                  {Object.entries(socialLinks).map(([key, link]) => (
                    <Button
                      key={key}
                      size="icon"
                      variant="outline"
                      className="rounded-full"
                      asChild
                    >
                      <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {key === "github" && <Github className="w-5 h-5" />}
                        {key === "linkedin" && <Linkedin className="w-5 h-5" />}
                        {key === "facebook" && <Facebook className="w-5 h-5" />}
                        {key === "messagecircle" && (
                          <MessageCircle className="w-5 h-5" />
                        )}
                        {key === "mail" && <Mail className="w-5 h-5" />}
                        {key === "phone" && <Phone className="w-5 h-5" />}
                        <span className="sr-only">{key}</span>
                      </Link>
                    </Button>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button asChild className="group hover-button-effect">
                    <Link
                      href={about?.resumeUrl || "/resume.pdf"}
                      target="_blank"
                    >
                      <FileText className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Download Resume
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Column */}
          <div className="md:col-span-7">
            <Tabs
              defaultValue="bio"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="bio" className="flex items-center gap-2">
                  <span className="hidden md:inline-flex">Biography</span>
                  <span className="md:hidden">Bio</span>
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="flex items-center gap-2"
                >
                  <span className="hidden md:inline-flex">Experience</span>
                  <span className="md:hidden">Work</span>
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="flex items-center gap-2"
                >
                  <span className="hidden md:inline-flex">Education</span>
                  <span className="md:hidden">Edu</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <span className="hidden md:inline-flex">Details</span>
                  <span className="md:hidden">More</span>
                </TabsTrigger>
              </TabsList>

              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Biography Tab */}
                    <TabsContent value="bio" className="mt-0">
                      <Card className="border-border/50 shadow-md bg-background/60 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold">
                            My Story
                          </CardTitle>
                          <CardDescription>
                            A bit about my background and journey
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                          <p>
                            {about?.bio ||
                              "Hello! I'm Masudur Rahman, a passionate full-stack web developer specializing in creating beautiful, functional, and user-friendly web applications. With over 5 years of experience in the field, I've worked on a diverse range of projects, from small business websites to complex enterprise applications."}
                          </p>
                          <p>
                            {about?.bioExtended ||
                              "My journey in web development began during my university days, where I discovered my passion for coding. Since then, I've been constantly learning and expanding my skillset to stay on top of the latest industry trends and technologies."}
                          </p>
                          <p>
                            {about?.bioConclusion ||
                              "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through blog posts and tutorials."}
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Experience Tab */}
                    <TabsContent value="experience" className="mt-0">
                      <Card className="border-border/50 shadow-md bg-background/60 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold flex items-center">
                            <Briefcase className="mr-2 h-5 w-5 text-primary" />
                            Professional Experience
                          </CardTitle>
                          <CardDescription>
                            My professional journey and work experience
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <motion.ol
                            className="relative border-l border-muted pl-6 space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {(
                              experiences || [
                                {
                                  position: "Senior Full Stack Developer",
                                  company: "Tech Solutions Inc",
                                  duration: "2020 - Present",
                                  description:
                                    "Leading development of enterprise web applications using React, Node.js, and MongoDB. Implementing CI/CD pipelines and mentoring junior developers.",
                                },
                                {
                                  position: "Web Developer",
                                  company: "Digital Creatives",
                                  duration: "2018 - 2020",
                                  description:
                                    "Developed responsive websites and e-commerce solutions. Worked with Vue.js, PHP, and MySQL.",
                                },
                              ]
                            )
                              .slice(0, 1)
                              .map((exp, index) => (
                                <motion.li
                                  key={index}
                                  className="relative"
                                  variants={itemVariants}
                                >
                                  <div className="absolute -left-[27px] bg-background rounded-full border border-muted p-1">
                                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <h3 className="font-bold flex items-center">
                                      {exp.position}
                                    </h3>
                                    <p className="text-sm font-medium text-primary">
                                      {exp.company}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {exp.duration}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {exp.description}
                                    </p>
                                  </div>
                                </motion.li>
                              ))}
                          </motion.ol>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="ghost"
                            asChild
                            className="ml-auto group"
                          >
                            <Link href="/#experience">
                              View Full Experience
                              <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education" className="mt-0">
                      <Card className="border-border/50 shadow-md bg-background/60 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold flex items-center">
                            <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                            Education & Certifications
                          </CardTitle>
                          <CardDescription>
                            My academic background and professional
                            certifications
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {/* Education */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">
                                Academic Education
                              </h3>
                              {(
                                about?.education || [
                                  {
                                    degree:
                                      "Bachelor of Science in Computer Science",
                                    institution: "University of Technology",
                                    year: "2014 - 2018",
                                    description:
                                      "Specialized in software engineering with focus on web technologies",
                                  },
                                ]
                              ).map((edu, index) => (
                                <motion.div
                                  key={index}
                                  className="p-4 rounded-lg border border-border/50 bg-muted/30"
                                  variants={itemVariants}
                                >
                                  <h4 className="font-medium">{edu.degree}</h4>
                                  <p className="text-sm text-primary">
                                    {edu.institution}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {edu.year}
                                  </p>
                                  {edu.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {edu.description}
                                    </p>
                                  )}
                                </motion.div>
                              ))}
                            </div>

                            {/* Certifications */}
                            {/* <div className="space-y-4">
                              <h3 className="text-lg font-semibold">
                                Certifications
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(
                                  about?.certifications || [
                                    {
                                      title:
                                        "AWS Certified Solutions Architect",
                                      issuer: "Amazon Web Services",
                                      year: "2022",
                                    },
                                    {
                                      title: "Professional React Developer",
                                      issuer: "Meta",
                                      year: "2021",
                                    },
                                  ]
                                ).map((cert, index) => (
                                  <motion.div
                                    key={index}
                                    className="p-3 rounded-lg border border-border/50 bg-muted/30"
                                    variants={itemVariants}
                                  >
                                    <h4 className="font-medium text-sm">
                                      {cert.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground flex justify-between">
                                      <span>{cert.issuer}</span>
                                      <span>{cert.year}</span>
                                    </p>
                                  </motion.div>
                                ))}
                              </div>
                            </div> */}
                          </motion.div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Skills & Details Tab */}
                    <TabsContent value="skills" className="mt-0">
                      <div className="grid gap-4">
                        {/* Personal Info Card */}
                        <Card className="border-border/50 shadow-md bg-background/60 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">
                              Personal Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <motion.div
                              className="grid sm:grid-cols-2 gap-x-8 gap-y-4"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <motion.div
                                className="space-y-1"
                                variants={itemVariants}
                              >
                                <h3 className="text-sm font-medium text-muted-foreground">
                                  Name
                                </h3>
                                <p>{about?.fullName || "Masudur Rahman"}</p>
                              </motion.div>
                              <motion.div
                                className="space-y-1"
                                variants={itemVariants}
                              >
                                <h3 className="text-sm font-medium text-muted-foreground">
                                  Email
                                </h3>
                                <p>
                                  {about?.email || "contact@masudurrahman.com"}
                                </p>
                              </motion.div>
                              <motion.div
                                className="space-y-1"
                                variants={itemVariants}
                              >
                                <h3 className="text-sm font-medium text-muted-foreground">
                                  Location
                                </h3>
                                <p>{about?.location || "Dhaka, Bangladesh"}</p>
                              </motion.div>
                              <motion.div
                                className="space-y-1"
                                variants={itemVariants}
                              >
                                <h3 className="text-sm font-medium text-muted-foreground">
                                  Availability
                                </h3>
                                <p>{about?.availability || "Full-time"}</p>
                              </motion.div>
                            </motion.div>
                          </CardContent>
                        </Card>

                        <div className="grid sm:grid-cols-2 gap-4">
                          {/* Languages Card */}
                          <Card className="border-border/50 shadow-md bg-background/60 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center">
                                <Globe className="mr-2 h-4 w-4 text-primary" />
                                Languages
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <motion.div
                                className="space-y-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                {(
                                  about?.languages || [
                                    { name: "English", proficiency: "Fluent" },
                                    { name: "Bengali", proficiency: "Native" },
                                  ]
                                ).map((lang, index) => (
                                  <motion.div
                                    key={index}
                                    variants={itemVariants}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span>{lang.name}</span>
                                      <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-full">
                                        {lang.proficiency}
                                      </span>
                                    </div>
                                    <div className="mt-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                      <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{
                                          width:
                                            lang.proficiency === "Native"
                                              ? "100%"
                                              : lang.proficiency === "Fluent"
                                              ? "90%"
                                              : lang.proficiency ===
                                                "Proficient"
                                              ? "75%"
                                              : lang.proficiency ===
                                                "Intermediate"
                                              ? "50%"
                                              : "30%",
                                        }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                      />
                                    </div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </CardContent>
                          </Card>

                          {/* Interests Card */}
                          <Card className="border-border/50 shadow-md bg-background/60 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center">
                                <Heart className="mr-2 h-4 w-4 text-primary" />
                                Interests
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <motion.div
                                className="flex flex-wrap gap-2"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                {(
                                  about?.interests || [
                                    "Web Development",
                                    "Open Source",
                                    "UI/UX Design",
                                    "Tech Blogging",
                                    "Photography",
                                  ]
                                ).map((interest, index) => (
                                  <motion.span
                                    key={index}
                                    className="px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-primary/20 hover:text-primary transition-colors duration-300 cursor-default"
                                    variants={itemVariants}
                                  >
                                    {interest}
                                  </motion.span>
                                ))}
                              </motion.div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
