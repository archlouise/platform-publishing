"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/** 16px text on phones so iOS does not zoom on focus; the desktop size from md up. */
const boxClass =
  "h-11 w-full rounded-lg border border-input bg-muted/60 pr-3 pl-8 text-base outline-none transition-colors md:h-9 md:text-sm";

const iconClass =
  "pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground";

export function SearchBox({
  className,
  autoFocus = false,
  onClose,
}: {
  className?: string;
  autoFocus?: boolean;
  /** Called on Escape, so a collapsible host can close itself. */
  onClose?: () => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const id = useId();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape" && onClose) {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <form role="search" onSubmit={onSubmit} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Search people, companies, and projects
      </label>
      <SearchIcon aria-hidden className={iconClass} />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        placeholder="Search people, firms, projects"
        className={cn(
          boxClass,
          "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/40",
        )}
      />
    </form>
  );
}

/** Same footprint as the search box, shown while the real box waits on the URL's search params. */
export function SearchBoxFallback({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      <SearchIcon className={iconClass} />
      <div className={boxClass} />
    </div>
  );
}
