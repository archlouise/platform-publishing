import Link from "next/link";
import { cn } from "@/lib/utils";

type Kind = "person" | "company" | "project";

const BASE: Record<Kind, string> = {
  person: "/people",
  company: "/companies",
  project: "/projects",
};

export function entityHref(kind: Kind, slug: string) {
  return `${BASE[kind]}/${slug}`;
}

/**
 * The one way to link to a person, company, or project. Keeps link styling
 * consistent and makes every entity reference clickable.
 */
export function EntityLink({
  kind,
  slug,
  children,
  className,
  muted = false,
}: {
  kind: Kind;
  slug: string;
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={entityHref(kind, slug)}
      className={cn(
        "rounded-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50",
        muted ? "text-muted-foreground hover:text-foreground" : "text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
