import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function DirectorySkeleton({ cards = 6, columns = 2 }: { cards?: number; columns?: 2 | 3 }) {
  return (
    <div role="status" aria-label="Loading">
      <Bone className="mb-2 h-8 w-48" />
      <Bone className="mb-6 h-4 w-96 max-w-full" />
      <div className="mb-6 flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-9 w-36" />
        ))}
      </div>
      <div className={cn("grid gap-4", columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2")}>
        {Array.from({ length: cards }).map((_, i) => (
          <Bone key={i} className={columns === 3 ? "h-64" : "h-32"} />
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading">
      <Bone className="mb-6 h-56 w-full" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          <Bone className="h-40" />
          <Bone className="h-72" />
        </div>
        <div className="flex flex-col gap-6">
          <Bone className="h-48" />
          <Bone className="h-40" />
        </div>
      </div>
    </div>
  );
}
