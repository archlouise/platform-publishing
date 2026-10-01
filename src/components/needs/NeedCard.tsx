import Link from "next/link";
import { MapPinIcon, MessageSquareIcon } from "lucide-react";
import { PersonAvatar } from "@/components/entities/Avatars";
import { EntityLink } from "@/components/entities/EntityLink";
import type { NeedView } from "@/lib/types";
import { cn, pluralize, timeAgo } from "@/lib/utils";

export function NeedCard({ view, expanded = false }: { view: NeedView; expanded?: boolean }) {
  const { need, author, company } = view;
  return (
    <article className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 md:p-5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 font-medium",
            need.need_type === "hiring" ? "bg-claim-soft text-claim" : "bg-brand-soft text-brand",
          )}
        >
          {need.category}
        </span>
        <span className="flex items-center gap-1">
          <MapPinIcon className="size-3" aria-hidden />
          {need.location}
        </span>
        <time dateTime={need.created_at}>{timeAgo(need.created_at)}</time>
      </div>
      <h3 className="mt-2 font-heading text-[17px] leading-snug font-semibold">
        {expanded ? need.title : (
          <Link href={`/needs/${need.id}`} className="hover:underline">{need.title}</Link>
        )}
      </h3>
      <p className={cn("mt-2 text-[15px] leading-relaxed", !expanded && "line-clamp-3")}>{need.body}</p>
      {need.tags.length ? (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
          {need.tags.map((t) => (
            <li key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</li>
          ))}
        </ul>
      ) : null}
      <footer className="mt-4 flex flex-wrap items-center gap-3 border-t border-border/70 pt-3 text-sm">
        <PersonAvatar profile={author} size="sm" />
        <div className="min-w-0 flex-1 leading-tight">
          <EntityLink kind="person" slug={author.slug}>{author.full_name}</EntityLink>
          <span className="block truncate text-xs text-muted-foreground">
            {author.profession}
            {company ? (
              <>
                {" at "}
                <EntityLink kind="company" slug={company.slug} muted className="font-normal">{company.name}</EntityLink>
              </>
            ) : null}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquareIcon className="size-3.5" aria-hidden />
          {pluralize(need.reply_count, "reply", "replies")}
        </span>
        {!expanded ? (
          <Link href={`/needs/${need.id}`} className="text-xs font-medium text-brand hover:underline">
            Open
          </Link>
        ) : null}
      </footer>
    </article>
  );
}
