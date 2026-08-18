import { connectToDB } from "./mongodb"
import { User } from "./models/user"
import { Project } from "./models/project"
import { Blog } from "./models/blog"
import { Settings } from "./models/settings"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"

async function seedDatabase() {
  try {
    console.log("Connecting to database...")
    await connectToDB()
    console.log("Connected to database")

    // Check if data already exists
    const userCount = await User.countDocuments()
    const projectCount = await Project.countDocuments()
    const blogCount = await Blog.countDocuments()
    const settingsCount = await Settings.countDocuments()

    if (userCount > 0 || projectCount > 0 || blogCount > 0 || settingsCount > 0) {
      console.log("Database already has data. Skipping seed.")
      return
    }

    console.log("Seeding database...")

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    })

    console.log("Admin user created")

    // Create settings
    await Settings.create({
      fullName: "Masudur Rahman",
      email: "contact@masudurrahman.com",
      bio: "Web developer focused on creating beautiful and user-friendly web applications.",
      location: "Dhaka, Bangladesh",
      profileImage: "/placeholder.svg?height=100&width=100",
      socialLinks: {
        github: "https://github.com/masudurrahman",
        linkedin: "https://linkedin.com/in/masudurrahman",
        twitter: "https://twitter.com/masudurrahman",
        website: "https://masudurrahman.com",
      },
      appearance: {
        accentColor: "#7c3aed",
        defaultTheme: "dark",
        enableAnimations: true,
        enableParticles: true,
      },
    })

    console.log("Settings created")

    // Create projects
    const projects = [
      {
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
        featured: true,
      },
      {
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
        featured: true,
      },
      {
        title: "My Chat",
        description:
          "My Chat is a Realtime Chat Application With Group Chat Functionality. It's built for Safe Messaging and Communication.",
        longDescription:
          "My Chat is a sophisticated real-time communication platform designed for secure and efficient messaging. Built with Next.js and Firebase, it offers seamless one-on-one and group chat capabilities with end-to-end encryption. The application features real-time message delivery, read receipts, and typing indicators to enhance the user experience. Users can share various media types, including images, videos, and documents. The platform includes robust user management with customizable profiles and privacy settings. Group chat functionality allows for community building with features like moderation tools and thread organization. The responsive design ensures a consistent experience across all devices, making My Chat an ideal solution for both personal and professional communication needs.",
        image: "/placeholder.svg?height=600&width=800",
        tags: ["Next.js", "Firebase", "Tailwind CSS"],
        demoUrl: "https://mychat.example.com",
        githubUrl: "https://github.com/example/mychat",
        features: [
          "Real-time messaging",
          "End-to-end encryption",
          "Group chat functionality",
          "Media sharing capabilities",
          "Read receipts and typing indicators",
          "Customizable user profiles",
          "Cross-platform compatibility",
        ],
        screenshots: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        featured: true,
      },
    ]

    await Project.insertMany(projects)
    console.log("Projects created")

    // Create blog posts
    const blogs = [
      {
        title: "Building Modern Web Applications Using Next 14",
        excerpt: "Explore the latest features and best practices for building modern web applications with Next.js 14.",
        content: `
          <p>Next.js has rapidly become the go-to framework for building modern web applications, and with the release of Next.js 14, it brings even more powerful features to the table. In this post, we'll explore the latest advancements and best practices for creating cutting-edge web experiences.</p>
          
          <h2>The Evolution of Next.js</h2>
          <p>Since its initial release, Next.js has continuously evolved to meet the ever-changing demands of web development. Version 14 represents a significant leap forward, with improvements in performance, developer experience, and overall capabilities.</p>
          
          <h2>Key Features in Next.js 14</h2>
          <ul>
            <li><strong>Enhanced App Router:</strong> Building upon the App Router introduced in Next.js 13, version 14 brings further optimizations and new features to streamline routing in your applications.</li>
            <li><strong>Improved Server Components:</strong> React Server Components are now more powerful and easier to use, allowing for more efficient rendering strategies.</li>
            <li><strong>Turbopack Advancements:</strong> The Rust-based bundler continues to improve, offering even faster build times and development experiences.</li>
            <li><strong>Enhanced Image Component:</strong> The Image component now includes more optimization options and better performance metrics.</li>
          </ul>
          
          <h2>Building a Modern Application</h2>
          <p>When building a modern web application with Next.js 14, it's essential to embrace the latest patterns and practices. This includes leveraging server components for improved performance, using the App Router for simplified routing, and taking advantage of the enhanced image optimization capabilities.</p>
          
          <p>By adopting these modern approaches, you can create web applications that are not only fast and responsive but also maintainable and scalable for future growth.</p>
          
          <h2>Conclusion</h2>
          <p>Next.js 14 represents a significant step forward in the evolution of web development frameworks. By embracing its new features and patterns, developers can create more efficient, performant, and user-friendly web applications that meet the demands of today's digital landscape.</p>
        `,
        image: "/placeholder.svg?height=600&width=1200",
        category: "Web Development",
        tags: ["Next.js", "React", "Web Development", "JavaScript", "Frontend"],
        author: adminUser._id,
        readTime: "5 min read",
        published: true,
        comments: [],
      },
      {
        title: "The Power of Tailwind CSS",
        excerpt: "Discover why Tailwind CSS has become so popular and the best practices for modern web development.",
        content: `
          <p>Tailwind CSS has revolutionized the way we approach styling in web development. With its utility-first methodology, it offers unprecedented flexibility and efficiency in creating beautiful, responsive designs.</p>
          
          <h2>Why Tailwind CSS?</h2>
          <p>Traditional CSS frameworks often come with predefined components and styles that can be limiting. Tailwind CSS, on the other hand, provides low-level utility classes that let you build completely custom designs without leaving your HTML.</p>
          
          <h2>Key Benefits of Tailwind CSS</h2>
          <ul>
            <li><strong>Productivity:</strong> With Tailwind, you can rapidly build user interfaces without writing custom CSS, allowing for faster development cycles.</li>
            <li><strong>Consistency:</strong> Tailwind's utility classes help maintain a consistent design system throughout your application.</li>
            <li><strong>Responsiveness:</strong> Built-in responsive modifiers make it easy to create designs that work across all screen sizes.</li>
            <li><strong>Customization:</strong> Unlike other frameworks, Tailwind is highly customizable, allowing you to tailor it to your specific design needs.</li>
          </ul>
          
          <h2>Best Practices</h2>
          <p>While Tailwind CSS offers tremendous flexibility, it's important to follow some best practices to ensure your code remains maintainable:</p>
          
          <ul>
            <li>Use component extraction for repeated elements</li>
            <li>Leverage Tailwind's configuration file for customization</li>
            <li>Utilize the @apply directive for complex, repeated utility combinations</li>
            <li>Implement a consistent naming convention for your components</li>
          </ul>
          
          <h2>Conclusion</h2>
          <p>Tailwind CSS represents a paradigm shift in how we approach styling in web development. By embracing its utility-first philosophy, developers can create beautiful, responsive designs more efficiently than ever before. As the framework continues to evolve, it's likely to remain at the forefront of modern web development practices.</p>
        `,
        image: "/placeholder.svg?height=600&width=1200",
        category: "CSS",
        tags: ["CSS", "Tailwind CSS", "Web Development", "Frontend", "UI Design"],
        author: adminUser._id,
        readTime: "4 min read",
        published: true,
        comments: [],
      },
      {
        title: "Mastering Framer Motion Animations",
        excerpt: "Learn how to create stunning animations in React applications using Framer Motion.",
        content: `
          <p>Animations can significantly enhance the user experience of your web applications. Framer Motion is a powerful library that makes it easy to add beautiful animations to your React projects. In this post, we'll explore how to master Framer Motion to create stunning, interactive user interfaces.</p>
          
          <h2>Getting Started with Framer Motion</h2>
          <p>Framer Motion is a production-ready motion library for React that makes it easy to create animations and interactive user interfaces. It provides a simple declarative syntax that makes complex animations accessible to developers of all skill levels.</p>
          
          <h2>Basic Animation Concepts</h2>
          <ul>
            <li><strong>Variants:</strong> Define animation states and transitions between them</li>
            <li><strong>Gestures:</strong> Add drag, hover, and tap animations</li>
            <li><strong>Transitions:</strong> Control how animations play out over time</li>
            <li><strong>Layout Animations:</strong> Animate components when their layout changes</li>
          </ul>
          
          <h2>Advanced Techniques</h2>
          <p>Once you've mastered the basics, you can explore more advanced techniques like:</p>
          
          <ul>
            <li>Orchestrating complex animation sequences</li>
            <li>Creating physics-based animations</li>
            <li>Implementing page transitions</li>
            <li>Building interactive 3D effects</li>
          </ul>
          
          <h2>Performance Considerations</h2>
          <p>While animations can enhance user experience, they can also impact performance if not implemented correctly. Framer Motion is optimized for performance, but it's still important to follow best practices:</p>
          
          <ul>
            <li>Use the <code>layout</code> prop for simple layout animations</li>
            <li>Leverage hardware acceleration with the <code>willChange</code> property</li>
            <li>Avoid animating expensive CSS properties like <code>box-shadow</code></li>
            <li>Use the <code>useTransform</code> hook for efficient derived values</li>
          </ul>
          
          <h2>Conclusion</h2>
          <p>Framer Motion is a powerful tool for creating engaging animations in React applications. By mastering its features and following best practices, you can create stunning user interfaces that delight your users and set your applications apart.</p>
        `,
        image: "/placeholder.svg?height=600&width=1200",
        category: "Animations",
        tags: ["React", "Framer Motion", "Animations", "Frontend", "UI/UX"],
        author: adminUser._id,
        readTime: "6 min read",
        published: true,
        comments: [],
      },
    ]

    await Blog.insertMany(blogs)
    console.log("Blog posts created")

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    // Close the connection
    await mongoose.disconnect()
    console.log("Disconnected from database")
  }
}

// Run the seed function
seedDatabase()

