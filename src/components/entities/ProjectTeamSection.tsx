import Link from "next/link";
import { CompanyLogo, PersonAvatar } from "./Avatars";
import { EntityLink, entityHref } from "./EntityLink";
import { RoleStatusBadge } from "./RoleStatusBadge";
import type { ProjectView } from "@/lib/types";

/**
 * Participating companies grouped by role, each with the individual
 * contributors from that company. Rendered from relationship records,
 * so the same roles appear on company and person pages.
 */
export function ProjectTeamSection({ team, unaffiliated }: { team: ProjectView["team"]; unaffiliated: ProjectView["unaffiliated_people"] }) {
  return (
    <div className="flex flex-col divide-y divide-border/70">
      {team.map((group) => (
        <div key={group.role_type} className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[180px_minmax(0,1fr)]">
          <h3 className="text-sm font-semibold text-muted-foreground">{group.heading}</h3>
          <ul className="flex flex-col gap-4">
            {group.companies.map((tc) => (
              <li key={tc.company.id}>
                <div className="flex items-center gap-3">
                  <Link href={entityHref("company", tc.company.slug)} className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                    <CompanyLogo company={tc.company} size="md" />
                  </Link>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <EntityLink kind="company" slug={tc.company.slug} className="text-[15px]">
                        {tc.company.name}
                      </EntityLink>
                      <RoleStatusBadge status={tc.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{tc.role_label}</p>
                  </div>
                </div>
                {tc.people.length ? (
                  <ul className="mt-2.5 ml-[52px] flex flex-col gap-2">
                    {tc.people.map((p) => (
                      <li key={p.profile.id} className="flex items-center gap-2.5">
                        <PersonAvatar profile={p.profile} size="sm" />
                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                          <EntityLink kind="person" slug={p.profile.slug}>{p.profile.full_name}</EntityLink>
                          <span className="text-muted-foreground">{p.role_label}</span>
                          <RoleStatusBadge status={p.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {unaffiliated.length ? (
        <div className="grid gap-3 py-4 last:pb-0 md:grid-cols-[180px_minmax(0,1fr)]">
          <h3 className="text-sm font-semibold text-muted-foreground">Other contributors</h3>
          <ul className="flex flex-col gap-2">
            {unaffiliated.map((p) => (
              <li key={p.profile.id} className="flex items-center gap-2.5">
                <PersonAvatar profile={p.profile} size="sm" />
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                  <EntityLink kind="person" slug={p.profile.slug}>{p.profile.full_name}</EntityLink>
                  <span className="text-muted-foreground">{p.role_label}</span>
                  <RoleStatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
