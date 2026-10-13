import { ArrowRight, MessageSquare, Terminal } from "lucide-react";
import { AvailabilityBadge } from "@/components/home/availability-badge";
import { HeroVisual } from "@/components/home/hero-visual";
import { ProfileAvatar } from "@/components/home/profile-avatar";
import { RotatingHeadline } from "@/components/home/rotating-headline";
import { SocialLinks } from "@/components/layout/social-links";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { person } from "@/data/personal";

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-label="Introduction">
      {/* background: grid + masked gradient wash */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid mask-fade-b"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 h-[34rem] bg-[radial-gradient(60%_60%_at_50%_30%,var(--glow),transparent_70%)] opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 top-40 size-[30rem] animate-float rounded-full bg-accent-cyan/5 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-16 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-24">
        <Reveal stagger className="flex flex-col items-start gap-7">
          <RevealItem className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-card/80 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-faint">
              $ whoami
            </span>
            <span className="font-mono text-xs text-muted">/hello-world</span>
          </RevealItem>

          <RevealItem className="flex flex-col gap-4">
            <ProfileAvatar size="sm" />
            <p className="font-mono text-sm uppercase tracking-[0.34em] text-accent">
              Hello world, I&apos;m
            </p>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {person.firstName}{" "}
              <span className="text-gradient-static">{person.lastName}.</span>
            </h1>
          </RevealItem>

          <RevealItem className="w-full">
            <RotatingHeadline
              phrases={person.rotatingHeadlines}
              className="text-2xl font-medium tracking-tight sm:text-3xl"
            />
          </RevealItem>

          <RevealItem>
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-[1.0625rem]">
              {person.heroIntro}
            </p>
          </RevealItem>

          <RevealItem>
            <AvailabilityBadge />
          </RevealItem>

          <RevealItem className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/projects" size="lg">
              Explore my work
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              <MessageSquare className="size-4" aria-hidden="true" />
              Let&apos;s connect
            </ButtonLink>
          </RevealItem>

          <RevealItem>
            <SocialLinks className="mt-1" />
          </RevealItem>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <HeroVisual />
        </Reveal>
      </Container>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block" aria-hidden="true">
        <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-faint">
          <Terminal className="size-3.5" strokeWidth={1.75} />
          scroll
          <span className="block h-6 w-px animate-pulse bg-slate-400/50" />
        </span>
      </div>
    </section>
  );
}