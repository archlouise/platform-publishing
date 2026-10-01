import { PageContainer } from "@/components/layout/PageContainer";
import { DirectorySkeleton } from "@/components/layout/Skeletons";

export default function Loading() {
  return (
    <PageContainer>
      <DirectorySkeleton />
    </PageContainer>
  );
}
