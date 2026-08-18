"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Settings,
  Users,
  FileText,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Code,
  CreditCard,
  Package,
  Award,
  Brain,
  Layers,
  Bell,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import ThemeSwitchButton from "@/components/theme-switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session } = useSession();

  // State to track which menu sections are open
  const [openGroups, setOpenGroups] = useState({
    dashboard: true,
    content: false,
    ai: false,
    commercial: false,
    communications: false,
    portfolio: false,
    system: false,
  });

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // Function to check if a link is active
  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin" && !activeTab) {
      return true;
    }
    if (path.includes("?tab=") && pathname === "/admin") {
      const tabName = path.split("?tab=")[1];
      return activeTab === tabName;
    }
    if (pathname.startsWith(path) && path !== "/admin") {
      return true;
    }
    return false;
  };

  // Menu groups configuration
  const menuGroups = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      items: [
        {
          href: "/admin",
          label: "Overview",
          icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/analytics",
          label: "Analytics",
          icon: <Layers className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "content",
      title: "Content",
      icon: <FileText className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=tutorials",
          label: "Tutorials",
          icon: <BookOpen className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/courses",
          label: "Courses",
          icon: <GraduationCap className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/courses/categories",
          label: "Categories",
          icon: <GraduationCap className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/courses/enrollments",
          label: "Enrollments",
          icon: <GraduationCap className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/courses/payments",
          label: "Payments",
          icon: <GraduationCap className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=blogs",
          label: "Blog",
          icon: <FileText className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=projects",
          label: "Projects",
          icon: <Code className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "ai",
      title: "AI Features",
      icon: <Brain className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=ai",
          label: "AI Chat",
          icon: <Brain className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "commercial",
      title: "Commercial",
      icon: <CreditCard className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=enrollments",
          label: "Enrollments",
          icon: <Users className="mr-2 h-4 w-4" />,
          badge: { text: "New", variant: "outline" },
        },
        {
          href: "/admin?tab=payments",
          label: "Payments",
          icon: <CreditCard className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "communications",
      title: "Communications",
      icon: <MessageSquare className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=messages",
          label: "Messages",
          icon: <MessageSquare className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "portfolio",
      title: "Portfolio",
      icon: <Package className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=header",
          label: "Header",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=about",
          label: "About Me",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=skills",
          label: "Skills",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=experience",
          label: "Experience",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=services",
          label: "Services",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=certifications",
          label: "Certifications",
          icon: <Award className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=footer",
          label: "Footer",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "system",
      title: "System",
      icon: <Settings className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=users",
          label: "Users",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=settings",
          label: "Settings",
          icon: <Settings className="mr-2 h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 z-30 flex h-16 items-center bg-background/95 shadow-sm backdrop-blur-sm w-full border-b px-0">
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <DropdownMenuItem className="py-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">New Enrollment</span>
                      <span className="text-sm text-muted-foreground">
                        Arif Islam enrolled in Web Development Course.
                      </span>
                      <span className="text-xs text-muted-foreground">
                        10 minutes ago
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">New Message</span>
                      <span className="text-sm text-muted-foreground">
                        You have 3 new messages.
                      </span>
                      <span className="text-xs text-muted-foreground">
                        1 hour ago
                      </span>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-center text-primary">
                  View All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher */}
            <ThemeSwitchButton />

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} alt="User" />
                    <AvatarFallback>
                      <UserCircle className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Sidebar with collapsible/expandable sections */}
      <aside
        className={cn(
          " sticky top-16 left-0 z-20 h-[calc(100vh-4rem)] w-64 border-r bg-card/50 backdrop-blur-sm shadow-sm transition-transform duration-300",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <Accordion type="multiple" className="w-full">
              {menuGroups.map((group) => (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="border-b-0"
                >
                  <AccordionTrigger className="py-2 px-3 hover:bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <span className="mr-2">{group.icon}</span>
                      <span>{group.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-5 pt-1 pb-2 text-sm">
                    {group.items.map((item) => (
                      <Button
                        key={item.href}
                        variant={isActive(item.href) ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start mb-1"
                        asChild
                      >
                        <Link href={item.href} className="flex items-center">
                          {item.icon}
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant={item.badge.variant}
                              className="ml-1"
                            >
                              {item.badge.text}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>

          <div className="border-t p-3">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                {sidebarOpen && <span>Return to Home</span>}
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
