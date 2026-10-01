import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export default function NotFound() {
  return (
    <PageContainer className="flex flex-1 items-center justify-center">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-brand">404</p>
        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight">This page is not on the network</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The person, company, or project you are looking for may have a different address. Try searching
          instead.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm font-medium">
          <Link href="/" className="rounded-lg bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/80">
            Back to the feed
          </Link>
          <Link href="/search" className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted">
            Search
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
