import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState } from "@/components/entities/EmptyState";
import { ProjectCard } from "@/components/entities/ProjectCard";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";
import { FilterBar } from "@/components/search/FilterBar";
import { repo } from "@/lib/data";
import { PROJECT_STATUS_LABEL } from "@/lib/labels";
import type { ProjectStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Projects" };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProjectsPage(props: PageProps<"/projects">) {
  const sp = await props.searchParams;
  const filters = {
    sector: first(sp.sector),
    location: first(sp.location),
    status: first(sp.status),
    year: first(sp.year),
  };
  const [projects, options, all] = await Promise.all([repo.getProjects(filters), repo.getFilterOptions(), repo.getProjects()]);
  const cities = Array.from(new Set(all.map((p) => p.city))).sort();

  return (
    <PageContainer>
      <PageHeading
        title="Projects"
        description="Built work across the Bay Area, with the architects, engineers, contractors, and suppliers on each one."
      />
      <Suspense>
        <FilterBar
          noun="project"
          resultCount={projects.length}
          filters={[
            { key: "sector", label: "Sector", options: options.sectors.map((s) => ({ value: s, label: s })) },
            { key: "location", label: "City", options: cities.map((c) => ({ value: c, label: c })) },
            { key: "status", label: "Status", options: (Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => ({ value: s, label: PROJECT_STATUS_LABEL[s] })) },
            { key: "year", label: "Completion", options: options.years.map((y) => ({ value: y, label: y })) },
          ]}
        />
      </Suspense>
      {projects.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id}><ProjectCard project={p} /></li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No projects match these filters"
          description="Try another sector or clear the completion year."
          action={{ href: "/projects", label: "Show all projects" }}
        />
      )}
    </PageContainer>
  );
}
