"use client";

import { usePathname } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBox, SearchBoxFallback } from "./SearchBox";

/**
 * Phone search: an icon button that expands into a full-width field across the
 * header row. Keyed by pathname so it resets on every navigation and opens by
 * default on the search page, without any effect-driven state.
 */
export function HeaderSearch() {
  const pathname = usePathname();
  return <HeaderSearchInner key={pathname} initiallyOpen={pathname === "/search"} />;
}

function HeaderSearchInner({ initiallyOpen }: { initiallyOpen: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(initiallyOpen);

  // Hand focus back to the toggle after the field closes, so keyboard and
  // screen-reader users are not dropped onto the body.
  useEffect(() => {
    if (!open && wasOpen.current) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <div className="md:hidden">
      {open ? (
        // `data-search-open` lets the header hide the controls underneath (see AppHeader).
        <div
          data-search-open
          className="absolute inset-x-0 top-0 z-10 flex h-14 items-center gap-1 bg-background px-4"
        >
          <Suspense fallback={<SearchBoxFallback className="flex-1" />}>
            <SearchBox className="flex-1" autoFocus={!initiallyOpen} onClose={() => setOpen(false)} />
          </Suspense>
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label="Close search"
            onClick={() => setOpen(false)}
          >
            <XIcon className="size-5" />
          </Button>
        </div>
      ) : (
        <Button
          ref={toggleRef}
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label="Search"
          onClick={() => setOpen(true)}
        >
          <SearchIcon className="size-5" />
        </Button>
      )}
    </div>
  );
}
