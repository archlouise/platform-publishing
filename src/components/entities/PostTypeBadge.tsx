import {
  BriefcaseIcon,
  FlagIcon,
  HelpCircleIcon,
  LightbulbIcon,
  LandmarkIcon,
  MegaphoneIcon,
} from "lucide-react";
import { POST_TYPE_LABEL } from "@/lib/labels";
import type { PostType } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICON: Record<PostType, React.ComponentType<{ className?: string }>> = {
  project_milestone: FlagIcon,
  project_showcase: LandmarkIcon,
  company_announcement: MegaphoneIcon,
  insight: LightbulbIcon,
  hiring: BriefcaseIcon,
  need: HelpCircleIcon,
};

export function PostTypeBadge({ type, className }: { type: PostType; className?: string }) {
  const Icon = ICON[type];
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-md bg-muted px-1.5 text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {POST_TYPE_LABEL[type]}
    </span>
  );
}
