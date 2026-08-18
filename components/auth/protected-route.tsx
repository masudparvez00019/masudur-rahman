"use client";

import type React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
  fallback,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  // Always log session info in both dev and production to help debug
  useEffect(() => {
    console.log("ProtectedRoute session status:", status);
    console.log(
      "ProtectedRoute session data:",
      session
        ? {
            hasSession: true,
            userId: session.user?.id,
            isAdmin: session.user?.isAdmin,
          }
        : "No session"
    );

    // Add a small delay to allow NextAuth to fully initialize the session
    const timer = setTimeout(() => {
      // Still loading, keep waiting
      if (status === "loading") return;

      if (!session) {
        if (fallback) {
          setUnauthorized(true);
          setIsChecking(false);
        } else {
          console.log("Redirecting to login (no session)");
          router.push(
            `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
          );
        }
      } else if (adminOnly && session.user?.isAdmin !== true) {
        if (fallback) {
          setUnauthorized(true);
          setIsChecking(false);
        } else {
          console.log("Redirecting to home (not admin)");
          router.push("/");
        }
      } else {
        console.log("Access granted");
        setIsChecking(false);
      }
    }, 1000); // Increase delay to ensure session is properly initialized

    return () => clearTimeout(timer);
  }, [session, status, router, adminOnly, fallback]);

  // Show loading state during both NextAuth loading and our additional check
  if (status === "loading" || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  // Show custom unauthorized component if authorized and fallback is provided
  if (unauthorized && fallback) {
    return <>{fallback}</>;
  }

  // Show default unauthorized page if unauthorized and no fallback
  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6 text-center">
          {adminOnly
            ? "You need administrator privileges to access this page."
            : "You need to be logged in to access this page."}
        </p>
        <Button asChild>
          <Link href={adminOnly ? "/" : "/login"}>
            {adminOnly ? "Go to Homepage" : "Log In"}
          </Link>
        </Button>
      </div>
    );
  }

  // Don't render children if unauthorized (should not reach here, but just in case)
  if (!session || (adminOnly && !session.user.isAdmin)) {
    return null;
  }

  return <>{children}</>;
}

// In your login or auth handlers
// console.log("Auth request received:", {
//   headers: Object.fromEntries(
//     Object.entries(req.headers).filter(([key]) =>
//       ["cookie", "authorization", "user-agent"].includes(key.toLowerCase())
//     )
//   ),
//   method: req.method,
//   url: req.url,
// });
