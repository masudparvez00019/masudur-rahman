# Portfolio Project

A modern, full-stack portfolio application built with Next.js, MongoDB, and TypeScript. This portfolio website showcases projects, blogs, skills, and services with a comprehensive admin dashboard for content management.

![Portfolio Preview](/public/placeholder.svg)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Frontend Components](#frontend-components)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Admin Dashboard](#admin-dashboard)
- [Chat Functionality](#chat-functionality)
- [Deployment](#deployment)
- [License](#license)

## Features

- 🚀 **Modern UI** - Responsive, mobile-first design with dark/light mode support
- 🔐 **Authentication** - Next-Auth integration with Google OAuth and email/password
- 📂 **Project Showcase** - Display your projects with details, screenshots, and links
- 📝 **Blog System** - Write and publish blog posts with comments and categories
- 🎯 **Skills Section** - Showcase your technical skills by category
- 💼 **Experience Timeline** - Highlight your work experience and education
- 📊 **Admin Dashboard** - Full CMS for managing all content
- 💬 **AI Chat Integration** - Interactive chat functionality for visitors
- 📱 **Responsive Design** - Optimized for all device sizes
- 🌐 **SEO Friendly** - Dynamic metadata for better search engine visibility
- 🖼️ **Image Management** - Cloudinary integration for image uploads
- 📧 **Contact Form** - User-friendly contact functionality

## Tech Stack

### Frontend
- **Next.js** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Accessible UI components 
- **Framer Motion** - Animations and transitions
- **Next-Auth** - Authentication
- **Embla Carousel** - Responsive carousel component

### Backend
- **Next.js API Routes** - API endpoints
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **NextAuth.js** - Authentication
- **Cloudinary** - Image storage and optimization

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Copy the environment variables file
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your own values

5. Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The following environment variables need to be set:

```
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Server Configuration
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@example.com
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=noreply@example.com

# Node Environment
NODE_ENV=development
```

## Project Structure

```
portfolio/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard
│   ├── blog/             # Blog pages
│   ├── login/            # Authentication pages
│   ├── profile/          # User profile pages
│   ├── projects/         # Project pages
│   └── page.tsx          # Homepage
├── components/           # React components
│   ├── admin/            # Admin components
│   ├── auth/             # Authentication components
│   ├── blog/             # Blog components
│   ├── chat/             # Chat components
│   ├── home/             # Homepage components
│   ├── icons/            # Icon components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and models
│   ├── actions/          # Server actions
│   ├── models/           # MongoDB models
│   └── server/           # Server-side utilities
├── public/               # Static assets
├── styles/               # Stylesheets
└── types/                # TypeScript type definitions
```

## Frontend Components

### Main Components
- **Navbar** - Site navigation with theme toggle and auth links
- **Hero** - Landing section with introduction and call-to-action
- **About** - Detailed information about you
- **Skills** - Technical skills with visual representation
- **Experience** - Work experience and education timeline
- **Featured Projects** - Highlighted projects with details
- **Services** - Services you offer with pricing
- **Latest Blog Posts** - Recent blog articles
- **Contact** - Contact form
- **Footer** - Site footer with links and social media

### UI Components
The project uses a comprehensive set of UI components from Shadcn UI, including:
- Buttons, Cards, Dialogs
- Forms, Inputs, Selectors
- Tables, Tabs
- Alerts, Badges, Tooltips
- Carousels, Accordions
- And many more

## API Documentation

### Authentication

#### Next Auth [...nextauth]
- **Endpoint**: `/api/auth/[...nextauth]`
- **Description**: Handles Next.js authentication routes

#### Register
- **Endpoint**: `/api/auth/register`
- **Method**: POST
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

### Projects

#### Get All Projects / Create Project
- **Endpoint**: `/api/projects`
- **Methods**: 
  - GET: Fetch all projects (Query param `featured=true` for featured projects)
  - POST: Create new project (Admin only)
- **POST Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "longDescription": "string",
    "image": "string",
    "screenshots": ["string"],
    "tags": ["string"],
    "features": ["string"],
    "demoUrl": "string",
    "githubUrl": "string",
    "featured": boolean
  }
  ```

#### Get/Update/Delete Project
- **Endpoint**: `/api/projects/[id]`
- **Methods**: 
  - GET: Fetch single project
  - PUT: Update project (Admin only)
  - DELETE: Remove project (Admin only)

### Blogs

- **Endpoint**: `/api/blogs`
- **Methods**: GET, POST
- **Single Blog**: `/api/blogs/[id]` (GET, PUT, DELETE)

### Skills

- **Endpoint**: `/api/skills`
- **Methods**: GET, POST
- **Single Skill**: `/api/skills/[id]` (GET, PUT, DELETE)

### Experiences

- **Endpoint**: `/api/experiences`
- **Methods**: GET, POST
- **Single Experience**: `/api/experiences/[id]` (GET, PUT, DELETE)

### Services

- **Endpoint**: `/api/services`
- **Methods**: GET, POST
- **Single Service**: `/api/services/[id]` (GET, PUT, DELETE)

### Contact

- **Endpoint**: `/api/contact`
- **Method**: POST
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "message": "string"
  }
  ```

### User Management

- **Endpoint**: `/api/users`
- **Methods**: GET, POST (Admin only)
- **Single User**: `/api/users/[id]` (GET, PUT, DELETE) (Admin only)

### Settings

- **Endpoint**: `/api/settings`
- **Methods**: GET, PUT (Admin only)

## Authentication

The portfolio uses NextAuth.js for authentication with the following providers:
- Google OAuth
- Email/Password

User roles include:
- **Admin** - Full access to the admin dashboard and all API endpoints
- **User** - Access to profile and public sections

## Admin Dashboard

The admin dashboard gives you full control over your portfolio content:

- **Projects** - Add, edit, delete projects with image uploads
- **Blogs** - Manage blog posts with rich text editor
- **Skills** - Organize skills by category
- **Experiences** - Track work history and education
- **Certifications** - Display earned certifications
- **Services** - Define services you offer
- **AI Config** - Configure the chat assistant
- **Messages** - View and respond to contact form submissions
- **Users** - Manage user accounts (Admin only)
- **Header** - Customize navigation and logo
- **Footer** - Customize footer sections and links
- **Settings** - Site-wide settings and preferences

## Chat Functionality

The portfolio includes an AI chat assistant that visitors can use to:
- Ask questions about your skills and experience
- Learn more about your projects
- Get quick answers about your services

Admins can:
- View all chat conversations
- Configure AI assistant behavior
- Customize responses and prompts

## Deployment

### Deploying on Vercel

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy

### Other Deployment Options

- **Railway** - Easy deployment with MongoDB integration
- **Netlify** - Simple deployment from Git
- **Docker** - Container-based deployment for custom hosting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created by [Your Name] | [Your Website](https://yourwebsite.com)