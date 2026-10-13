import { ArrowRight, Mail } from "lucide-react";
import { SocialLinks } from "@/components/layout/social-links";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { person } from "@/data/personal";

export function CtaSection() {
  const email = person.email;

  return (
    <section id="contact-cta" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <Container>
        <Reveal>
          <div className="panel relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
            {/* gradient border glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{
                background:
                  "radial-gradient(60% 120% at 50% 0%, var(--glow) 0%, transparent 60%), radial-gradient(50% 100% at 80% 100%, color-mix(in oklab, var(--accent-cyan) 16%, transparent) 0%, transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 bg-dot opacity-30" aria-hidden="true" />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
              <span className="rounded-full border border-border-strong bg-card/80 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-faint">
                $ open to connect
              </span>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Let&apos;s build something{" "}
                <span className="text-gradient-static">meaningful.</span>
              </h2>

              <p className="max-w-xl text-base leading-relaxed text-muted">
                Whether it&apos;s a collaboration, an internship, feedback on my work or just a
                conversation about software — I&apos;d genuinely like to hear from you.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <ButtonLink href="/contact" size="lg">
                  Start a conversation
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                {email ? (
                  <ButtonLink href={`mailto:${email}`} variant="secondary" size="lg">
                    <Mail className="size-4" aria-hidden="true" />
                    {email}
                  </ButtonLink>
                ) : (
                  <span className="rounded-full border border-border-strong bg-card/70 px-5 py-3 text-sm text-faint">
                    Set NEXT_PUBLIC_CONTACT_EMAIL to show a direct address
                  </span>
                )}
              </div>

              <SocialLinks className="mt-2 justify-center" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
