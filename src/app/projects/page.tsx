import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { CtaSection } from "@/components/home/cta-section";
import { Info } from "lucide-react";
import { Container, Section } from "@/components/ui/section";
import { getUsedCategories, projects } from "@/data/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Projects by Bright Mtalii — software, Python, AI and system-design experiments, each labelled with its honest status from concept to prototype.",
  path: "/projects",
  keywords: ["Bright Mtalii projects", "student software projects", "Python projects", "AI experiments"],
});

export default function ProjectsPage() {
  const categories = getUsedCategories();
  const featuredCount = projects.filter((project) => project.featured).length;

  return (
    <>
      <PageHero
        eyebrow="Projects"
        current="Projects"
        title={
          <>
            Things I&apos;ve been{" "}
            <span className="text-gradient-static">building.</span>
          </>
        }
        description="A working record of my projects — from AI experiments to system-design studies. Every entry says exactly how far along it really is."
      >
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Projects" value={projects.length} />
          <Stat label="Featured" value={featuredCount} />
          <Stat label="Categories" value={categories.length} />
          <Stat label="In development" value={projects.filter((p) => p.status === "in-development").length} />
        </dl>
      </PageHero>

      <Section>
        <Container>
          <ProjectGallery projects={projects} categories={categories} />
        </Container>
      </Section>

      <Section bordered className="py-12 sm:py-14">
        <Container>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-5 text-sm text-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <p>
              These are honest learning projects, not commercial products. No project here is
              hosted, published or offered as a service unless its links say otherwise — and none
              of it would be possible without treating every build as a lesson.
            </p>
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card/60 px-5 py-4">
      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">{label}</dt>
      <dd className="text-2xl font-semibold tracking-tight">{value}</dd>
    </div>
  );
}
