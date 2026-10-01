import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BriefcaseIcon, CalendarIcon, GlobeIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { CompanyLogo, PersonAvatar } from "@/components/entities/Avatars";
import { EmptyState } from "@/components/entities/EmptyState";
import { EntityLink } from "@/components/entities/EntityLink";
import { ProjectCard } from "@/components/entities/ProjectCard";
import { Section } from "@/components/entities/Section";
import { SupplierProductCard } from "@/components/entities/SupplierProductCard";
import { PostList } from "@/components/feed/PostList";
import { PageContainer } from "@/components/layout/PageContainer";
import { repo } from "@/lib/data";
import { COMPANY_TYPE_LABEL } from "@/lib/labels";
import { coverUri } from "@/lib/placeholders";
import { formatNumber, timeAgo } from "@/lib/utils";

export async function generateMetadata(props: PageProps<"/companies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const view = await repo.getCompanyBySlug(slug);
  return { title: view ? view.company.name : "Company not found" };
}

export default async function CompanyPage(props: PageProps<"/companies/[slug]">) {
  const { slug } = await props.params;
  const [view, me] = await Promise.all([repo.getCompanyBySlug(slug), repo.getDemoProfile()]);
  if (!view) notFound();
  const { company, size_band, members, projects, posts, jobs, needs, products } = view;
  const isSupplier = company.company_type === "supplier";

  return (
    <PageContainer>
      <header className="mb-6 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={company.cover_url ?? coverUri(company.id)} alt="" className="h-32 w-full object-cover md:h-44" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
            <CompanyLogo company={company} size="xl" className="rounded-xl ring-4 ring-card" />
            <div className="min-w-0 flex-1 pt-2">
              <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{company.name}</h1>
              <p className="mt-0.5 text-[15px] font-medium">{COMPANY_TYPE_LABEL[company.company_type]}</p>
            </div>
          </div>
          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="size-4" aria-hidden />
              <dt className="sr-only">Headquarters</dt>
              <dd>{company.location}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersIcon className="size-4" aria-hidden />
              <dt className="sr-only">Size</dt>
              <dd>
                <span className="font-medium text-foreground">{size_band}</span>, {formatNumber(company.employee_count)} employees
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="size-4" aria-hidden />
              <dt className="sr-only">Founded</dt>
              <dd>Founded {company.founded_year}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <GlobeIcon className="size-4" aria-hidden />
              <dt className="sr-only">Website</dt>
              <dd className="min-w-0 wrap-anywhere">{company.website}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <Section title="About" className="order-1 lg:order-none">
            <p className="max-w-prose text-[15px] leading-relaxed">{company.about}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium">Specialties</h3>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {company.specialties.map((s) => (
                    <li key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs">{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium">Service regions</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{company.service_regions.join(", ")}</p>
              </div>
            </div>
          </Section>

          {isSupplier ? (
            <Section title="Products and materials" count={products.length} className="order-3 lg:order-none">
              <ul className="mb-4 flex flex-wrap gap-1.5" aria-label="Product categories">
                {company.product_categories.map((c) => (
                  <li key={c} className="rounded-md border border-border px-2 py-0.5 text-xs font-medium">{c}</li>
                ))}
              </ul>
              <ul className="grid gap-4 sm:grid-cols-2">
                {products.map((p) => (
                  <li key={p.id}><SupplierProductCard product={p} /></li>
                ))}
              </ul>
            </Section>
          ) : null}

          <Section title={isSupplier ? "Projects supplied" : "Projects"} count={projects.length} className="order-4 lg:order-none">
            {projects.length ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {projects.map((p) => (
                  <li key={`${p.project.id}-${p.role_type}`}>
                    <ProjectCard project={p.project} role={{ label: p.role_label, status: p.status }} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No projects listed yet" />
            )}
          </Section>

          {posts.length ? (
            <Section title="Posts" count={posts.length} className="order-7 lg:order-none">
              <PostList posts={posts} viewer={me.profile} />
            </Section>
          ) : null}
        </div>

        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <Section title="People" count={members.length} className="order-2 lg:order-none" action={<Link href={`/people?company=${company.id}`} className="text-xs text-muted-foreground hover:text-foreground hover:underline pointer-coarse:-mx-2 pointer-coarse:-my-3.5 pointer-coarse:px-2 pointer-coarse:py-3.5">See in directory</Link>}>
            <ul className="flex flex-col gap-3">
              {members.map(({ profile, title }) => (
                <li key={profile.id} className="flex items-center gap-2.5">
                  <PersonAvatar profile={profile} size="md" />
                  <div className="min-w-0 text-sm leading-tight">
                    <EntityLink kind="person" slug={profile.slug} className="block truncate">{profile.full_name}</EntityLink>
                    <span className="block truncate text-xs text-muted-foreground">{title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Open roles" count={jobs.length} className="order-5 lg:order-none">
            {jobs.length ? (
              <ul className="flex flex-col gap-3">
                {jobs.map((job) => (
                  <li key={job.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start gap-2">
                      <BriefcaseIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <div className="min-w-0">
                        <p className="font-medium leading-snug">{job.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {job.employment_type}, {job.location}. Posted {timeAgo(job.created_at)} ago
                        </p>
                        <p className="mt-1.5 text-sm">{job.summary}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No open roles right now.</p>
            )}
          </Section>

          {needs.length ? (
            <Section title="Current needs" count={needs.length} className="order-6 lg:order-none">
              <ul className="flex flex-col gap-3">
                {needs.map(({ need }) => (
                  <li key={need.id} className="text-sm leading-snug">
                    <Link href={`/needs/${need.id}`} className="block font-medium hover:underline pointer-coarse:-my-2 pointer-coarse:py-2">{need.title}</Link>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{need.category}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
}
