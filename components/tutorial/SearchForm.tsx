"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export default function SearchForm({ defaultQuery = "" }) {
  const [query, setQuery] = useState(defaultQuery);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tutorial/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleReset = () => {
    setQuery("");
    router.push("/tutorial/search");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-2xl"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for topics, concepts, or keywords..."
          className="pl-10 pr-10 py-6 text-base"
          autoComplete="off"
          autoFocus
        />
        {query && (
          <button
            type="reset"
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={handleReset}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <Button type="submit" size="lg" className="px-8">
        Search
      </Button>
    </form>
  );
}
