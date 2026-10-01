import Link from "next/link";
import { Suspense } from "react";
import { PersonAvatar } from "@/components/entities/Avatars";
import { repo } from "@/lib/data";
import { HeaderSearch } from "./HeaderSearch";
import { NavLinks } from "./NavLinks";
import { SearchBox, SearchBoxFallback } from "./SearchBox";
import { Wordmark } from "./Wordmark";

export async function AppHeader() {
  const me = await repo.getDemoProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 pointer-coarse:min-h-11"
          aria-label="AEC Network home"
        >
          <Wordmark />
        </Link>
        <div className="ml-4 hidden lg:block">
          <NavLinks />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="hidden w-72 md:block">
            <Suspense fallback={<SearchBoxFallback />}>
              <SearchBox />
            </Suspense>
          </div>
          <HeaderSearch />
          <Link
            href="/profile"
            aria-label="My profile"
            className="flex size-11 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
          >
            <PersonAvatar profile={me.profile} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
