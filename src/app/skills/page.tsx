import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CtaSection } from "@/components/home/cta-section";
import { SkillsMarquee } from "@/components/home/skills-marquee";
import { Icon } from "@/components/ui/icon";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Container, Section } from "@/components/ui/section";
import { coreTechnologies, skills, skillLevels } from "@/data/skills";
import type { SkillLevel } from "@/types";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Skills",
  description:
    "Bright Mtalii's skills and technologies — labelled honestly as working knowledge, currently learning or areas of interest. No invented percentages.",
  path: "/skills",
  keywords: ["Bright Mtalii skills", "Python developer", "React", "Next.js", "software skills"],
});

const levelMeta: Record<SkillLevel, { dot: string; tone: string }> = {
  practical: { dot: "bg-emerald-500", tone: "border-emerald-500/35 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" },
  learning: { dot: "bg-accent-cyan", tone: "border-accent-cyan/35 bg-accent-cyan/10 text-accent-cyan" },
  interest: { dot: "bg-zinc-400", tone: "border-border-strong bg-foreground/5 text-muted" },
};

export default function SkillsPage() {
  return (
    <>
      <PageHero
        eyebrow="Skills"
        current="Skills"
        title={
          <>
            Technologies I work with{" "}
            <span className="text-gradient-static">and where I&apos;m headed.</span>
          </>
        }
        description="An honest picture of what I can do today, what I'm actively learning, and what I'm exploring — without inflated percentages."
      >
        <dl className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(skillLevels) as SkillLevel[]).map((level) => (
            <div
              key={level}
              className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card/60 px-5 py-4"
            >
              <dt className="flex items-center gap-2 text-sm font-medium">
                <span className={cn("size-2 rounded-full", levelMeta[level].dot)} aria-hidden="true" />
                {skillLevels[level].label}
              </dt>
              <dd className="text-xs leading-relaxed text-muted">
                {skillLevels[level].description}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <SkillsMarquee />

      <Section>
        <Container className="flex flex-col gap-12">
          {skills.map((category) => (
            <div key={category.id} className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-2xl border",
                    category.accent === "cyan"
                      ? "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan"
                      : "border-accent/30 bg-accent/10 text-accent",
                  )}
                >
                  <Icon name={category.icon} className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {category.label}
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted">
                    {category.description}
                  </p>
                </div>
              </div>

              <Reveal stagger className="grid gap-3 sm:grid-cols-2">
                {category.skills.map((skill) => (
                  <RevealItem key={skill.name} className="h-full">
                    <div className="panel flex h-full items-start justify-between gap-4 rounded-2xl p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{skill.name}</span>
                        {skill.note ? (
                          <span className="text-xs leading-relaxed text-faint">{skill.note}</span>
                        ) : null}
                      </div>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em]",
                          levelMeta[skill.level].tone,
                        )}
                      >
                        <span
                          className={cn("size-1.5 rounded-full", levelMeta[skill.level].dot)}
                          aria-hidden="true"
                        />
                        {skillLevels[skill.level].short}
                      </span>
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          ))}
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <div className="panel flex flex-col gap-5 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              How I learn
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              I learn by building real, small things and finishing them — then reading the
              documentation properly. Coursework gives me the theory; independent projects tell me
              whether I actually understand it. When something breaks I would rather understand the
              failure than work around it.
            </p>
            <ul className="flex flex-wrap gap-1.5 pt-1">
              {coreTechnologies.map((technology) => (
                <li
                  key={technology}
                  className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] text-muted"
                >
                  {technology}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
