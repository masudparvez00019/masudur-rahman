"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tutorial/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        type="search"
        placeholder="Search tutorials..."
        className="w-full rounded-md bg-background pl-8 md:w-[200px] lg:w-[300px] border-border focus-visible:ring-primary transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
    </form>
  );
}
