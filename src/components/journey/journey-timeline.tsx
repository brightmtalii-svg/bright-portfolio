import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { education, journey } from "@/data/journey";
import { GraduationCap, MapPin } from "lucide-react";

export function JourneyTimeline() {
  return (
    <Section>
      <Container className="grid gap-14 lg:grid-cols-[1fr_0.75fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Timeline"
            title="The path so far"
            description="Education and self-directed learning. Deliberately free of anything I cannot verify — just the milestones that are real."
          />

          <ol className="relative flex flex-col gap-8 border-l border-border pl-8">
            {journey.map((entry) => (
              <li key={entry.id} className="relative">
                <span
                  className={`absolute -left-[2.6rem] grid size-9 place-items-center rounded-xl border ${
                    entry.current
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-border-strong bg-card text-muted"
                  }`}
                  aria-hidden="true"
                >
                  <Icon name={entry.icon} className="size-4" />
                </span>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                      {entry.period}
                    </span>
                    {entry.current ? <Badge tone="success" dot>Current</Badge> : null}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{entry.title}</h3>
                  <p className="text-sm font-medium text-muted">{entry.subtitle}</p>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted">{entry.description}</p>
                  <ul className="flex flex-wrap gap-1.5 pt-1">
                    {entry.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[0.66rem] text-faint"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <aside className="panel flex flex-col gap-4 rounded-3xl p-6">
              <span className="grid size-11 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold tracking-tight">{education.degree}</h2>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {education.institution} · {education.location}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted">{education.summary}</p>
              <Badge tone="accent" dot>{education.status}</Badge>
            </aside>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border bg-card/50 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">
                What&apos;s next
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted">
                <li>Go deeper into software engineering fundamentals and system design.</li>
                <li>Keep building projects end to end — from architecture to deployment.</li>
                <li>Turn AI and automation experiments into genuinely useful tools.</li>
                <li>Contribute to open source and learn from code written by others.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
