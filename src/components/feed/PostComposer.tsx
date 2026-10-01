"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/entities/Avatars";
import { POST_TYPE_LABEL } from "@/lib/labels";
import { demoActions } from "@/lib/store";
import type { Company, PostType, Profile, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const COMPOSER_TYPES: PostType[] = [
  "insight",
  "project_milestone",
  "project_showcase",
  "company_announcement",
  "hiring",
  "need",
];

export function PostComposer({
  viewer,
  company,
  projects,
}: {
  viewer: Profile;
  company: Company | null;
  projects: Project[];
}) {
  const [body, setBody] = useState("");
  const [type, setType] = useState<PostType>("insight");
  const [projectId, setProjectId] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const [posted, setPosted] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    demoActions.addPost({
      author_profile_id: viewer.id,
      author_company_id: company?.id ?? null,
      project_id: projectId || null,
      post_type: type,
      body: text,
    });
    setBody("");
    setProjectId("");
    setType("insight");
    setExpanded(false);
    setPosted(true);
    window.setTimeout(() => setPosted(false), 2500);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
      aria-label="Create a post"
    >
      <div className="flex gap-3">
        <PersonAvatar profile={viewer} size="md" />
        <div className="min-w-0 flex-1">
          <label htmlFor="composer-body" className="sr-only">What are you working on?</label>
          <textarea
            id="composer-body"
            value={body}
            onFocus={() => setExpanded(true)}
            onChange={(e) => setBody(e.target.value)}
            rows={expanded ? 4 : 1}
            placeholder="What are you working on?"
            className="min-h-11 w-full resize-none md:min-h-0 rounded-lg border border-input bg-background px-3 py-2 text-base leading-relaxed md:text-[15px] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
          {expanded ? (
            <div className="mt-3 flex flex-col gap-3">
              <div role="radiogroup" aria-label="Post type" className="flex flex-wrap gap-2">
                {COMPOSER_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={type === t}
                    onClick={() => setType(t)}
                    className={cn(
                      "h-7 rounded-full border px-2.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 pointer-coarse:h-11 pointer-coarse:px-3.5",
                      type === t
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                    )}
                  >
                    {POST_TYPE_LABEL[t]}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="composer-project" className="text-sm text-muted-foreground">
                  Link a project
                </label>
                <select
                  id="composer-project"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="h-11 max-w-full rounded-lg border border-input bg-background px-2 text-base outline-none md:h-8 md:text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <option value="">None</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="ml-auto flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setExpanded(false); setBody(""); }}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={!body.trim()}>
                    Post
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
          {posted ? (
            <p role="status" className="mt-2 text-sm text-brand">Posted. It is at the top of your feed.</p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
