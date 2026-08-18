import { AdminCourseCategories } from "@/components/admin/admin-course-categories";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Course Categories | Admin",
  description: "Manage course categories",
};

export default async function AdminCourseCategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.isAdmin !== true) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Categories</h1>
        <p className="text-muted-foreground">
          Manage categories for organizing your courses
        </p>
      </div>

      <AdminCourseCategories />
    </div>
  );
}
