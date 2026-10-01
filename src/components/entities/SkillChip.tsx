"use client";

import { PlusIcon, CheckIcon } from "lucide-react";
import { demoActions, useDemoState } from "@/lib/store";
import type { SkillView } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

export function SkillChip({
  profileId,
  skill,
  canEndorse,
}: {
  profileId: string;
  skill: SkillView;
  canEndorse: boolean;
}) {
  const state = useDemoState();
  const key = `${profileId}:${skill.skill.id}`;
  const endorsed = state.endorsements.includes(key);
  const count = skill.endorsement_count + (endorsed ? 1 : 0);

  if (!canEndorse) {
    return (
      <span className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-background pr-1 pl-3 text-sm">
        {skill.skill.name}
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{formatNumber(count)}</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={endorsed}
      onClick={() => demoActions.toggleEndorsement(profileId, skill.skill.id)}
      title={endorsed ? "Remove your endorsement" : `Endorse ${skill.skill.name}`}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border pr-1 pl-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 pointer-coarse:h-11 pointer-coarse:pr-1.5 pointer-coarse:pl-4",
        endorsed
          ? "border-brand/40 bg-brand-soft text-foreground"
          : "border-border bg-background hover:border-foreground/40",
      )}
    >
      {skill.skill.name}
      <span
        className={cn(
          "inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs",
          endorsed ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {endorsed ? <CheckIcon className="size-3" aria-hidden strokeWidth={3} /> : <PlusIcon className="size-3" aria-hidden />}
        {formatNumber(count)}
      </span>
    </button>
  );
}
