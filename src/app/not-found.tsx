import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Monogram } from "@/components/ui/monogram";
import { navigation } from "@/data/site";

export const metadata = {
  title: "Page not found",
  description: "That page does not exist. Explore the rest of the portfolio instead.",
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[78vh] flex-col items-center justify-center gap-8 py-24 text-center">
      <Monogram size="lg" glow />
      <p className="font-mono text-6xl font-semibold tracking-tight text-gradient-static sm:text-7xl">
        404
      </p>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          This route does not exist
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          The page you were looking for moved, was renamed, or never existed. Nothing is broken —
          the path just is not here.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/" size="md">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </ButtonLink>
        <ButtonLink href="/projects" variant="secondary" size="md">
          <Compass className="size-4" aria-hidden="true" />
          Browse projects
        </ButtonLink>
      </div>

      <nav aria-label="Site sections" className="w-full max-w-2xl">
        <ul className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-full border border-border px-3.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-foreground"
              >
                {item.href}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
