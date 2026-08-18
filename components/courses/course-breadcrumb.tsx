import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CourseBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function CourseBreadcrumb({ items }: CourseBreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li className="flex items-center">
          <Link
            href="/courses"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Home className="mr-1 h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {item.href ? (
              <Link
                href={item.href}
                className="ml-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-2 text-sm font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
