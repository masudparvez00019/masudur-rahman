"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CourseSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("search", searchQuery)
      router.push(`/courses/search?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        type="text"
        placeholder="Search for courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-12"
      />
      <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full px-3">
        <Search className="h-5 w-5" />
      </Button>
    </form>
  )
}
