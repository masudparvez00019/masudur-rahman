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
  Menu,
  X,
  Bell,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ThemeSwitchButton from "@/components/theme-switch";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

export default function MobileHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");
  const { data: session } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Function to check if a link is active
  const isActive = (path: string) => {
    // Direct path match for the admin home
    if (path === "/admin" && pathname === "/admin" && !activeTab) {
      return true;
    }

    // For tab navigation with query parameters
    if (path.includes("?tab=") && pathname === "/admin") {
      const tabName = path.split("?tab=")[1];
      return activeTab === tabName;
    }

    // For direct paths (subpages)
    if (pathname.startsWith(path) && path !== "/admin") {
      return true;
    }

    return false;
  };

  // Menu groups configuration - same as in admin-sidebar
  const menuGroups = [
    {
      id: "dashboard",
      title: "ড্যাশবোর্ড",
      icon: <LayoutDashboard className="h-4 w-4" />,
      items: [
        {
          href: "/admin",
          label: "ওভারভিউ",
          icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/analytics",
          label: "অ্যানালিটিক্স",
          icon: <Layers className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "content",
      title: "কনটেন্ট",
      icon: <FileText className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=tutorials",
          label: "টিউটোরিয়ালস",
          icon: <BookOpen className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/courses",
          label: "কোর্স",
          icon: <GraduationCap className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=blogs",
          label: "ব্লগ",
          icon: <FileText className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=projects",
          label: "প্রজেক্ট",
          icon: <Code className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "ai",
      title: "এআই ফিচার",
      icon: <Brain className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=ai",
          label: "এআই চ্যাট",
          icon: <Brain className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "commercial",
      title: "কমার্শিয়াল",
      icon: <CreditCard className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=enrollments",
          label: "এনরোলমেন্টস",
          icon: <Users className="mr-2 h-4 w-4" />,
          badge: { text: "New", variant: "outline" },
        },
        {
          href: "/admin?tab=payments",
          label: "পেমেন্টস",
          icon: <CreditCard className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "communications",
      title: "যোগাযোগ",
      icon: <MessageSquare className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=messages",
          label: "মেসেজ",
          icon: <MessageSquare className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "portfolio",
      title: "পোর্টফোলিও",
      icon: <Package className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=header",
          label: "হেডার",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=about",
          label: "আমার সম্পর্কে",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=skills",
          label: "দক্ষতা",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=experience",
          label: "অভিজ্ঞতা",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=services",
          label: "সেবা",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=certifications",
          label: "সার্টিফিকেশন",
          icon: <Award className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=footer",
          label: "ফুটার",
          icon: <Package className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      id: "system",
      title: "সিস্টেম",
      icon: <Settings className="h-4 w-4" />,
      items: [
        {
          href: "/admin?tab=users",
          label: "ব্যবহারকারী",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin?tab=settings",
          label: "সেটিংস",
          icon: <Settings className="mr-2 h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-background/95 shadow-sm backdrop-blur-sm w-full border-b">
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">অ্যাডমিন প্যানেল</span>
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
              <DropdownMenuLabel>নোটিফিকেশন</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="py-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">নতুন এনরোলমেন্ট</span>
                    <span className="text-sm text-muted-foreground">
                      আরিফ ইসলাম ওয়েব ডেভেলপমেন্ট কোর্সে এনরোল করেছেন।
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ১০ মিনিট আগে
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">নতুন মেসেজ</span>
                    <span className="text-sm text-muted-foreground">
                      আপনি ৩টি নতুন মেসেজ পেয়েছেন।
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ১ ঘন্টা আগে
                    </span>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-center text-primary">
                সব দেখুন
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <ThemeSwitchButton />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || ""} alt="User" />
                  <AvatarFallback>
                    <UserCircle className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>প্রোফাইল</DropdownMenuItem>
              <DropdownMenuItem>সেটিংস</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>লগ আউট</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Drawer */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="p-6 flex items-center justify-between border-b">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                  অ্যাডমিন প্যানেল
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSheetOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

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
                      <AccordionContent className="pl-5 pt-1 pb-2">
                        {group.items.map((item) => (
                          <Button
                            key={item.href}
                            variant={
                              isActive(item.href) ? "secondary" : "ghost"
                            }
                            size="sm"
                            className="w-full justify-start mb-1"
                            asChild
                            onClick={() => setSheetOpen(false)}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center"
                            >
                              {item.icon}
                              <span className="flex-1 truncate">
                                {item.label}
                              </span>
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

                <div className="mt-6 border-t pt-4 px-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    onClick={() => setSheetOpen(false)}
                  >
                    <Link href="/" className="flex items-center">
                      <Home className="mr-3 h-4 w-4" />
                      হোম পেজে ফিরুন
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
