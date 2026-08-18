"use client";

import { useRouter } from "next/navigation";

export function MobileSortDropdown({ query, filter, sort, difficulty }) {
  const router = useRouter();

  const handleChange = (e) => {
    const newSort = e.target.value;
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (filter && filter !== "all") params.set("filter", filter);
    if (newSort && newSort !== "relevance") params.set("sort", newSort);
    if (difficulty && difficulty !== "all")
      params.set("difficulty", difficulty);

    router.push(`/tutorial/search?${params.toString()}`);
  };

  return (
    <select
      className="text-sm bg-background border rounded px-2 py-1"
      onChange={handleChange}
      value={sort}
    >
      <option value="relevance">Relevance</option>
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="popularity">Popular</option>
    </select>
  );
}
