import Link from "next/link";
import { BackToTop } from "@/components/layout/back-to-top";
import { FooterYear } from "@/components/layout/footer-year";
import { SocialLinks } from "@/components/layout/social-links";
import { Monogram } from "@/components/ui/monogram";
import { Container } from "@/components/ui/section";
import { person } from "@/data/personal";
import { navigation, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="relative mt-8 border-t border-border bg-surface/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Monogram glow />
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold tracking-tight">{person.name}</span>
                <span className="text-xs text-muted">{site.role}</span>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {person.degree} at {person.university}. Building practical software, exploring
              intelligent systems and learning in public.
            </p>
            <SocialLinks />
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-faint">
              Navigate
            </h2>
            <ul className="flex flex-col gap-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-faint">
              Elsewhere
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              {person.socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    {social.label}
                    <span className="ml-2 font-mono text-xs text-faint">{social.handle}</span>
                  </a>
                </li>
              ))}
              {person.email ? (
                <li>
                  <a
                    href={`mailto:${person.email}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {person.email}
                  </a>
                </li>
              ) : (
                <li className="text-faint">
                  Email via the{" "}
                  <Link href="/contact" className="text-accent underline-offset-4 hover:underline">
                    contact form
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-faint">
            <FooterYear /> {person.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted">{person.closingLine}</p>
        </div>
      </Container>

      <BackToTop />
    </footer>
  );
}
