import type { Metadata } from "next";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";
import { SearchResults } from "@/components/search/SearchResults";
import { repo } from "@/lib/data";

export async function generateMetadata(props: PageProps<"/search">): Promise<Metadata> {
  const sp = await props.searchParams;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage(props: PageProps<"/search">) {
  const sp = await props.searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "";
  const results = await repo.search(q);

  return (
    <PageContainer>
      <PageHeading title="Search" description="People, companies, and projects across the network." />
      <SearchResults results={results} />
    </PageContainer>
  );
}
