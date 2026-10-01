"use client";

/**
 * Client-side interaction store for the demo. Likes, saves, comments,
 * endorsements, and user-created posts and needs live here, persisted to
 * localStorage so they survive a reload. Seeded data stays read-only.
 */
import { useSyncExternalStore } from "react";
import type { Need, NeedCategory, NeedType, Post, PostType } from "./types";

export interface LocalComment {
  id: string;
  post_id: string;
  body: string;
  created_at: string;
}

export interface DemoState {
  likedPostIds: string[];
  savedPostIds: string[];
  comments: LocalComment[];
  /** profileId:skillId pairs endorsed by the demo user. */
  endorsements: string[];
  posts: Post[];
  needs: Need[];
}

const STORAGE_KEY = "aec-network-demo-v1";

const EMPTY: DemoState = {
  likedPostIds: [],
  savedPostIds: [],
  comments: [],
  endorsements: [],
  posts: [],
  needs: [],
};

let state: DemoState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function load(): DemoState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode, quota). The UI still works
    // for the session.
  }
}

function emit() {
  for (const l of listeners) l();
}

function set(next: DemoState) {
  state = next;
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Reads localStorage once, on the first client snapshot after hydration.
 * React renders with the server snapshot during hydration, then compares
 * it with this value and re-renders if they differ.
 */
function getSnapshot() {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    state = load();
  }
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useDemoState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export const demoActions = {
  toggleLike(postId: string) {
    set({ ...state, likedPostIds: toggle(state.likedPostIds, postId) });
  },
  toggleSave(postId: string) {
    set({ ...state, savedPostIds: toggle(state.savedPostIds, postId) });
  },
  addComment(postId: string, body: string) {
    const comment: LocalComment = {
      id: newId("lc"),
      post_id: postId,
      body,
      created_at: new Date().toISOString(),
    };
    set({ ...state, comments: [...state.comments, comment] });
    return comment;
  },
  toggleEndorsement(profileId: string, skillId: string) {
    set({ ...state, endorsements: toggle(state.endorsements, `${profileId}:${skillId}`) });
  },
  addPost(input: {
    author_profile_id: string;
    author_company_id: string | null;
    project_id: string | null;
    post_type: PostType;
    body: string;
  }) {
    const post: Post = {
      id: newId("lp"),
      ...input,
      image_url: null,
      created_at: new Date().toISOString(),
      like_count: 0,
    };
    set({ ...state, posts: [post, ...state.posts] });
    return post;
  },
  addNeed(input: {
    author_profile_id: string;
    company_id: string | null;
    need_type: NeedType;
    category: NeedCategory;
    title: string;
    body: string;
    location: string;
    tags: string[];
  }) {
    const need: Need = {
      id: newId("ln"),
      ...input,
      created_at: new Date().toISOString(),
      reply_count: 0,
    };
    set({ ...state, needs: [need, ...state.needs] });
    return need;
  },
  reset() {
    set(EMPTY);
  },
};
