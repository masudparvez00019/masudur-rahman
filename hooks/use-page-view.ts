"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Analytics } from "@/lib/analytics-client"

export function usePageView() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      Analytics.trackPageView(pathname)
    }
  }, [pathname])
}
