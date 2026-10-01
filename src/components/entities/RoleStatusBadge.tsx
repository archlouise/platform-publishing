import { CheckIcon, UserRoundPenIcon } from "lucide-react";
import { CLAIM_STATUS_LABEL } from "@/lib/labels";
import type { ClaimStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Shows how a project role was established. Confirmed roles were
 * corroborated by another participant on the project; self-claimed roles
 * were asserted by the member and are awaiting confirmation.
 */
export function RoleStatusBadge({
  status,
  className,
}: {
  status: ClaimStatus;
  className?: string;
}) {
  const confirmed = status === "confirmed";
  return (
    <span
      title={
        confirmed
          ? "Confirmed by another participant on this project"
          : "Asserted by the member; not yet confirmed by a collaborator"
      }
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-1.5 text-[11px] font-medium leading-none",
        confirmed
          ? "bg-brand-soft text-brand"
          : "border border-dashed border-claim/60 text-claim",
        className,
      )}
    >
      {confirmed ? (
        <CheckIcon className="size-3" aria-hidden strokeWidth={3} />
      ) : (
        <UserRoundPenIcon className="size-3" aria-hidden />
      )}
      {CLAIM_STATUS_LABEL[status]}
    </span>
  );
}
