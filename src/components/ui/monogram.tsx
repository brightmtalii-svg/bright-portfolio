import { cn } from "@/lib/utils";
import { site } from "@/data/site";

export interface MonogramProps {
  className?: string;
  /** Size of the square tile. */
  size?: "sm" | "md" | "lg";
  /** Adds the animated gradient ring. */
  glow?: boolean;
}

const sizes = {
  sm: "size-9 text-[0.7rem]",
  md: "size-10 text-xs",
  lg: "size-14 text-base",
};

/** The BM monogram used as the logo, favicon fallback and loading state. */
export function Monogram({ className, size = "md", glow = false }: MonogramProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl font-mono font-semibold uppercase tracking-[0.12em]",
        "bg-elevated text-foreground ring-1 ring-inset ring-border",
        glow && "shadow-[0_0_0_1px_var(--glow),0_12px_36px_-16px_var(--glow)]",
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      <span className="bg-gradient-to-br from-accent to-accent-cyan bg-clip-text text-transparent">
        {site.monogram}
      </span>
    </span>
  );
}
