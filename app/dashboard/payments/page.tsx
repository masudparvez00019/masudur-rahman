// import type { Metadata } from "next";
// import { PaymentHistory } from "@/components/dashboard/payment-history";

// export const metadata: Metadata = {
//   title: "Payment History",
//   description: "View your payment history and receipts",
// };

// export default function PaymentsPage() {
//   return (
//     <div className="container py-10">
//       <h1 className="mb-6 text-3xl font-bold">Payment History</h1>
//       <PaymentHistory />
//     </div>
//   );
// }

import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { PaymentHistory } from "@/components/dashboard/payment-history";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Payment History | Dashboard",
  description: "View your course payment history",
};

export default async function DashboardPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/payments");
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Payment History</h1>

      <div className="mb-6">
        <p className="text-muted-foreground">
          View your course payment history and transaction details. All payments
          are securely processed.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
        <PaymentHistory userId={session.user.id} />
      </Suspense>
    </div>
  );
}
