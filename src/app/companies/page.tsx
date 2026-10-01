import type { Metadata } from "next";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";

export const metadata: Metadata = { title: "Companies" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeading title="Companies" description="Firms, contractors, and suppliers on the network." />
      <p className="text-sm text-muted-foreground">Coming in the next build step.</p>
    </PageContainer>
  );
}
