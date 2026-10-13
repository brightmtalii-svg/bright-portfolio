import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { skills, skillLevels } from "@/data/skills";
import type { SkillLevel } from "@/types";
import { cn } from "@/lib/utils";

const levelDot: Record<SkillLevel, string> = {
  practical: "bg-emerald-500",
  learning: "bg-accent-cyan",
  interest: "bg-zinc-400",
};

const maxPreview = 5;

export function SkillsPreview() {
  return (
    <Section id="skills" bordered>
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Capabilities"
            title={
              <>
                A toolkit that is{" "}
                <span className="text-gradient-static">still growing.</span>
              </>
            }
            description="No invented percentages. Each skill is labelled honestly: what I use regularly, what I'm actively learning, and what I'm exploring."
          />
          <Link
            href="/skills"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            Full skills breakdown
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {(Object.keys(skillLevels) as SkillLevel[]).map((level) => (
            <li key={level} className="flex items-center gap-2 text-sm">
              <span className={cn("size-2 rounded-full", levelDot[level])} aria-hidden="true" />
              <span className="font-medium text-foreground">{skillLevels[level].label}</span>
              <span className="text-faint">· {skillLevels[level].description}</span>
            </li>
          ))}
        </ul>

        <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category) => {
            const preview = category.skills.slice(0, maxPreview);
            const remaining = category.skills.length - preview.length;

            return (
              <RevealItem key={category.id} className="h-full">
                <div className="panel flex h-full flex-col gap-4 rounded-3xl p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-2xl border",
                        category.accent === "cyan"
                          ? "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan"
                          : "border-accent/30 bg-accent/10 text-accent",
                      )}
                    >
                      <Icon name={category.icon} className="size-5" />
                    </span>
                    <h3 className="text-base font-semibold tracking-tight">{category.label}</h3>
                  </div>

                  <p className="text-sm leading-relaxed text-muted">{category.description}</p>

                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {preview.map((skill) => (
                      <li
                        key={skill.name}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-[0.68rem] text-muted"
                      >
                        <span
                          className={cn("size-1.5 rounded-full", levelDot[skill.level])}
                          aria-hidden="true"
                        />
                        {skill.name}
                      </li>
                    ))}
                    {remaining > 0 ? (
                      <li className="inline-flex items-center rounded-md border border-border bg-card px-2 py-1 font-mono text-[0.68rem] text-faint">
                        +{remaining}
                      </li>
                    ) : null}
                  </ul>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
