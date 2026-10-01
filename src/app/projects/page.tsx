import type { Metadata } from "next";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";

export const metadata: Metadata = { title: "Projects" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeading title="Projects" description="Built work and the teams behind it." />
      <p className="text-sm text-muted-foreground">Coming in the next build step.</p>
    </PageContainer>
  );
}
