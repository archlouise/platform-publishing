import type { Metadata } from "next";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";

export const metadata: Metadata = { title: "Needs & Help" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeading title="Needs & Help" description="Ask the industry, offer expertise, hire, or find work." />
      <p className="text-sm text-muted-foreground">Coming in the next build step.</p>
    </PageContainer>
  );
}
