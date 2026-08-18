import { IBlog } from "./models/blog";
import { IExperience } from "./models/experience";

export const fallbackBlogPosts = [
    {
      _id: "507f1f77bcf86cd799439011", // MongoDB-like ObjectId
      title: "Building Modern Web Applications Using Next 14",
      excerpt:
        "Explore the latest features and best practices for building modern web applications with Next.js 14.",
      createdAt: "2025-03-10T00:00:00.000Z",
      readTime: "5 min read",
      image: "/placeholder.svg?height=400&width=600",
      category: "Web Development",
    },
    {
      _id: "507f1f77bcf86cd799439012",
      title: "The Power of Tailwind CSS",
      excerpt:
        "Discover why Tailwind CSS has become so popular and the best practices for modern web development.",
      createdAt: "2025-02-25T00:00:00.000Z",
      readTime: "4 min read",
      image: "/placeholder.svg?height=400&width=600",
      category: "CSS",
    },
    {
      _id: "507f1f77bcf86cd799439013",
      title: "Mastering Framer Motion Animations",
      excerpt:
        "Learn how to create stunning animations in React applications using Framer Motion.",
      createdAt: "2025-01-15T00:00:00.000Z",
      readTime: "6 min read",
      image: "/placeholder.svg?height=400&width=600",
      category: "Animations",
    },
  ];
  
export const fallbackBlogPost = {
    Next: {
      _id: "507f1f77bcf86cd799439011",
      title: "Building Modern Web Applications Using Next 14",
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
      createdAt: "2025-03-10T00:00:00.000Z",
      readTime: "5 min read",
      image: "/placeholder.svg?height=600&width=1200",
      category: "Web Development",
      tags: ["Next.js", "React", "Web Development", "JavaScript", "Frontend"],
      author: {
        name: "Masudur Rahman",
        image: "/placeholder.svg?height=100&width=100",
      },
      comments: [],
    },
    Tailwind: {
      _id: "507f1f77bcf86cd799439012",
      title: "The Power of Tailwind CSS",
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
      createdAt: "2025-02-25T00:00:00.000Z",
      readTime: "4 min read",
      image: "/placeholder.svg?height=600&width=1200",
      category: "CSS",
      tags: ["CSS", "Tailwind CSS", "Web Development", "Frontend", "UI Design"],
      author: {
        name: "Masudur Rahman",
        image: "/placeholder.svg?height=100&width=100",
      },
      comments: [],
    },
  };

export const fallbackProjects = {
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
  };

export const fallbackProject = {
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
  };


export const fallbackExperiences: IExperience[] = [
  {
    _id: "exp1",
    position: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    startDate: "2021-06-01",
    endDate: "Present",
    duration: "Jun 2021 - Present",
    current: true,
    description: [
      "Led the development of a React-based dashboard that increased user engagement by 40%",
      "Architected and implemented a component library used across 5 different products",
      "Mentored junior developers through code reviews and pair programming sessions",
      "Optimized application performance resulting in 60% faster load times",
    ],
    tags: ["React", "TypeScript", "Redux", "Next.js", "Tailwind CSS", "Jest"],
    website: "https://techcorp.example",
    featured: true,
  },
  {
    _id: "exp2",
    position: "Frontend Developer",
    company: "Digital Innovations Ltd",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    startDate: "2019-03-15",
    endDate: "2021-05-30",
    duration: "Mar 2019 - May 2021",
    current: false,
    description: [
      "Developed responsive web applications using React and Vue.js",
      "Implemented state management solutions with Redux and Vuex",
      "Collaborated with UI/UX designers to create intuitive user interfaces",
      "Participated in agile development processes with daily standups and sprint planning",
    ],
    tags: ["Vue.js", "React", "JavaScript", "CSS3", "RESTful APIs", "Git"],
    website: "https://digitalinnovations.example",
    featured: true,
  },
  {
    _id: "exp3",
    position: "Web Development Intern",
    company: "StartTech Agency",
    location: "Remote",
    type: "Internship",
    startDate: "2018-06-01",
    endDate: "2019-02-28",
    duration: "Jun 2018 - Feb 2019",
    current: false,
    description: [
      "Assisted in developing websites for small businesses using WordPress and custom HTML/CSS",
      "Created responsive layouts and implemented basic JavaScript functionality",
      "Learned about web hosting, domain management, and SEO best practices",
      "Participated in weekly team meetings and client presentations",
    ],
    tags: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "WordPress",
      "PHP",
      "Responsive Design",
    ],
    website: "https://starttechagency.example",
    featured: false,
  },
];


// Fallback Article posts in case API fails
export const fallbackArticlePosts: IBlog[] = [
  {
    _id: "blog-1",
    title: "Building Responsive Web Applications with Next.js and Tailwind CSS",
    excerpt:
      "Learn how to create modern, responsive web applications using the power of Next.js for server-side rendering and Tailwind CSS for utility-first styling.",
    content: "",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    category: "Web Development",
    tags: ["Next.js", "Tailwind CSS", "React", "Responsive Design"],
    author: {
      name: "Your Name",
      avatar: "/avatar.jpg",
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    readTime: "5 min read",
    published: true,
  },
  {
    _id: "blog-2",
    title: "Mastering State Management in React Applications",
    excerpt:
      "Explore different state management approaches in React, from useState and useReducer to external libraries like Redux and Zustand.",
    content: "",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    category: "React",
    tags: ["React", "State Management", "Redux", "Hooks"],
    author: {
      name: "Your Name",
      avatar: "/avatar.jpg",
    },
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    readTime: "8 min read",
    published: true,
  },
  {
    _id: "blog-3",
    title: "Essential TypeScript Patterns for Frontend Developers",
    excerpt:
      "Discover the most useful TypeScript patterns and practices that will improve type safety and development experience in your projects.",
    content: "",
    image:
      "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800&h=400&fit=crop",
    category: "TypeScript",
    tags: ["TypeScript", "JavaScript", "Frontend", "Development"],
    author: {
      name: "Your Name",
      avatar: "/avatar.jpg",
    },
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    readTime: "6 min read",
    published: true,
  },
];