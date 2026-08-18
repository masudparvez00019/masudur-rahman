
import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { getUserEnrollments } from "@/lib/server/courses";
import { Certificate } from "@/components/dashboard/certificate";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";

export const metadata = {
  title: "My Certificates | Dashboard",
  description: "View and download your course completion certificates",
};

export default async function DashboardCertificatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/certificates");
  }

  const enrollments = await getUserEnrollments(session.user.id);
  const completedEnrollments = enrollments.filter(
    (enrollment) => enrollment.completedAt
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Certificates</h1>

      <div className="mb-6">
        <p className="text-muted-foreground">
          Certificates are awarded upon successful completion of courses. You
          can view and download your certificates here.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Suspense
          fallback={Array(2)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
            ))}
        >
          {completedEnrollments.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Award className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No certificates yet</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Complete courses to earn certificates that showcase your
                achievements.
              </p>
              <a
                href="/dashboard/courses"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                View My Courses
              </a>
            </div>
          ) : (
            completedEnrollments.map((enrollment) => {
              const course = enrollment.course as any;
              return (
                <Certificate
                  key={enrollment._id.toString()}
                  userName={session.user.name || "Student"}
                  courseName={course.title}
                  completionDate={enrollment.completedAt!}
                  certificateId={enrollment._id.toString()}
                />
              );
            })
          )}
        </Suspense>
      </div>
    </div>
  );
}
