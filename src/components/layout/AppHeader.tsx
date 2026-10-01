import Link from "next/link";
import { Suspense } from "react";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { SearchBox } from "./SearchBox";
import { Wordmark } from "./Wordmark";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <MobileNav />
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="AEC Network home"
        >
          <Wordmark />
        </Link>
        <div className="ml-4">
          <NavLinks />
        </div>
        <div className="ml-auto hidden w-72 md:block">
          <Suspense>
            <SearchBox />
          </Suspense>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-2 md:hidden">
        <Suspense>
          <SearchBox />
        </Suspense>
      </div>
    </header>
  );
}
