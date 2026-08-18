import type React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BookOpen, CreditCard, BarChart, Award, User } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="container py-10 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your courses and track your progress
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex overflow-auto">
          <TabsList className="h-auto">
            <Link href="/dashboard" passHref legacyBehavior>
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
            </Link>
            <Link href="/dashboard/courses" passHref legacyBehavior>
              <TabsTrigger
                value="courses"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                My Courses
              </TabsTrigger>
            </Link>
            <Link href="/dashboard/certificates" passHref legacyBehavior>
              <TabsTrigger
                value="certificates"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Award className="mr-2 h-4 w-4" />
                Certificates
              </TabsTrigger>
            </Link>
            <Link href="/dashboard/payments" passHref legacyBehavior>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Payments
              </TabsTrigger>
            </Link>
            <Link href="/profile" passHref legacyBehavior>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
            </Link>
          </TabsList>
        </div>

        <Separator />

        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </Tabs>
    </div>
  );
}

// import type { ReactNode } from "react";
// import Link from "next/link";
// import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth-options";
// import { BookOpen, CreditCard, GraduationCap, Home, User } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export default async function DashboardLayout({
//   children,
// }: DashboardLayoutProps) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     redirect("/login?callbackUrl=/dashboard");
//   }

//   const navItems = [
//     {
//       href: "/dashboard",
//       label: "Dashboard",
//       icon: <Home className="h-4 w-4 mr-2" />,
//     },
//     {
//       href: "/dashboard/courses",
//       label: "My Courses",
//       icon: <BookOpen className="h-4 w-4 mr-2" />,
//     },
//     {
//       href: "/dashboard/certificates",
//       label: "Certificates",
//       icon: <GraduationCap className="h-4 w-4 mr-2" />,
//     },
//     {
//       href: "/dashboard/payments",
//       label: "Payment History",
//       icon: <CreditCard className="h-4 w-4 mr-2" />,
//     },
//     {
//       href: "/profile",
//       label: "Profile",
//       icon: <User className="h-4 w-4 mr-2" />,
//     },
//   ];

//   return (
//     <div className="flex min-h-screen flex-col">
//       <div className="flex flex-1">
//         <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
//           <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
//             <Link href="/" className="flex items-center gap-2 font-semibold">
//               <span className="text-lg">Learning Dashboard</span>
//             </Link>
//           </div>
//           <nav className="grid gap-2 p-4 text-sm font-medium">
//             {navItems.map((item) => (
//               <Button
//                 key={item.href}
//                 asChild
//                 variant="ghost"
//                 className="justify-start"
//               >
//                 <Link href={item.href}>
//                   {item.icon}
//                   {item.label}
//                 </Link>
//               </Button>
//             ))}
//           </nav>
//         </aside>
//         <main className="flex-1">{children}</main>
//       </div>
//     </div>
//   );
// }
