"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HomeIcon, ChevronRight } from "lucide-react";

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  // Generate breadcrumb items
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);

    // Always include Home
    const breadcrumbs = [{ label: "Admin", href: "/admin" }];

    if (parts.length === 1 && parts[0] === "admin" && activeTab) {
      // Handle tab routes like /admin?tab=tutorials
      breadcrumbs.push({
        label:
          activeTab.charAt(0).toUpperCase() +
          activeTab.slice(1).replace("-", " "),
        href: `/admin?tab=${activeTab}`,
      });
    } else if (parts.length > 1) {
      // Handle normal routes like /admin/courses
      let currentPath = "";

      for (let i = 1; i < parts.length; i++) {
        currentPath += `/${parts[i]}`;
        breadcrumbs.push({
          label: parts[i].charAt(0).toUpperCase() + parts[i].slice(1),
          href: `/admin${currentPath}`,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 1) {
    return null; // Don't show breadcrumbs on the main admin page
  }

  return (
    <nav className="flex mb-4 text-sm mt-16" aria-label="Breadcrumbs">
      <ol className="flex items-center space-x-1">
        <li>
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-foreground flex items-center"
          >
            <HomeIcon className="h-4 w-4" />
            <span className="sr-only">Admin</span>
          </Link>
        </li>

        {breadcrumbs.slice(1).map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            {index === breadcrumbs.length - 2 ? (
              <span className="font-medium">{breadcrumb.label}</span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
