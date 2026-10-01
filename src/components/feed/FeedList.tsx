"use client";

import { FeedPostCard } from "./FeedPostCard";
import { PostComposer } from "./PostComposer";
import { useDemoState } from "@/lib/store";
import type { Company, PostView, Profile, Project } from "@/lib/types";

export function FeedList({
  seeded,
  viewer,
  viewerCompany,
  projects,
  showComposer = true,
  afterComposer,
}: {
  seeded: PostView[];
  viewer: Profile;
  viewerCompany: Company | null;
  projects: Project[];
  showComposer?: boolean;
  /** Rendered between the composer and the posts, e.g. the phone suggestions strip. */
  afterComposer?: React.ReactNode;
}) {
  const state = useDemoState();
  const projectById = new Map(projects.map((p) => [p.id, p]));
  const local: PostView[] = state.posts.map((post) => ({
    post,
    author: viewer,
    company: viewerCompany,
    project: post.project_id ? projectById.get(post.project_id) ?? null : null,
    comments: [],
  }));

  return (
    <div className="flex flex-col gap-4">
      {showComposer ? (
        <PostComposer viewer={viewer} company={viewerCompany} projects={projects} />
      ) : null}
      {afterComposer}
      {[...local, ...seeded].map((view) => (
        <FeedPostCard key={view.post.id} view={view} viewer={viewer} />
      ))}
    </div>
  );
}
