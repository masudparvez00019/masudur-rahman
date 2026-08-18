"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Github,
  Linkedin,
  Facebook,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Particles from "../ui/Particles";
import TypingAnimation from "../TypingAnimation";
import type { IHeader, IHero } from "@/lib/models/header";

interface HeroProps {
  header?: Partial<IHeader>;
}

export default function Hero({ header }: HeroProps) {
  // Default values if no data is provided
  const defaultHero: IHero = {
    title: `Turning ideas into impactful code.`,
    subtitle: "Hey, I'm",
    description: "Building Seamless Solutions, One Line at a Time.",
    typingTexts: [
      "Masudur Rahman 👋",
      "A Full-Stack Developer",
      "A React Enthusiast",
      "A Flutter Developer",
      "A Problem Solver",
    ],
    tags: [
      "💻 Coding Enthusiast",
      "🌐 Full-Stack Developer",
      "✡️ React.js Developer",
      "⚛️ Next.js Developer",
      "📱 Flutter Developer",
    ],
    ctaText: "Hire Me",
    ctaLink: "/#contact",
    showProfileImage: true,
  };

  const defaultSocialLinks = {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    messagecircle: "https://twitter.com",
    phone: "tel:+1234567890",
    mail: "mailto:example@example.com",
  };

  // Use provided data or defaults
  const hero = header?.hero || defaultHero;
  const socialLinks = header?.socialLinks || defaultSocialLinks;
  const profileImageUrl = hero.profileImageUrl || "/profile.webp";

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-20 pb-16 relative "
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm bg-no-repeat bg-cover opacity-50 w-full h-screen">
        <Particles
          particleColors={["#800080", "#4B0082", "#FFC0CB"]} // Purple, Indigo, Pink
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className={undefined}
        />
      </div>

      {/* Background Video */}
      

      <div className="max-w-6xl w-full mx-auto px-4 md:px-8 z-10">
        <div className="flex flex-col gap-8 md:gap-12 items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="space-y-3"
          >
            {hero.showProfileImage && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2.0, ease: "easeInOut" }}
                className="relative w-32 h-32 mx-auto mb-4"
              >
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  fill
                  priority
                  className="rounded-full object-cover border-4 border-primary/20"
                  sizes="(max-width: 128px) 100vw, 128px"
                />
              </motion.div>
            )}
            <p className="text-xl md:text-2xl font-medium text-muted-foreground">
              {hero.subtitle}{" "}
              <span className="text-primary font-bold">
                <TypingAnimation
                  texts={hero.typingTexts}
                  speed={100}
                  delay={2000}
                />
              </span>{" "}
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {hero.title.split(" ").map((word, index) =>
                word.includes("ideas") ? (
                  <span key={index}>
                    <span className="text-gradient">ideas</span> <br />
                  </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              )}
            </h1>
          </motion.div>
          <div className="">
            {" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3 justify-center text-sm "
            >
              {hero.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 hover:bg-black hover:scale-105 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap mt-2 justify-center text-muted-foreground"
            >
              <span className="px-3 py-1 ">{hero.description}</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button size="lg" asChild>
              <Link href={hero.ctaLink}>{hero.ctaText}</Link>
            </Button>

            <div className="flex gap-2">
              {Object.entries(socialLinks).map(([key, link]) => (
                <Button
                  key={key}
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  asChild
                >
                  <Link href={link} target="_blank" rel="noopener noreferrer">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.8 }}
            className="absolute bottom-10"
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full animate-bounce border border-primary/20 hover:bg-primary/10"
              onClick={() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
