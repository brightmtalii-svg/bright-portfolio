import { coreTechnologies } from "@/data/skills";

/**
 * Seamless technology marquee — the list is duplicated and shifted by -50% so
 * the loop never jumps. Purely decorative; content is hidden from AT.
 */
export function SkillsMarquee() {
  const items = [...coreTechnologies, ...coreTechnologies];

  return (
    <div
      className="relative overflow-hidden border-y border-border bg-surface/50 py-5"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-10 pr-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-3 whitespace-nowrap font-mono text-sm text-faint"
          >
            <span className="size-1 rounded-full bg-accent/50" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}