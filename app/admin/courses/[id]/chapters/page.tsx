import { AdminChapters } from "@/components/admin/admin-chapters";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { getCourseById } from "@/lib/server/courses";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface AdminCourseChaptersPageProps {
  params: {
    id: string;
  };
}

export default async function AdminCourseChaptersPage({
  params,
}: AdminCourseChaptersPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.isAdmin !== true) {
    redirect("/login");
  }

  const { id } = await params;

  const course = await getCourseById(id);

  if (!course) {
    redirect("/admin/courses");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/admin/courses">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">
            Manage chapters and lessons for this course
          </p>
        </div>
      </div>

      <AdminChapters courseId={id} />
    </div>
  );
}
