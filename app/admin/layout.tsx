import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Import client components
import AdminSidebar from "@/components/admin/admin-sidebar";
import MobileHeader from "@/components/admin/mobile-header";
import AdminBreadcrumbs from "@/components/admin/admin-breadcrumbs";
import ClientComponentWrapper from "@/components/admin/client-wrapper";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.isAdmin !== true) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-background/90">
      {" "}
      {/* Admin Sidebar - desktop only */}
      <div className="hidden md:block">
        <ClientComponentWrapper>
          <AdminSidebar />
        </ClientComponentWrapper>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with responsive menu */}
        <div className="md:hidden">
          <ClientComponentWrapper>
            <MobileHeader />
          </ClientComponentWrapper>
        </div>{" "}
        {/* Main content area */}
        <main className="sticky flex-1 overflow-auto p-6 container mx-auto">
          <ClientComponentWrapper>
            <AdminBreadcrumbs />
          </ClientComponentWrapper>
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
