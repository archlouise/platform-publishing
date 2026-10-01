import { PageContainer } from "@/components/layout/PageContainer";
import { DetailSkeleton } from "@/components/layout/Skeletons";

export default function Loading() {
  return (
    <PageContainer>
      <DetailSkeleton />
    </PageContainer>
  );
}
