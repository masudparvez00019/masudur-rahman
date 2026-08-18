import type { Metadata } from "next";
import AdminAnalytics from "@/components/admin/admin-analytics";
import ProtectedRoute from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Admin",
  description: "View analytics and statistics for your portfolio",
};

export default function AnalyticsPage() {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminAnalytics />
    </ProtectedRoute>
  );
}

// ### How to Use

// 1. **Track Events**: Use the `Analytics` utility in client components:

// import { Analytics } from "@/lib/analytics-client"

// // Track a course view
// Analytics.trackCourseView(courseId)

// // Track a payment
// Analytics.trackPayment(courseId, amount)

// 2. **View Analytics**: Access the analytics dashboard at `/admin/analytics`