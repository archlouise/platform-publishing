import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Section } from "@/components/entities/Section";
import { NeedCard } from "@/components/needs/NeedCard";
import { LocalNeedDetail } from "@/components/needs/LocalNeedDetail";
import { PageContainer } from "@/components/layout/PageContainer";
import { repo } from "@/lib/data";
import type { NeedView } from "@/lib/types";

export async function generateMetadata(props: PageProps<"/needs/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const view = await repo.getNeedById(id);
  return { title: view ? view.need.title : "Needs & Help" };
}

export default async function NeedPage(props: PageProps<"/needs/[id]">) {
  const { id } = await props.params;
  const [view, me] = await Promise.all([repo.getNeedById(id), repo.getDemoProfile()]);
  const related: NeedView[] = view
    ? (await repo.getNeeds(view.need.need_type)).filter((n) => n.need.id !== id).slice(0, 3)
    : [];

  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl">
        <Link href={view ? `/needs?tab=${view.need.need_type}` : "/needs"} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-4" aria-hidden />
          Needs & Help
        </Link>
        {view ? (
          <NeedCard view={view} expanded />
        ) : (
          <LocalNeedDetail id={id} viewer={me.profile} viewerCompany={me.company} />
        )}
        {related.length ? (
          <Section title="More like this" className="mt-6">
            <ul className="flex flex-col gap-3">
              {related.map(({ need }) => (
                <li key={need.id} className="text-sm leading-snug">
                  <Link href={`/needs/${need.id}`} className="font-medium hover:underline">{need.title}</Link>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{need.category}, {need.location}</span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </div>
    </PageContainer>
  );
}
