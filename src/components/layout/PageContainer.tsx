import { cn } from "@/lib/utils";

export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <main className={cn("mx-auto w-full max-w-6xl px-4 py-6 md:py-8", className)}>
      {children}
    </main>
  );
}

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-prose text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
