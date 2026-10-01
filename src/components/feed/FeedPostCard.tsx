"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { BookmarkIcon, HeartIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/entities/Avatars";
import { EntityLink, entityHref } from "@/components/entities/EntityLink";
import { PostTypeBadge } from "@/components/entities/PostTypeBadge";
import { projectHeroUri } from "@/lib/placeholders";
import { demoActions, useDemoState } from "@/lib/store";
import type { PostView, Profile } from "@/lib/types";
import { cn, formatNumber, timeAgo } from "@/lib/utils";

export function FeedPostCard({
  view,
  viewer,
  showProjectMedia = true,
}: {
  view: PostView;
  viewer: Profile;
  /** Set false on a project page where the hero is already shown. */
  showProjectMedia?: boolean;
}) {
  const { post, author, company, project } = view;
  const state = useDemoState();
  const liked = state.likedPostIds.includes(post.id);
  const saved = state.savedPostIds.includes(post.id);
  const localComments = state.comments.filter((c) => c.post_id === post.id);
  const commentCount = view.comments.length + localComments.length;
  const likeCount = post.like_count + (liked ? 1 : 0);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const isMedia =
    showProjectMedia &&
    project &&
    (post.post_type === "project_showcase" || post.post_type === "project_milestone");

  function submitComment(e: FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    demoActions.addComment(post.id, body);
    setDraft("");
  }

  return (
    <article className="rounded-xl bg-card ring-1 ring-foreground/10">
      <header className="flex items-start gap-3 px-4 pt-4">
        <Link href={entityHref("person", author.slug)} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <PersonAvatar profile={author} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <EntityLink kind="person" slug={author.slug} className="text-[15px]">
              {author.full_name}
            </EntityLink>
            {company ? (
              <span className="text-sm text-muted-foreground">
                at{" "}
                <EntityLink kind="company" slug={company.slug} muted>
                  {company.name}
                </EntityLink>
              </span>
            ) : null}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <PostTypeBadge type={post.post_type} />
            <time dateTime={post.created_at}>{timeAgo(post.created_at)}</time>
          </div>
        </div>
      </header>

      {project ? (
        <div className="px-4 pt-3">
          <Link
            href={entityHref("project", project.slug)}
            className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground outline-none hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
            <span className="truncate">{project.name}</span>
            <span className="truncate text-muted-foreground">{project.city}</span>
          </Link>
        </div>
      ) : null}

      <p className="px-4 pt-3 text-[15px] leading-relaxed whitespace-pre-line">{post.body}</p>

      {isMedia ? (
        <Link href={entityHref("project", project.slug)} className="mt-3 block outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={projectHeroUri(project.id)}
            alt={`Elevation drawing placeholder for ${project.name}`}
            className="aspect-[5/2] w-full object-cover"
          />
        </Link>
      ) : null}

      <footer className="mt-3 flex items-center gap-1 border-t border-border/70 px-2 py-1.5">
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={liked}
          onClick={() => demoActions.toggleLike(post.id)}
          className={cn(liked && "text-brand hover:text-brand")}
        >
          <HeartIcon className={cn(liked && "fill-current")} />
          {formatNumber(likeCount)}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <MessageCircleIcon />
          {formatNumber(commentCount)}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={saved}
          onClick={() => demoActions.toggleSave(post.id)}
          className={cn("ml-auto", saved && "text-brand hover:text-brand")}
        >
          <BookmarkIcon className={cn(saved && "fill-current")} />
          {saved ? "Saved" : "Save"}
        </Button>
      </footer>

      {open ? (
        <div className="border-t border-border/70 bg-muted/40 px-4 py-3">
          <ul className="flex flex-col gap-3">
            {view.comments.map(({ comment, author: ca }) => (
              <li key={comment.id} className="flex gap-2.5">
                <PersonAvatar profile={ca} size="sm" />
                <div className="min-w-0 rounded-lg bg-background px-3 py-2 text-sm ring-1 ring-foreground/5">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <EntityLink kind="person" slug={ca.slug}>{ca.full_name}</EntityLink>
                    <time className="text-xs text-muted-foreground" dateTime={comment.created_at}>
                      {timeAgo(comment.created_at)}
                    </time>
                  </div>
                  <p className="mt-0.5">{comment.body}</p>
                </div>
              </li>
            ))}
            {localComments.map((c) => (
              <li key={c.id} className="flex gap-2.5">
                <PersonAvatar profile={viewer} size="sm" />
                <div className="min-w-0 rounded-lg bg-background px-3 py-2 text-sm ring-1 ring-foreground/5">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <EntityLink kind="person" slug={viewer.slug}>{viewer.full_name}</EntityLink>
                    <span className="text-xs text-muted-foreground">just now</span>
                  </div>
                  <p className="mt-0.5">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={submitComment} className="mt-3 flex items-center gap-2">
            <PersonAvatar profile={viewer} size="sm" />
            <label htmlFor={`comment-${post.id}`} className="sr-only">Add a comment</label>
            <input
              id={`comment-${post.id}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment"
              className="h-8 min-w-0 flex-1 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
            <Button type="submit" size="icon-sm" variant="outline" aria-label="Post comment" disabled={!draft.trim()}>
              <SendIcon />
            </Button>
          </form>
        </div>
      ) : null}
    </article>
  );
}
