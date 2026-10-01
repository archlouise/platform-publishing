import { cn } from "@/lib/utils";

/** A titled block on a profile, company, or project page. */
export function Section({
  title,
  count,
  action,
  className,
  children,
}: {
  title: string;
  count?: number;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-xl bg-card p-5 ring-1 ring-foreground/10", className)}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          {title}
          {typeof count === "number" ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">{count}</span>
          ) : null}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
