import Link from "next/link";
import { MapPinIcon, UsersIcon } from "lucide-react";
import { CompanyLogo } from "./Avatars";
import { EntityLink, entityHref } from "./EntityLink";
import { COMPANY_TYPE_LABEL } from "@/lib/labels";
import type { Company } from "@/lib/types";
import { formatNumber, sizeBand } from "@/lib/utils";

export function CompanyCard({ company, projectCount }: { company: Company; projectCount?: number }) {
  return (
    <article className="flex gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <Link href={entityHref("company", company.slug)} className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <CompanyLogo company={company} size="lg" />
      </Link>
      <div className="min-w-0 flex-1">
        <EntityLink kind="company" slug={company.slug} className="text-base">
          {company.name}
        </EntityLink>
        <p className="mt-0.5 text-sm font-medium text-foreground">{COMPANY_TYPE_LABEL[company.company_type]}</p>
        <dl className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPinIcon className="size-3" aria-hidden />
            <dt className="sr-only">Location</dt>
            <dd>{company.location}</dd>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="size-3" aria-hidden />
            <dt className="sr-only">Size</dt>
            <dd>{sizeBand(company.employee_count)}, {formatNumber(company.employee_count)} employees</dd>
          </div>
          {typeof projectCount === "number" ? (
            <div>
              <dt className="sr-only">Projects</dt>
              <dd>{projectCount} {projectCount === 1 ? "project" : "projects"}</dd>
            </div>
          ) : null}
        </dl>
        <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Specialties">
          {company.specialties.slice(0, 4).map((s) => (
            <li key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{s}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
