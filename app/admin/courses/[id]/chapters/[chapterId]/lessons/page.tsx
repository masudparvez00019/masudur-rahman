import { AdminLessons } from "@/components/admin/admin-lessons";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { getCourseById, getChapterById } from "@/lib/server/courses";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface AdminChapterLessonsPageProps {
  params: {
    id: string;
    chapterId: string;
  };
}

export default async function AdminChapterLessonsPage({
  params,
}: AdminChapterLessonsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.isAdmin !== true) {
    redirect("/login");
  }
const { id, chapterId } = await params;
  const course = await getCourseById(id);
  const chapter = await getChapterById(chapterId);

  if (!course || !chapter) {
    redirect("/admin/courses");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href={`/admin/courses/${id}/chapters`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Chapters
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{chapter.title}</h1>
          <p className="text-muted-foreground">
            Manage lessons for this chapter in{" "}
            <span className="font-medium">{course.title}</span>
          </p>
        </div>
      </div>

      <AdminLessons courseId={id} chapterId={chapterId} />
    </div>
  );
}
