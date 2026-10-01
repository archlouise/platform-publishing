import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheckIcon, BuildingIcon, GraduationCapIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { PersonAvatar, CompanyLogo } from "@/components/entities/Avatars";
import { EmptyState } from "@/components/entities/EmptyState";
import { EntityLink } from "@/components/entities/EntityLink";
import { ProjectCard } from "@/components/entities/ProjectCard";
import { Section } from "@/components/entities/Section";
import { SkillChip } from "@/components/entities/SkillChip";
import { PostList } from "@/components/feed/PostList";
import { PageContainer } from "@/components/layout/PageContainer";
import { repo } from "@/lib/data";
import { formatNumber, pluralize } from "@/lib/utils";

export async function generateMetadata(props: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const view = await repo.getProfileBySlug(slug);
  return { title: view ? view.profile.full_name : "Person not found" };
}

export default async function PersonPage(props: PageProps<"/people/[slug]">) {
  const { slug } = await props.params;
  const [view, me] = await Promise.all([repo.getProfileBySlug(slug), repo.getDemoProfile()]);
  if (!view) notFound();
  const { profile, company, skills, projects, experiences, education, certifications, posts } = view;
  const isMe = profile.id === me.profile.id;

  return (
    <PageContainer>
      <header className="mb-6 rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="h-24 rounded-t-xl bg-[linear-gradient(90deg,var(--brand-soft),transparent)] md:h-28" aria-hidden />
        <div className="px-5 pb-5">
          <div className="-mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
            <PersonAvatar profile={profile} size="xl" className="ring-4 ring-card" />
            <div className="min-w-0 flex-1 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{profile.full_name}</h1>
                {isMe ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">This is you</span>
                ) : null}
              </div>
              <p className="mt-1 max-w-prose text-[15px] text-muted-foreground">{profile.headline}</p>
            </div>
          </div>
          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Profession</dt>
              <dd className="font-medium">{profile.profession}</dd>
            </div>
            {company ? (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BuildingIcon className="size-4" aria-hidden />
                <dt className="sr-only">Company</dt>
                <dd><EntityLink kind="company" slug={company.slug} muted>{company.name}</EntityLink></dd>
              </div>
            ) : null}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPinIcon className="size-4" aria-hidden />
              <dt className="sr-only">Location</dt>
              <dd>{profile.location}</dd>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <UsersIcon className="size-4" aria-hidden />
              <dt className="sr-only">Connections</dt>
              <dd>{formatNumber(profile.connections_count)} connections</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <Section title="About" className="order-2 lg:order-none">
            <p className="max-w-prose text-[15px] leading-relaxed">{profile.bio}</p>
          </Section>

          <Section title="Projects" count={projects.length} className="order-3 lg:order-none">
            {projects.length ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {projects.map((p) => (
                  <li key={p.project.id}>
                    <ProjectCard project={p.project} role={{ label: p.role_label, status: p.status }} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No project roles yet" />
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Confirmed roles were corroborated by another participant on the project. Self-claimed roles are
              awaiting confirmation.
            </p>
          </Section>

          <Section title="Experience" className="order-5 lg:order-none">
            <ol className="flex flex-col gap-4">
              {experiences.map((e) => (
                <li key={e.id} className="flex gap-3">
                  {e.company_id ? (
                    <CompanyLogo company={{ id: e.company_id, name: e.company_name, logo_url: null }} size="md" />
                  ) : (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <BuildingIcon className="size-4" aria-hidden />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium">{e.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {e.company_name}, {e.start_year} to {e.end_year ?? "present"}
                    </p>
                    <p className="mt-1 text-sm">{e.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {posts.length ? (
            <Section title="Posts" count={posts.length} className="order-7 lg:order-none">
              <PostList posts={posts} viewer={me.profile} />
            </Section>
          ) : null}
        </div>

        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <Section title="Skills" count={skills.length} className="order-4 lg:order-none">
            <ul className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <li key={s.skill.id}>
                  <SkillChip profileId={profile.id} skill={s} canEndorse={!isMe} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              {isMe ? "Endorsements from your collaborators." : `Endorse a skill you have seen ${profile.full_name.split(" ")[0]} use on a project.`}
            </p>
          </Section>

          <Section title="Education and licenses" className="order-6 lg:order-none">
            <ul className="flex flex-col gap-3 text-sm">
              {education.map((e) => (
                <li key={e.id} className="flex gap-2.5">
                  <GraduationCapIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div>
                    <p className="font-medium">{e.degree}</p>
                    <p className="text-muted-foreground">{e.school}, {e.year}</p>
                  </div>
                </li>
              ))}
              {certifications.map((c) => (
                <li key={c.id} className="flex gap-2.5">
                  <BadgeCheckIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-muted-foreground">{c.issuer}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="At a glance" className="order-1 lg:order-none">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="font-medium">{pluralize(profile.years_experience, "year")}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Projects</dt>
                <dd className="font-medium">{projects.length}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Confirmed roles</dt>
                <dd className="font-medium">{projects.filter((p) => p.status === "confirmed").length}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Endorsements</dt>
                <dd className="font-medium">{formatNumber(skills.reduce((n, s) => n + s.endorsement_count, 0))}</dd>
              </div>
            </dl>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
}
