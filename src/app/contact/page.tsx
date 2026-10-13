import type { Metadata } from "next";
import { Mail, MapPin, Clock, MessageSquare, Info } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialLinks } from "@/components/layout/social-links";
import { Reveal } from "@/components/ui/reveal";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { person } from "@/data/personal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Bright Mtalii — questions, collaboration, internships, feedback or just a conversation about software. Send a message through the contact form.",
  path: "/contact",
  keywords: ["Contact Bright Mtalii", "hire student developer", "software internship", "collaboration"],
});

const topics = [
  "Internship or learning opportunities",
  "Collaboration on a project or idea",
  "Feedback on something I've built",
  "Questions about software, AI or automation",
  "Just a conversation about technology",
];

export default function ContactPage() {
  const email = person.email;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        current="Contact"
        title={
          <>
            Let&apos;s start a{" "}
            <span className="text-gradient-static">conversation.</span>
          </>
        }
        description="Whether it's an opportunity, a collaboration or a question — the form reaches me directly. I read everything."
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal stagger className="flex flex-col gap-6">
            <Reveal>
              <SectionHeading
                eyebrow="Details"
                title="The quick version"
                description="Prefer something other than the form? These work too."
              />
            </Reveal>

            <Reveal>
              <ul className="flex flex-col gap-3">
                <li className="panel flex items-start gap-3 rounded-2xl p-4">
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                      Email
                    </span>
                    {email ? (
                      <a
                        href={`mailto:${email}`}
                        className="text-sm text-foreground transition-colors hover:text-accent"
                      >
                        {email}
                      </a>
                    ) : (
                      <span className="text-sm text-muted">
                        Not configured — the form is the best way to reach me
                      </span>
                    )}
                  </div>
                </li>

                <li className="panel flex items-start gap-3 rounded-2xl p-4">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                      Location
                    </span>
                    <span className="text-sm text-muted">{person.location} · EAT (UTC+3)</span>
                  </div>
                </li>

                <li className="panel flex items-start gap-3 rounded-2xl p-4">
                  <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                      Response time
                    </span>
                    <span className="text-sm text-muted">
                      Usually within a few days — studying full-time alongside projects.
                    </span>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal>
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                  Find me online
                </span>
                <SocialLinks showLabels />
              </div>
            </Reveal>

            <Reveal>
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/50 p-5">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="size-4 text-accent" aria-hidden="true" />
                  Good reasons to reach out
                </span>
                <ul className="flex flex-col gap-2">
                  {topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-faint">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                I&apos;m a student — I can&apos;t take on commercial contracts, but I&apos;m always
                glad to collaborate, learn and help where I can.
              </p>
            </Reveal>
          </Reveal>

          <Reveal delay={0.1} className="lg:pt-1">
            <ContactForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
