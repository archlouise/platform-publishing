import Link from "next/link";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
      <p className="font-medium">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      {action ? (
        <Link href={action.href} className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
