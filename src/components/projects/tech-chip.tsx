import { cn } from "@/lib/utils";

/** Small monospace chip used for technologies on cards and detail pages. */
export function TechChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-card px-2 py-1 font-mono text-[0.68rem] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
