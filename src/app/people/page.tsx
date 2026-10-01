import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState } from "@/components/entities/EmptyState";
import { PersonCard } from "@/components/entities/PersonCard";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";
import { FilterBar } from "@/components/search/FilterBar";
import { repo } from "@/lib/data";
import { skills as allSkills, profileSkills } from "@/lib/data/seed";

export const metadata: Metadata = { title: "People" };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function PeoplePage(props: PageProps<"/people">) {
  const sp = await props.searchParams;
  const filters = {
    profession: first(sp.profession),
    location: first(sp.location),
    skill: first(sp.skill),
    company: first(sp.company),
  };
  const [people, options] = await Promise.all([repo.getProfiles(filters), repo.getFilterOptions()]);
  const skillName = new Map(allSkills.map((s) => [s.id, s.name]));

  function topSkills(profileId: string) {
    return profileSkills
      .filter((ps) => ps.profile_id === profileId)
      .sort((a, b) => b.endorsement_count - a.endorsement_count)
      .slice(0, 3)
      .map((ps) => skillName.get(ps.skill_id)!);
  }

  return (
    <PageContainer>
      <PageHeading
        title="People"
        description="Architects, engineers, contractors, and suppliers, searchable by what they have actually built."
      />
      <Suspense>
        <FilterBar
          noun="person"
          nounPlural="people"
          resultCount={people.length}
          filters={[
            { key: "profession", label: "Profession", options: options.professions.map((p) => ({ value: p, label: p })) },
            { key: "location", label: "Location", options: options.locations.map((l) => ({ value: l, label: l })) },
            { key: "skill", label: "Skill", options: allSkills.map((s) => ({ value: s.id, label: s.name })).sort((a, b) => a.label.localeCompare(b.label)) },
            { key: "company", label: "Company", options: options.companies.map((c) => ({ value: c.id, label: c.name })) },
          ]}
        />
      </Suspense>
      {people.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {people.map((summary) => (
            <li key={summary.profile.id}>
              <PersonCard summary={summary} skills={topSkills(summary.profile.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No one matches these filters"
          description="Try removing a filter or searching for a skill instead."
          action={{ href: "/people", label: "Show everyone" }}
        />
      )}
    </PageContainer>
  );
}
