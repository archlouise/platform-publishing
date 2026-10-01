import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/entities/EmptyState";
import { ProjectTeamSection } from "@/components/entities/ProjectTeamSection";
import { Section } from "@/components/entities/Section";
import { PostList } from "@/components/feed/PostList";
import { PageContainer } from "@/components/layout/PageContainer";
import { repo } from "@/lib/data";
import { PROJECT_STATUS_LABEL } from "@/lib/labels";
import { projectHeroUri } from "@/lib/placeholders";
import { formatSqft } from "@/lib/utils";

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const view = await repo.getProjectBySlug(slug);
  return { title: view ? view.project.name : "Project not found" };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const [view, me] = await Promise.all([repo.getProjectBySlug(slug), repo.getDemoProfile()]);
  if (!view) notFound();
  const { project, team, unaffiliated_people, posts } = view;
  const companyCount = team.reduce((n, g) => n + g.companies.length, 0);
  const peopleCount = team.reduce((n, g) => n + g.companies.reduce((m, c) => m + c.people.length, 0), 0) + unaffiliated_people.length;

  const facts: Array<[string, string]> = [
    ["Status", PROJECT_STATUS_LABEL[project.status]],
    [project.status === "completed" ? "Completed" : "Target completion", String(project.completion_year)],
    ["Sector", project.sector],
    ["Location", project.location],
  ];
  if (project.size_sqft) facts.push(["Size", formatSqft(project.size_sqft)]);
  if (project.budget_range) facts.push(["Budget range", project.budget_range]);
  if (project.delivery_method) facts.push(["Delivery", project.delivery_method]);

  return (
    <PageContainer>
      <header className="mb-6 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.hero_url ?? projectHeroUri(project.id)}
          alt={`Elevation drawing placeholder for ${project.name}`}
          className="aspect-[5/2] w-full object-cover md:aspect-[3/1]"
        />
        <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-6">
          <div>
            <p className="text-sm font-medium text-brand">{project.sector}</p>
            <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight md:text-3xl">{project.name}</h1>
            <p className="mt-1 text-[15px] text-muted-foreground">{project.location}</p>
            <p className="mt-4 max-w-prose text-[15px] leading-relaxed">{project.description}</p>
            {project.systems.length ? (
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Systems">
                {project.systems.map((s) => (
                  <li key={s} className="rounded-md border border-border px-2 py-0.5 text-xs font-medium">{s}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 self-start rounded-lg bg-muted/60 p-4 text-sm md:grid-cols-1">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs text-muted-foreground">Team</dt>
              <dd className="font-medium">{companyCount} companies, {peopleCount} people</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <Section title="Project team">
          <ProjectTeamSection team={team} unaffiliated={unaffiliated_people} />
          <p className="mt-5 border-t border-border/70 pt-4 text-xs text-muted-foreground">
            Confirmed roles were corroborated by another participant on the project. Self-claimed roles were
            asserted by the member and are awaiting confirmation.
          </p>
        </Section>

        <Section title="Milestones and updates" count={posts.length}>
          {posts.length ? (
            <div className="mx-auto max-w-2xl">
              <PostList posts={posts} viewer={me.profile} showProjectMedia={false} />
            </div>
          ) : (
            <EmptyState title="No updates on this project yet" description="Milestones and insights linked to this project will appear here." />
          )}
        </Section>
      </div>
    </PageContainer>
  );
}
