import Link from "next/link";
import { CompanyLogo, PersonAvatar } from "@/components/entities/Avatars";
import { EntityLink } from "@/components/entities/EntityLink";
import { COMPANY_TYPE_LABEL } from "@/lib/labels";
import type { Company, NeedView, ProfileSummary } from "@/lib/types";
import { pluralize } from "@/lib/utils";

function RailSection({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Link href={href} className="text-xs text-muted-foreground hover:text-foreground hover:underline pointer-coarse:-mx-2 pointer-coarse:-my-3.5 pointer-coarse:px-2 pointer-coarse:py-3.5">
          See all
        </Link>
      </div>
      {children}
    </section>
  );
}

export function RightRail({
  people,
  companies,
  needs,
}: {
  people: ProfileSummary[];
  companies: Company[];
  needs: NeedView[];
}) {
  return (
    <aside className="flex flex-col gap-4" aria-label="Suggestions">
      <RailSection title="People you have built with" href="/people">
        <ul className="flex flex-col gap-3">
          {people.map(({ profile, company }) => (
            <li key={profile.id} className="flex items-center gap-2.5">
              <PersonAvatar profile={profile} size="sm" />
              <div className="min-w-0 text-sm leading-tight">
                <EntityLink kind="person" slug={profile.slug} className="block truncate">
                  {profile.full_name}
                </EntityLink>
                <span className="block truncate text-xs text-muted-foreground">
                  {profile.profession}{company ? ` at ${company.name}` : ""}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </RailSection>

      <RailSection title="Firms on your projects" href="/companies">
        <ul className="flex flex-col gap-3">
          {companies.map((c) => (
            <li key={c.id} className="flex items-center gap-2.5">
              <CompanyLogo company={c} size="sm" />
              <div className="min-w-0 text-sm leading-tight">
                <EntityLink kind="company" slug={c.slug} className="block truncate">
                  {c.name}
                </EntityLink>
                <span className="block truncate text-xs text-muted-foreground">
                  {COMPANY_TYPE_LABEL[c.company_type]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </RailSection>

      <RailSection title="Active in Needs & Help" href="/needs">
        <ul className="flex flex-col gap-3">
          {needs.map(({ need }) => (
            <li key={need.id} className="text-sm leading-snug">
              <Link href={`/needs/${need.id}`} className="font-medium hover:underline">
                {need.title}
              </Link>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {pluralize(need.reply_count, "reply", "replies")}
              </span>
            </li>
          ))}
        </ul>
      </RailSection>
    </aside>
  );
}
