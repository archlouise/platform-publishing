import { FeedList } from "@/components/feed/FeedList";
import { PageContainer } from "@/components/layout/PageContainer";
import { RightRail } from "@/components/layout/RightRail";
import { SuggestionsStrip } from "@/components/layout/SuggestionsStrip";
import { repo } from "@/lib/data";

export default async function FeedPage() {
  const [feed, me, projects] = await Promise.all([
    repo.getFeed(),
    repo.getDemoProfile(),
    repo.getProjects(),
  ]);
  const [people, companies, needs] = await Promise.all([
    repo.getSuggestedPeople(me.profile.id, 4),
    repo.getSuggestedCompanies(me.profile.id, 3),
    repo.getTrendingNeeds(3),
  ]);

  return (
    <PageContainer>
      <h1 className="sr-only">Feed</h1>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="mx-auto w-full max-w-2xl">
          <FeedList
            seeded={feed}
            viewer={me.profile}
            viewerCompany={me.company}
            projects={projects}
            afterComposer={<SuggestionsStrip people={people} companies={companies} />}
          />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <RightRail people={people} companies={companies} needs={needs} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
