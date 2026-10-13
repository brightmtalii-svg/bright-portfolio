import { person } from "@/data/personal";
import { cn } from "@/lib/utils";

/**
 * Availability indicator. The copy in src/data/personal.ts is intentionally
 * careful: it never claims employment, open availability or freelance status —
 * adjust it only when the reality changes.
 */
export function AvailabilityBadge({ className }: { className?: string }) {
  const { open, label, detail } = person.availability;

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs",
          open
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-border-strong bg-card text-muted",
        )}
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        {open ? "Available for opportunities" : "Currently focused on study"}
      </span>
      <p className="max-w-sm text-xs leading-relaxed text-muted">
        {label}. <span className="text-faint">{detail}</span>
      </p>
    </div>
  );
}