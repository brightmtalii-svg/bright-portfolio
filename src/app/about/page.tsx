import type { Metadata } from "next";
import { MapPin, GraduationCap, Compass } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ProfileAvatar } from "@/components/home/profile-avatar";
import { AvailabilityBadge } from "@/components/home/availability-badge";
import { CtaSection } from "@/components/home/cta-section";
import { SocialLinks } from "@/components/layout/social-links";
import { Icon } from "@/components/ui/icon";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { person } from "@/data/personal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Bright Mtalii is an Information Technology student at Maseno University and an aspiring software engineer building practical applications and exploring AI-powered systems.",
  path: "/about",
  type: "profile",
  keywords: ["About Bright Mtalii", "IT student", "aspiring software engineer"],
});

const facts = [
  { icon: MapPin, label: "Based in", value: person.location },
  { icon: GraduationCap, label: "Studying", value: `${person.degree} · ${person.university}` },
  { icon: Compass, label: "Focus", value: "Software engineering, AI & automation" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        current="About"
        title={
          <>
            The story behind{" "}
            <span className="text-gradient-static">the code.</span>
          </>
        }
        description="An Information Technology student learning by building — honest about where I am, and deliberate about where I'm heading."
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1.35fr_0.85fr] lg:gap-16">
          <Reveal stagger className="flex flex-col gap-6">
            <RevealItem>
              <SectionHeading
                eyebrow="My story"
                title="Curious about systems, serious about shipping."
              />
            </RevealItem>
            {person.bio.map((paragraph, index) => (
              <RevealItem key={index}>
                <p className="text-base leading-relaxed text-muted sm:text-[1.0625rem]">
                  {paragraph}
                </p>
              </RevealItem>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="panel sticky top-24 flex flex-col gap-6 rounded-3xl p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <ProfileAvatar size="md" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold tracking-tight">{person.name}</span>
                  <span className="text-sm text-muted">
                    Information Technology student &amp; aspiring software engineer
                  </span>
                </div>
              </div>

              <dl className="flex flex-col gap-4 border-t border-border pt-5">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-start gap-3">
                    <fact.icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    <div className="flex flex-col">
                      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                        {fact.label}
                      </dt>
                      <dd className="text-sm text-muted">{fact.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="border-t border-border pt-5">
                <AvailabilityBadge />
              </div>

              <div className="border-t border-border pt-5">
                <span className="mb-3 block font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                  Elsewhere
                </span>
                <SocialLinks size="sm" showLabels />
              </div>
            </aside>
          </Reveal>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <SectionHeading
            eyebrow="How I work"
            title="Principles I try to build by."
            description="Not a list of achievements — the habits I'm deliberately practising while I learn."
          />
          <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2">
            {person.traits.map((trait) => (
              <RevealItem key={trait.title} className="h-full">
                <article className="panel flex h-full gap-4 rounded-3xl p-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon name={trait.icon} className="size-5" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-semibold tracking-tight">{trait.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{trait.description}</p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <SectionHeading
            eyebrow="Focus areas"
            title="Where I spend my attention."
            description="The disciplines I keep returning to as I build. Some are early, some are further along — all are genuine."
          />
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {person.focusAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-border-strong bg-card px-4 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
              >
                {area}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
