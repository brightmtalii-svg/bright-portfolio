import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "accent" | "cyan" | "success" | "warning" | "muted";

const tones: Record<BadgeTone, string> = {
  neutral: "border-border-strong bg-foreground/5 text-muted",
  accent: "border-accent/35 bg-accent/10 text-accent",
  cyan: "border-accent-cyan/35 bg-accent-cyan/10 text-accent-cyan",
  success: "border-emerald-500/35 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
  warning: "border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  muted: "border-border bg-transparent text-faint",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  /** Renders a small leading dot — useful for status indicators. */
  dot?: boolean;
  title?: string;
}

export function Badge({ children, tone = "neutral", className, dot, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {dot ? (
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}
