"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface LayoutManagerProps {
  header: any;
  footer: any;
  children: React.ReactNode;
}

export default function LayoutManager({
  header,
  footer,
  children,
}: LayoutManagerProps) {
  const pathname = usePathname();
  const isAdminOrDashboard =
    pathname.startsWith("/admin") ||
    // pathname.startsWith("/dashboard") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/tutorial");

  return (
    <>
      {!isAdminOrDashboard && (
        <Navbar navItems={header?.navItems} logoText={header?.logoText} />
      )}

      {children}

      {!isAdminOrDashboard && <Footer footer={footer} />}
    </>
  );
}
