import { Check } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { services } from "@/data/services";

export function ServicesSection() {
  return (
    <Section id="services" bordered>
      <Container>
        <SectionHeading
          eyebrow="What I can build"
          title={
            <>
              Areas I&apos;m developing{" "}
              <span className="text-gradient-static">real ability in.</span>
            </>
          }
          description="These describe what I'm learning to do well — not a menu of commercial services. Each card carries an honest maturity label."
        />

        <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <RevealItem key={service.id} className="h-full">
              <article className="panel group flex h-full flex-col gap-4 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl border border-border-strong bg-card text-accent transition-colors group-hover:border-accent/40">
                    <Icon name={service.icon} className="size-5" />
                  </span>
                  <span className="rounded-full border border-border bg-card px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-faint">
                    {service.maturity}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold tracking-tight">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{service.description}</p>
                </div>

                <ul className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-muted">
                      <Check className="size-3.5 text-accent" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
