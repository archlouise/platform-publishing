import type { Metadata } from "next";
import { Suspense } from "react";
import { CompanyCard } from "@/components/entities/CompanyCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";
import { FilterBar } from "@/components/search/FilterBar";
import { repo } from "@/lib/data";
import { projectCompanies } from "@/lib/data/seed";
import { COMPANY_TYPE_LABEL, SIZE_BANDS } from "@/lib/labels";
import type { CompanyType } from "@/lib/types";
import { sizeBandRange } from "@/lib/utils";

export const metadata: Metadata = { title: "Companies" };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CompaniesPage(props: PageProps<"/companies">) {
  const sp = await props.searchParams;
  const filters = {
    type: first(sp.type),
    location: first(sp.location),
    size: first(sp.size),
    specialty: first(sp.specialty),
  };
  const [companies, options] = await Promise.all([repo.getCompanies(filters), repo.getFilterOptions()]);
  const projectCount = (id: string) => new Set(projectCompanies.filter((pc) => pc.company_id === id).map((pc) => pc.project_id)).size;

  return (
    <PageContainer>
      <PageHeading
        title="Companies"
        description="Architecture and engineering firms, contractors, and the suppliers whose products end up in the building."
      />
      <Suspense>
        <FilterBar
          noun="company"
          nounPlural="companies"
          resultCount={companies.length}
          filters={[
            { key: "type", label: "Company type", options: (Object.keys(COMPANY_TYPE_LABEL) as CompanyType[]).map((t) => ({ value: t, label: COMPANY_TYPE_LABEL[t] })) },
            { key: "location", label: "Location", options: options.locations.map((l) => ({ value: l, label: l })) },
            { key: "size", label: "Size", options: SIZE_BANDS.map((b) => ({ value: b, label: `${b} (${sizeBandRange(b)})` })) },
            { key: "specialty", label: "Specialty", options: options.specialties.map((s) => ({ value: s, label: s })) },
          ]}
        />
      </Suspense>
      {companies.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {companies.map((c) => (
            <li key={c.id}>
              <CompanyCard company={c} projectCount={projectCount(c.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No companies match these filters"
          description="Try a broader company type or clear the specialty."
          action={{ href: "/companies", label: "Show all companies" }}
        />
      )}
    </PageContainer>
  );
}
