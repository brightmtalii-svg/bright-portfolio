import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { getFeaturedProjects } from "@/data/projects";

export function FeaturedProjects() {
  const featured = getFeaturedProjects();

  return (
    <Section id="work" bordered className="overflow-hidden">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            title={
              <>
                Projects I&apos;m building
                <span className="text-gradient-static"> right now.</span>
              </>
            }
            description="A mix of learning projects, coursework and experiments. Every entry states its honest maturity — from early concepts to working prototypes."
          />
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            All projects
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <Reveal
          stagger
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-7"
        >
          {featured.map((project) => (
            <RevealItem key={project.slug} className="h-full">
              <ProjectCard project={project} className="h-full" />
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
