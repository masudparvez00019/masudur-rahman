import { AdminPayments } from "@/components/admin/admin-payments";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Payments | Admin",
  description: "Manage course payments",
};

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.isAdmin !== true) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">
          Manage course payments and transactions
        </p>
      </div>

      <AdminPayments />
    </div>
  );
}
