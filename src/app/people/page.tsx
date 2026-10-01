import type { Metadata } from "next";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";

export const metadata: Metadata = { title: "People" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeading title="People" description="Architects, engineers, contractors, and specialists across the Bay Area." />
      <p className="text-sm text-muted-foreground">Coming in the next build step.</p>
    </PageContainer>
  );
}
