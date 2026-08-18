import { connectToDB } from "@/lib/mongodb";
import { Experience, IExperience } from "@/lib/models/experience";
import { fallbackExperiences } from "@/lib/data";

export async function getExperiences(): Promise<IExperience[]> {
  try {
    await connectToDB();
    const experiences = await Experience.find()
      
    
    if (!experiences || experiences.length === 0) {
      return fallbackExperiences;
    }
    
    return JSON.parse(JSON.stringify(experiences)) as IExperience[];
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return fallbackExperiences;
  }
}
