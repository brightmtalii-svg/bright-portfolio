import { statusTone } from "@/components/projects/project-thumbnail";
import { projectStatuses } from "@/data/projects";
import type { ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Status pill for a project. The label and description come from
 * `projectStatuses` so the vocabulary stays consistent across the site.
 */
export function StatusBadge({
  status,
  className,
  withDescription = false,
}: {
  status: ProjectStatus;
  className?: string;
  withDescription?: boolean;
}) {
  const meta = projectStatuses[status];
  const tone = statusTone[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em]",
        tone.border,
        tone.textClass,
        className,
      )}
      title={withDescription ? meta.description : undefined}
    >
      <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
