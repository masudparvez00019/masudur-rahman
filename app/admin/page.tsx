"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  FileText,
  Mail,
  FileCode,
  Settings,
  Briefcase,
  Code,
} from "lucide-react";

import AdminProjects from "@/components/admin/admin-projects";
import AdminBlogs from "@/components/admin/admin-blogs";
import AdminMessages from "@/components/admin/admin-messages";
import AdminSettings from "@/components/admin/admin-settings";
import AdminSkills from "@/components/admin/admin-skills";
import AdminExperiences from "@/components/admin/admin-experiences";
import AdminAbout from "@/components/admin/admin-about";
import ProtectedRoute from "@/components/auth/protected-route";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminUsers from "@/components/admin/admin-users";
import AdminAI from "@/components/admin/admin-ai";
import AdminConversations from "@/components/admin/admin-conversations";
import AdminServices from "@/components/admin/admin-services";
import AdminCertifications from "@/components/admin/admin-certifications";
import AdminHeader from "@/components/admin/admin-header";
import AdminFooter from "@/components/admin/admin-footer";
import AdminTutorials from "@/components/admin/admin-tutorials";
import AdminCourses from "@/components/admin/admin-courses";
import { AdminPayments } from "@/components/admin/admin-payments";
import { AdminEnrollments } from "@/components/admin/admin-enrollments";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [counts, setCounts] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
    users: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Fetch project count
        const projectsRes = await fetch("/api/projects");
        const projects = await projectsRes.json();

        // Fetch blog count
        const blogsRes = await fetch("/api/blogs");
        const blogs = await blogsRes.json();

        // Fetch message count
        const messagesRes = await fetch("/api/contact");
        const messages = await messagesRes.json();

        // Fetch user count
        const usersRes = await fetch("/api/users");
        const users = await usersRes.json();

        setCounts({
          projects: Array.isArray(projects) ? projects.length : 0,
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
          users: Array.isArray(users) ? users.length : 0,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }

    if (session?.user.isAdmin) {
      fetchCounts();
    }
  }, [session]);

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="bg-gradient-to-br from-background to-background/90 min-h-screen">
        <main className=" pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Projects
                  </CardTitle>
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts.projects}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Blog Posts
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts.blogs}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Messages
                  </CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts.messages}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{counts.users}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="header" className="w-full h-full  ">
              <TabsList className="mb-8 flex flex-wrap overflow-auto ">
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="footer">Footer</TabsTrigger>
                <TabsTrigger value="ai">AI Chat</TabsTrigger>
                <TabsTrigger value="conversations">Conversations</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>

              <TabsContent value="header">
                <AdminHeader />
              </TabsContent>
              <TabsContent value="about">
                <AdminAbout />
              </TabsContent>
              <TabsContent value="skills">
                <AdminSkills />
              </TabsContent>
              <TabsContent value="experience">
                <AdminExperiences />
              </TabsContent>
              <TabsContent value="services">
                <AdminServices />
              </TabsContent>
              <TabsContent value="certifications">
                <AdminCertifications />
              </TabsContent>
              <TabsContent value="tutorials">
                <AdminTutorials />
              </TabsContent>
              <TabsContent value="courses">
                <AdminCourses />
              </TabsContent>

              <TabsContent value="enrollments">
                <AdminEnrollments />
              </TabsContent>

              <TabsContent value="payments">
                <AdminPayments />
              </TabsContent>
              <TabsContent value="projects">
                <AdminProjects />
              </TabsContent>
              <TabsContent value="blogs">
                <AdminBlogs />
              </TabsContent>
              <TabsContent value="messages">
                <AdminMessages />
              </TabsContent>
              <TabsContent value="footer">
                <AdminFooter />
              </TabsContent>
              <TabsContent value="ai">
                <AdminAI />
              </TabsContent>
              <TabsContent value="conversations">
                <AdminConversations />
              </TabsContent>
              <TabsContent value="settings">
                <AdminSettings />
              </TabsContent>
              <TabsContent value="users">
                <AdminUsers />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// import { Suspense } from "react";
// import Link from "next/link";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth-options";
// import { redirect } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import {
//   Users,
//   MessageSquare,
//   FileText,
//   Settings,
//   BookOpen,
//   GraduationCap,
//   CreditCard,
//   BarChart,
//   Layers,
//   PlusCircle,
// } from "lucide-react";
// import { getCourseStatistics } from "@/lib/server/courses";

// export default async function AdminPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.isAdmin !== true) {
//     redirect("/login");
//   }

//   // Fetch course statistics
//   const courseStats = await getCourseStatistics();

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <p className="text-muted-foreground">
//           Manage your portfolio content and settings
//         </p>
//       </div>

//       <Tabs defaultValue="overview">
//         <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="content">Content</TabsTrigger>
//           <TabsTrigger value="courses">Courses</TabsTrigger>
//           <TabsTrigger value="settings">Settings</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Courses
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {courseStats.totalCourses}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   {courseStats.publishedCourses} published,{" "}
//                   {courseStats.totalCourses - courseStats.publishedCourses}{" "}
//                   drafts
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Enrollments
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {courseStats.totalEnrollments}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   {courseStats.totalCompletions} completed courses
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Revenue
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   $
//                   {courseStats.totalRevenue
//                     ? courseStats.totalRevenue.toFixed(2)
//                     : "0.00"}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   From course sales
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Messages
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">0</div>
//                 <p className="text-xs text-muted-foreground">
//                   0 unread messages
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             <Card className="lg:col-span-4">
//               <CardHeader>
//                 <CardTitle>Recent Enrollments</CardTitle>
//                 <CardDescription>
//                   Recent course enrollments across your platform
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
//                   <div className="text-center text-muted-foreground">
//                     <p>Enrollment chart will be displayed here</p>
//                   </div>
//                 </Suspense>
//               </CardContent>
//             </Card>
//             <Card className="lg:col-span-3">
//               <CardHeader>
//                 <CardTitle>Popular Courses</CardTitle>
//                 <CardDescription>Your most enrolled courses</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
//                   <div className="text-center text-muted-foreground">
//                     <p>Popular courses will be displayed here</p>
//                   </div>
//                 </Suspense>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="content" className="space-y-6">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <FileText className="mr-2 h-5 w-5" />
//                   Blog Posts
//                 </CardTitle>
//                 <CardDescription>Manage your blog posts</CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">0</p>
//                   <p className="text-xs text-muted-foreground">Total posts</p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/admin/blogs">Manage</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <FileText className="mr-2 h-5 w-5" />
//                   Projects
//                 </CardTitle>
//                 <CardDescription>
//                   Manage your portfolio projects
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">0</p>
//                   <p className="text-xs text-muted-foreground">
//                     Total projects
//                   </p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/admin/projects">Manage</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <MessageSquare className="mr-2 h-5 w-5" />
//                   Messages
//                 </CardTitle>
//                 <CardDescription>Manage contact form messages</CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">0</p>
//                   <p className="text-xs text-muted-foreground">
//                     Total messages
//                   </p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/admin/messages">Manage</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Users className="mr-2 h-5 w-5" />
//                   Users
//                 </CardTitle>
//                 <CardDescription>Manage user accounts</CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">0</p>
//                   <p className="text-xs text-muted-foreground">Total users</p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/admin/users">Manage</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="courses" className="space-y-6">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <BookOpen className="mr-2 h-5 w-5" />
//                   Courses
//                 </CardTitle>
//                 <CardDescription>Manage your courses</CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">
//                     {courseStats.totalCourses}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {courseStats.publishedCourses} published
//                   </p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/admin/courses">Manage</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Layers className="mr-2 h-5 w-5" />
//                   Categories
//                 </CardTitle>
//                 <CardDescription>Manage course categories</CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">0</p>
//                   <p className="text-xs text-muted-foreground">
//                     Total categories
//                   </p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/admin/courses/categories">Manage</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <GraduationCap className="mr-2 h-5 w-5" />
//                   Enrollments
//                 </CardTitle>
//                 <CardDescription>Manage course enrollments</CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">
//                     {courseStats.totalEnrollments}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {courseStats.totalCompletions} completed
//                   </p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/admin/courses/enrollments">Manage</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <CreditCard className="mr-2 h-5 w-5" />
//                   Payments
//                 </CardTitle>
//                 <CardDescription>Manage course payments</CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">
//                     $
//                     {courseStats.totalRevenue
//                       ? courseStats.totalRevenue.toFixed(2)
//                       : "0.00"}
//                   </p>
//                   <p className="text-xs text-muted-foreground">Total revenue</p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/admin/courses/payments">Manage</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <BarChart className="mr-2 h-5 w-5" />
//                   Analytics
//                 </CardTitle>
//                 <CardDescription>Course performance analytics</CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">-</p>
//                   <p className="text-xs text-muted-foreground">View reports</p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/admin/courses/analytics">View</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <PlusCircle className="mr-2 h-5 w-5" />
//                   Create Course
//                 </CardTitle>
//                 <CardDescription>Add a new course</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button className="w-full" asChild>
//                   <Link href="/admin/courses/new">Create New Course</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="settings" className="space-y-6">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Settings className="mr-2 h-5 w-5" />
//                   General Settings
//                 </CardTitle>
//                 <CardDescription>Manage site settings</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button asChild>
//                   <Link href="/admin/settings">Manage Settings</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
