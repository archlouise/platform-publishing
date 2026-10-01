"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const id = useId();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form role="search" onSubmit={onSubmit} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Search people, companies, and projects
      </label>
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search people, firms, projects"
        className="h-9 w-full rounded-lg border border-input bg-muted/60 pr-3 pl-8 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/40"
      />
    </form>
  );
}
