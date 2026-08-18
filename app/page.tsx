import About from "@/components/home/about";
import Contact from "@/components/home/contact";
import Experience from "@/components/home/experience";
import FeaturedProjects from "@/components/home/featured-projects";
import Hero from "@/components/home/hero";
import LatestBlogPosts from "@/components/home/latest-blog-posts";
import Skills from "@/components/home/skills";
import { getAboutData } from "@/lib/server/about";
import Services from "@/components/home/services";
import Certifications from "@/components/home/certifications";
import { getHeader, initializeDefaultHeader } from "@/lib/server/header";
import { serializeData } from "@/lib/utils";
import { get } from "http";
import { getExperiences } from "@/lib/server/experience";

export default async function Home() {
  await initializeDefaultHeader();
  const [header, about, experiences] = await Promise.all([
    getHeader(),
    getAboutData(),
    getExperiences(),
  ]);

  // Serialize the data to plain objects
  const serializedHeader = serializeData(header);
  const serializedAbout = serializeData(about);
  const serializedExperiences = serializeData(experiences);

  return (
    <>
      <main className="min-h-screen bg-cover bg-center bg-no-repeat object-fit-contain text-foreground relative overflow-hidden">
        <div className="fixed inset-0 backdrop-blur-lg backdrop-filter blur-lg bg-no-repeat dark:bg-cover dark:opacity-100 opacity-30 w-full h-screen background-image"></div>

        <Hero header={serializedHeader} />
        <About
          about={serializedAbout}
          header={serializedHeader}
          experiences={serializedExperiences}
        />
        <Skills />
        <Experience experiences={serializedExperiences} />
        <Certifications />
        <FeaturedProjects />
        <Services />
        <LatestBlogPosts />
        <Contact />
      </main>
    </>
  );
}
