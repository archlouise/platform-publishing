import Link from "next/link";
import { CompanyLogo, PersonAvatar } from "@/components/entities/Avatars";
import { entityHref } from "@/components/entities/EntityLink";
import { COMPANY_TYPE_LABEL } from "@/lib/labels";
import type { Company, ProfileSummary } from "@/lib/types";

const cardClass =
  "flex w-32 snap-start flex-col items-center rounded-xl bg-card p-3 text-center ring-1 ring-foreground/10 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * A heading row that stays put, over a horizontal scroller that bleeds to the
 * viewport edges while the feed column touches them (below 704px) and sits
 * inside the column once it has side margins of its own.
 */
function StripGroup({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Link
          href={href}
          className="text-xs text-muted-foreground hover:text-foreground hover:underline pointer-coarse:-mx-2 pointer-coarse:-my-3.5 pointer-coarse:px-2 pointer-coarse:py-3.5"
        >
          See all
        </Link>
      </div>
      <div className="-mx-4 -my-1 snap-x snap-mandatory overflow-x-auto scroll-px-4 min-[704px]:mx-0 min-[704px]:scroll-px-0">
        <ul className="flex w-max gap-3 px-4 py-1 min-[704px]:px-0">{children}</ul>
      </div>
    </div>
  );
}

/**
 * The phone and tablet stand-in for the feed's right rail: the people and
 * firms from the viewer's projects as horizontally scrolling cards. Hidden
 * from lg up, where the rail itself is shown.
 */
export function SuggestionsStrip({ people, companies }: { people: ProfileSummary[]; companies: Company[] }) {
  return (
    <section aria-label="Suggestions" className="flex flex-col gap-4 lg:hidden">
      <StripGroup title="People you have built with" href="/people">
        {people.map(({ profile, company }) => (
          <li key={profile.id}>
            <Link href={entityHref("person", profile.slug)} className={cardClass}>
              <PersonAvatar profile={profile} size="lg" />
              <span className="mt-2 w-full truncate text-sm font-medium">{profile.full_name}</span>
              <span className="w-full truncate text-xs text-muted-foreground">
                {profile.profession}
                {company ? ` at ${company.name}` : ""}
              </span>
            </Link>
          </li>
        ))}
      </StripGroup>
      <StripGroup title="Firms on your projects" href="/companies">
        {companies.map((c) => (
          <li key={c.id}>
            <Link href={entityHref("company", c.slug)} className={cardClass}>
              <CompanyLogo company={c} size="lg" />
              <span className="mt-2 w-full truncate text-sm font-medium">{c.name}</span>
              <span className="w-full truncate text-xs text-muted-foreground">{COMPANY_TYPE_LABEL[c.company_type]}</span>
            </Link>
          </li>
        ))}
      </StripGroup>
    </section>
  );
}
