"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterDef {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

/**
 * Directory filters stored in the URL so results are shareable and
 * server-rendered. Each select writes its value to a search param.
 */
export function FilterBar({
  filters,
  resultCount,
  noun,
  nounPlural = `${noun}s`,
}: {
  filters: FilterDef[];
  resultCount: number;
  noun: string;
  nounPlural?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const active = filters.filter((f) => params.get(f.key));

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
        {filters.map((f) => (
          <label key={f.key} className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">
            {f.label}
            <select
              value={params.get(f.key) ?? ""}
              onChange={(e) => update(f.key, e.target.value)}
              className="h-11 w-full rounded-lg sm:w-auto sm:min-w-36 md:h-9 border border-input bg-background px-2.5 text-base md:text-sm font-normal text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <option value="">All</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        {active.length ? (
          <Button variant="ghost" size="sm" onClick={() => router.push(pathname, { scroll: false })}>
            <XIcon /> Clear filters
          </Button>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground" role="status">
        {resultCount} {resultCount === 1 ? noun : nounPlural}
        {active.length ? " match these filters" : ""}
      </p>
    </div>
  );
}
