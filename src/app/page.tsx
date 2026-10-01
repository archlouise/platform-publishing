import { PageContainer, PageHeading } from "@/components/layout/PageContainer";

export default function FeedPage() {
  return (
    <PageContainer>
      <PageHeading title="Feed" description="Project milestones, firm updates, questions, and openings from the Bay Area AEC community." />
      <p className="text-sm text-muted-foreground">Coming in the next build step.</p>
    </PageContainer>
  );
}
