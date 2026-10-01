"use client";

import { NeedCard } from "./NeedCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { useDemoState } from "@/lib/store";
import type { Company, Profile } from "@/lib/types";

/** Detail view for a need the demo user created in this browser. */
export function LocalNeedDetail({ id, viewer, viewerCompany }: { id: string; viewer: Profile; viewerCompany: Company | null }) {
  const state = useDemoState();
  const need = state.needs.find((n) => n.id === id);
  if (!need) {
    return (
      <EmptyState
        title="This post is not available"
        description="It may have been created in another browser. Needs you post here are stored locally for the demo."
        action={{ href: "/needs", label: "Back to Needs & Help" }}
      />
    );
  }
  return <NeedCard view={{ need, author: viewer, company: viewerCompany }} expanded />;
}
