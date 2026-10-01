import { PageContainer, PageHeading } from "@/components/layout/PageContainer";

export default async function Page(props: PageProps<"/people/[slug]">) {
  const { slug } = await props.params;
  return (
    <PageContainer>
      <PageHeading title={slug} />
    </PageContainer>
  );
}
