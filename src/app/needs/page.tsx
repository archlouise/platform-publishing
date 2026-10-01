import type { Metadata } from "next";
import { NeedsBoard } from "@/components/needs/NeedsBoard";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";
import { repo } from "@/lib/data";

export const metadata: Metadata = { title: "Needs & Help" };

export default async function NeedsPage(props: PageProps<"/needs">) {
  const sp = await props.searchParams;
  const tab = sp.tab === "hiring" ? "hiring" : "discussion";
  const [discussion, hiring, me] = await Promise.all([
    repo.getNeeds("discussion"),
    repo.getNeeds("hiring"),
    repo.getDemoProfile(),
  ]);

  return (
    <PageContainer>
      <PageHeading
        title="Needs & Help"
        description="Technical questions, referrals, and product advice from people who have built it. Plus who is hiring and who is available."
      />
      <div className="mx-auto max-w-3xl">
        <NeedsBoard
          discussion={discussion}
          hiring={hiring}
          viewer={me.profile}
          viewerCompany={me.company}
          initialTab={tab}
        />
      </div>
    </PageContainer>
  );
}
