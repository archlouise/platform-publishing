import { PageContainer, PageHeading } from "@/components/layout/PageContainer";

export default async function Page(props: PageProps<"/needs/[id]">) {
  const { id } = await props.params;
  return (
    <PageContainer>
      <PageHeading title={id} />
    </PageContainer>
  );
}
