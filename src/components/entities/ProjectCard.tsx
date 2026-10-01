import Link from "next/link";
import { entityHref } from "./EntityLink";
import { RoleStatusBadge } from "./RoleStatusBadge";
import { PROJECT_STATUS_LABEL } from "@/lib/labels";
import { projectHeroUri } from "@/lib/placeholders";
import type { ClaimStatus, Project } from "@/lib/types";

export function ProjectCard({
  project,
  role,
}: {
  project: Project;
  /** Optional role context when shown on a person or company page. */
  role?: { label: string; status: ClaimStatus };
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <Link href={entityHref("project", project.slug)} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={projectHeroUri(project.id, "card")}
          alt=""
          className="aspect-[8/5] w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={entityHref("project", project.slug)} className="font-heading text-[15px] leading-snug font-semibold hover:underline">
            {project.name}
          </Link>
          <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {PROJECT_STATUS_LABEL[project.status]}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {project.sector} in {project.city}, {project.completion_year}
        </p>
        {role ? (
          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border/70 pt-2.5 text-sm">
            <span className="font-medium">{role.label}</span>
            <RoleStatusBadge status={role.status} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
