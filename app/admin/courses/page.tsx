import AdminCourses from "@/components/admin/admin-courses";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Courses | Admin",
  description: "Manage your courses",
};

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.isAdmin !== true) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">

      <AdminCourses />
    </div>
  );
}
