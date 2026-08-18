# API Documentation

## Authentication

### Next Auth [...nextauth]
- **Endpoint**: `/api/auth/[...nextauth]`
- **Description**: Handles Next.js authentication routes (signin, signout, session)
- **Methods**: Various (handled by NextAuth)

### Register
- **Endpoint**: `/api/auth/register`
- **Method**: POST
- **Description**: Register new user
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

## Projects

### Get All Projects / Create Project
- **Endpoint**: `/api/projects`
- **Methods**: 
  - GET: Fetch all projects
  - POST: Create new project
- **POST Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "image": "string",
    "github": "string",
    "demo": "string",
    "technologies": "string[]"
  }
  ```

### Get/Update/Delete Project
- **Endpoint**: `/api/projects/[id]`
- **Methods**: 
  - GET: Fetch single project
  - PATCH: Update project
  - DELETE: Remove project

## Blogs

### Get All Blogs / Create Blog
- **Endpoint**: `/api/blogs`
- **Methods**:
  - GET: Fetch all blogs
  - POST: Create new blog

### Blog Operations
- **Endpoint**: `/api/blogs/[id]`
- **Methods**:
  - GET: Fetch single blog
  - PATCH: Update blog
  - DELETE: Remove blog

### Blog Comments
- **Endpoint**: `/api/blogs/[id]/comments`
- **Methods**:
  - GET: Get blog comments
  - POST: Add comment
  - DELETE: Remove comment

## Skills

### Get All Skills / Create Skill
- **Endpoint**: `/api/skills`
- **Methods**:
  - GET: Fetch all skills
  - POST: Create new skill

### Skill Operations
- **Endpoint**: `/api/skills/[id]`
- **Methods**:
  - GET: Fetch single skill
  - PATCH: Update skill
  - DELETE: Remove skill

## Experiences

### Get All Experiences / Create Experience
- **Endpoint**: `/api/experiences`
- **Methods**:
  - GET: Fetch all experiences
  - POST: Create new experience

### Experience Operations
- **Endpoint**: `/api/experiences/[id]`
- **Methods**:
  - GET: Fetch single experience
  - PATCH: Update experience
  - DELETE: Remove experience

## Contact

### Submit Contact Form
- **Endpoint**: `/api/contact`
- **Methods**:
  - GET: Get all messages
  - POST: Submit contact form
- **POST Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "message": "string"
  }
  ```

### Contact Message Operations
- **Endpoint**: `/api/contact/[id]`
- **Methods**:
  - GET: Get single message
  - DELETE: Delete message

## Settings

### Site Settings
- **Endpoint**: `/api/settings`
- **Methods**:
  - GET: Get site settings
  - PATCH: Update site settings
- **PATCH Body**:
  ```json
  {
    "siteTitle": "string",
    "siteDescription": "string",
    "siteKeywords": "string",
    "siteUrl": "string"
  }
  ```
