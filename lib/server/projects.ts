import { connectToDB } from "../mongodb"
import { Project } from "@/lib/models/project"


// Sample project data for fallback during build
const fallbackProjects = [
  {
    _id: "aibuddy",
    title: "AiBuddy",
    description:
      "AI Chat assistant built with Next.js. Chat with Smart AI, leveraging OpenAI's GPT-4 for intelligent responses.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Next.js", "React", "TypeScript", "OpenAI"],
    demoUrl: "https://aibuddy.example.com",
    githubUrl: "https://github.com/example/aibuddy",
  },
  {
    _id: "fitrecipes",
    title: "Fit Recipes",
    description:
      "Fit Recipes is a Nutrition-Based AI Recipe Generator. Create personalized recipes based on your dietary preferences.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    demoUrl: "https://fitrecipes.example.com",
    githubUrl: "https://github.com/example/fitrecipes",
  },
  {
    _id: "mychat",
    title: "My Chat",
    description:
      "My Chat is a Realtime Chat Application With Group Chat Functionality. It's built for Safe Messaging and Communication.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Next.js", "Firebase", "Tailwind CSS"],
    demoUrl: "https://mychat.example.com",
    githubUrl: "https://github.com/example/mychat",
  },
]

// Sample project details for fallback during build
const fallbackProjectDetails = {
  aibuddy: {
    _id: "aibuddy",
    title: "AiBuddy",
    description:
      "AI Chat assistant built with Next.js. Chat with Smart AI, leveraging OpenAI's GPT-4 for intelligent responses.",
    longDescription:
      "AiBuddy is a sophisticated AI assistant platform built with Next.js and powered by OpenAI's GPT-4. It provides users with real-time, intelligent conversation capabilities, handling various user queries from simple questions to complex problem-solving tasks. The application features a sleek, responsive interface designed for optimal user experience across all devices. Users can save their conversation history, export chats, and even customize the AI's response style. The platform includes premium features like voice conversations and document analysis, making it a versatile tool for professionals, students, and casual users alike.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Next.js", "React", "TypeScript", "OpenAI"],
    demoUrl: "https://aibuddy.example.com",
    githubUrl: "https://github.com/example/aibuddy",
    features: [
      "Real-time AI conversations with GPT-4",
      "Responsive design for all devices",
      "Conversation history and chat exports",
      "Custom AI personality settings",
      "Voice conversations",
      "Document analysis",
    ],
    screenshots: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
  fitrecipes: {
    _id: "fitrecipes",
    title: "Fit Recipes",
    description:
      "Fit Recipes is a Nutrition-Based AI Recipe Generator. Create personalized recipes based on your dietary preferences.",
    longDescription:
      "Fit Recipes is a cutting-edge nutrition-based AI recipe generator designed to revolutionize meal planning. This application allows users to create personalized recipes based on their unique dietary preferences, restrictions, and fitness goals. Using advanced machine learning algorithms, Fit Recipes analyzes nutritional data and user preferences to suggest optimal meal options. The platform includes features like calorie tracking, macro-nutrient calculation, and shopping list generation. Users can save favorite recipes, share their creations, and track their nutritional intake over time. The intuitive interface makes healthy eating accessible to everyone, from fitness enthusiasts to busy professionals looking for quick, healthy meal ideas.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    demoUrl: "https://fitrecipes.example.com",
    githubUrl: "https://github.com/example/fitrecipes",
    features: [
      "AI-powered recipe generation",
      "Personalized nutrition recommendations",
      "Dietary restriction accommodations",
      "Calorie and macro-nutrient tracking",
      "Shopping list generation",
      "Meal planning calendar",
    ],
    screenshots: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
}

export async function getAllProjects() {
  try {
    // Connect to database
    await connectToDB()

    // Fetch all projects and sort by order field
    const allProjects = await Project.find().sort({ order: 1, createdAt: -1 })

    if (allProjects && allProjects.length > 0) {
      return JSON.parse(JSON.stringify(allProjects))
    }

    return fallbackProjects
  } catch (error) {
    console.error("Error fetching projects:", error)
    // Use fallback data
    return fallbackProjects
  }
}

export async function getProjectById(id: string) {
  try {
    // Connect to database
    await connectToDB()

    // Fetch project by ID
    const project = await Project.findById(id)

    if (project) {
      return JSON.parse(JSON.stringify(project))
    }

    // If no project found in DB, try fallback data
    return fallbackProjectDetails[id] || null
  } catch (error) {
    console.error("Error fetching project:", error)
    // Try fallback data
    return fallbackProjectDetails[id] || null
  }
}
