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
}: {
  seeded: PostView[];
  viewer: Profile;
  viewerCompany: Company | null;
  projects: Project[];
  showComposer?: boolean;
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
      {[...local, ...seeded].map((view) => (
        <FeedPostCard key={view.post.id} view={view} viewer={viewer} />
      ))}
    </div>
  );
}
