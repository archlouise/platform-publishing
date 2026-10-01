import Link from "next/link";
import { CompanyCard } from "@/components/entities/CompanyCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { PersonCard } from "@/components/entities/PersonCard";
import { ProjectCard } from "@/components/entities/ProjectCard";
import type { SearchResults as Results } from "@/lib/types";

function Group({ title, count, href, children }: { title: string; count: number; href: string; children: React.ReactNode }) {
  if (!count) return null;
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          {title} <span className="ml-1 text-sm font-normal text-muted-foreground">{count}</span>
        </h2>
        <Link href={href} className="text-xs text-muted-foreground hover:text-foreground hover:underline">
          Browse all
        </Link>
      </div>
      {children}
    </section>
  );
}

export function SearchResults({ results }: { results: Results }) {
  const total = results.people.length + results.companies.length + results.projects.length;

  if (!results.query) {
    return (
      <EmptyState
        title="Search people, firms, and projects"
        description="Try a skill like mass timber, a city like Oakland, a sector like healthcare, or a name."
      />
    );
  }
  if (!total) {
    return (
      <EmptyState
        title={`Nothing matches “${results.query}”`}
        description="Check the spelling, or try a broader term such as a discipline, city, or building system."
        action={{ href: "/projects", label: "Browse projects instead" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground" role="status">
        {total} {total === 1 ? "result" : "results"} for “{results.query}”
      </p>
      <Group title="People" count={results.people.length} href="/people">
        <ul className="grid gap-4 md:grid-cols-2">
          {results.people.map((s) => (
            <li key={s.profile.id}><PersonCard summary={s} /></li>
          ))}
        </ul>
      </Group>
      <Group title="Companies" count={results.companies.length} href="/companies">
        <ul className="grid gap-4 md:grid-cols-2">
          {results.companies.map((c) => (
            <li key={c.id}><CompanyCard company={c} /></li>
          ))}
        </ul>
      </Group>
      <Group title="Projects" count={results.projects.length} href="/projects">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.projects.map((p) => (
            <li key={p.id}><ProjectCard project={p} /></li>
          ))}
        </ul>
      </Group>
    </div>
  );
}
