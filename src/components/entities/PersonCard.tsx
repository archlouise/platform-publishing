import Link from "next/link";
import { MapPinIcon } from "lucide-react";
import { PersonAvatar } from "./Avatars";
import { EntityLink, entityHref } from "./EntityLink";
import type { ProfileSummary } from "@/lib/types";

export function PersonCard({ summary, skills }: { summary: ProfileSummary; skills?: string[] }) {
  const { profile, company } = summary;
  return (
    <article className="flex gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <Link href={entityHref("person", profile.slug)} className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <PersonAvatar profile={profile} size="lg" />
      </Link>
      <div className="min-w-0 flex-1">
        <EntityLink kind="person" slug={profile.slug} className="text-base">
          {profile.full_name}
        </EntityLink>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{profile.headline}</p>
        <dl className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <dt className="sr-only">Profession</dt>
            <dd className="font-medium text-foreground">{profile.profession}</dd>
          </div>
          {company ? (
            <div>
              <dt className="sr-only">Company</dt>
              <dd>
                <EntityLink kind="company" slug={company.slug} muted className="font-normal">
                  {company.name}
                </EntityLink>
              </dd>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <MapPinIcon className="size-3" aria-hidden />
            <dt className="sr-only">Location</dt>
            <dd>{profile.location}</dd>
          </div>
        </dl>
        {skills?.length ? (
          <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Top skills">
            {skills.map((s) => (
              <li key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {s}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
