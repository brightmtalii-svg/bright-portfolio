import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Container, SectionHeading } from "@/components/ui/section";
import { navigation } from "@/data/site";

const homeLabel = navigation.find((item) => item.href === "/")?.label ?? "Home";

export interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  /** Current page label for the breadcrumb. */
  current: string;
  children?: ReactNode;
}

/** Shared hero banner used at the top of every inner page. */
export function PageHero({ eyebrow, title, description, current, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[46rem] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_40%,var(--glow),transparent_70%)] opacity-60"
        aria-hidden="true"
      />

      <Container className="relative flex flex-col gap-8 py-14 sm:py-16 lg:py-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 font-mono text-xs text-faint">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                {homeLabel}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <span className="text-muted" aria-current="page">
                {current}
              </span>
            </li>
          </ol>
        </nav>

        <SectionHeading eyebrow={eyebrow} title={title} description={description} level="h1" />

        {children}
      </Container>
    </section>
  );
}
