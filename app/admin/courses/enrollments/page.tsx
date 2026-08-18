import { AdminEnrollments } from "@/components/admin/admin-enrollments"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Manage Enrollments | Admin",
  description: "Manage course enrollments",
}

export default async function AdminEnrollmentsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.isAdmin !== true) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enrollments</h1>
        <p className="text-muted-foreground">Manage student enrollments across all courses</p>
      </div>

      <AdminEnrollments />
    </div>
  )
}
