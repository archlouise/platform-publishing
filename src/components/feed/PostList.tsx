"use client";

import { FeedPostCard } from "./FeedPostCard";
import type { PostView, Profile } from "@/lib/types";

/** A read-only list of seeded posts for profile, company, and project pages. */
export function PostList({
  posts,
  viewer,
  showProjectMedia = true,
}: {
  posts: PostView[];
  viewer: Profile;
  showProjectMedia?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((view) => (
        <FeedPostCard key={view.post.id} view={view} viewer={viewer} showProjectMedia={showProjectMedia} />
      ))}
    </div>
  );
}
