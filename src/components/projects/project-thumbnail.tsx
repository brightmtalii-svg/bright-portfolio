import type { Project, ProjectStatus } from "@/types";
import { hashString } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const statusTone: Record<
  ProjectStatus,
  { dot: string; text: string; border: string; textClass: string }
> = {
  concept: {
    dot: "bg-zinc-400",
    text: "text-zinc-400",
    border: "border-zinc-400/30",
    textClass: "text-zinc-500 dark:text-zinc-400",
  },
  "in-development": {
    dot: "bg-accent-cyan",
    text: "text-accent-cyan",
    border: "border-accent-cyan/30",
    textClass: "text-accent-cyan",
  },
  prototype: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    border: "border-amber-400/30",
    textClass: "text-amber-500 dark:text-amber-400",
  },
  completed: {
    dot: "bg-emerald-500",
    text: "text-emerald-500",
    border: "border-emerald-500/30",
    textClass: "text-emerald-500 dark:text-emerald-400",
  },
};

/**
 * Generated placeholder artwork for projects without a real screenshot.
 * Deterministic per project; swap in a real image by setting `project.thumbnail`.
 */
export function ProjectThumbnail({ project }: { project: Project }) {
  const hash = hashString(project.slug);
  const hue = hash % 360;
  const glyph = project.name
    .split(/[\s-]+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const tone = statusTone[project.status];

  return (
    <div className="relative aspect-video overflow-hidden bg-card">
      {/* deterministic gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg,
            hsl(${hue} 62% 16% / 0.9) 0%,
            hsl(${(hue + 46) % 360} 55% 9% / 0.95) 55%,
            hsl(${(hue + 128) % 360} 48% 7% / 0.98) 100%)`,
        }}
      />
      {/* blue-print grid */}
      <div
        className="absolute inset-0 bg-grid-sm opacity-60"
        style={{ ["--grid-line" as string]: "rgba(255,255,255,0.07)" }}
      />
      {/* glow */}
      <div
        className="absolute -right-12 -top-16 size-56 rounded-full opacity-70 blur-3xl"
        style={{ background: `radial-gradient(circle, hsl(${hue} 70% 55% / 0.5), transparent 70%)` }}
      />

      {/* glyph */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="flex size-24 rotate-[-6deg] items-center justify-center rounded-3xl border border-white/15 font-mono text-3xl font-semibold tracking-widest text-white/85 shadow-2xl backdrop-blur-sm transition-transform duration-300 group-hover:rotate-0"
          style={{ background: "rgba(12,12,16,0.55)" }}
          aria-hidden="true"
        >
          {glyph}
        </span>
      </div>

      {/* category + status legend */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/70">
          {project.category}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/80">
          <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden="true" />
          {project.status.replace("-", " ")}
        </span>
      </div>

      {/* hairline border */}
      <div className="pointer-events-none absolute inset-0 border border-white/5" aria-hidden="true" />
    </div>
  );
}