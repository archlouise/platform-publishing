import type { Metadata } from "next";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";

export const metadata: Metadata = { title: "My Profile" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeading title="My Profile" />
      <p className="text-sm text-muted-foreground">Coming in the next build step.</p>
    </PageContainer>
  );
}
