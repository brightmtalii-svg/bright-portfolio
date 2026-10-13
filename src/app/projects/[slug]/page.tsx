import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ExternalLink,
  Info,
  Layers,
  Lightbulb,
  Puzzle,
  Rocket,
  Target,
  TriangleAlert,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/brand-icons";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectThumbnail } from "@/components/projects/project-thumbnail";
import { StatusBadge } from "@/components/projects/status-badge";
import { TechChip } from "@/components/projects/tech-chip";
import { CtaSection } from "@/components/home/cta-section";
import { Reveal } from "@/components/ui/reveal";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import {
  getProjectBySlug,
  getProjectSlugs,
  projectCategories,
  projects,
  projectStatuses,
} from "@/data/projects";
import type { Project } from "@/types";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function generateStaticParams(): { slug: string }[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return pageMetadata({
      title: "Project not found",
      description: "The requested project could not be found.",
      path: `/projects/${slug}`,
    });
  }

  return pageMetadata({
    title: project.name,
    description: project.summary,
    path: `/projects/${project.slug}`,
    keywords: [...project.technologies, project.name],
    image: absoluteUrl(`/projects/${project.slug}/opengraph-image`),
  });
}

function categoryLabel(id: string): string {
  return projectCategories.find((category) => category.id === id)?.label ?? id;
}

/**
 * Honest caption for the hero visual. Conceptual artwork is labelled as such so
 * it is never mistaken for a screenshot of the running application.
 */
function thumbnailCaption(project: Project): string {
  if (project.thumbnailKind === "illustration") {
    return `Conceptual illustration for ${project.name} — not a screenshot of the finished application.`;
  }
  if (project.thumbnailKind === "screenshot") {
    return `Screenshot from ${project.name}.`;
  }
  return `${project.name} preview.`;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const previous = index > 0 ? projects[index - 1] : projects[projects.length - 1];
  const next = index < projects.length - 1 ? projects[index + 1] : projects[0];
  const related = projects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .concat(projects.filter((item) => item.slug !== project.slug && item.category !== project.category))
    .slice(0, 2);

  return (
    <>
      {/* header */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-32 right-0 h-96 w-[40rem] bg-[radial-gradient(50%_60%_at_70%_40%,var(--glow),transparent_70%)] opacity-50"
          aria-hidden="true"
        />

        <Container className="relative flex flex-col gap-6 py-14 sm:py-16 lg:py-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 font-mono text-xs text-faint">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/projects" className="transition-colors hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="text-muted" aria-current="page">
                  {project.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border-strong bg-card px-3 py-1 text-xs text-muted">
              {categoryLabel(project.category)}
            </span>
            <StatusBadge status={project.status} withDescription />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted">
              <Calendar className="size-3.5" aria-hidden="true" />
              {project.timeline}
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {project.tagline}
          </p>

          <ul className="flex flex-wrap gap-1.5">
            {project.technologies.map((technology) => (
              <li key={technology}>
                <TechChip>{technology}</TechChip>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All projects
            </Link>
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50"
              >
                <GitHubIcon className="size-4" />
                Source
              </a>
            ) : null}
            {project.links.live ? (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent/50"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                Live site
              </a>
            ) : null}
          </div>
        </Container>
      </section>

      {/* hero visual */}
      <Section className="py-10 sm:py-12">
        <Container className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-3xl border border-border">
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={project.thumbnailAlt ?? `${project.name} preview`}
                width={1600}
                height={900}
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="h-auto w-full object-cover"
              />
            ) : (
              <ProjectThumbnail project={project} />
            )}
          </div>
          <p className="text-center font-mono text-xs text-faint">
            {project.thumbnail
              ? thumbnailCaption(project)
              : "Generated placeholder artwork — real screenshots are added as the project matures."}
          </p>

          {project.screenshots.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.screenshots.map((screenshot) => (
                <figure
                  key={screenshot.src}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={screenshot.width}
                    height={screenshot.height}
                    className="h-auto w-full"
                  />
                  <figcaption className="border-t border-border px-4 py-3 text-xs text-muted">
                    {screenshot.alt}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </Container>
      </Section>

      {/* body */}
      <Section className="pt-4">
        <Container className="grid gap-14 lg:grid-cols-[1.5fr_0.85fr] lg:gap-16">
          <div className="flex flex-col gap-14">
            <CaseSection eyebrow="Overview" title="What it is" icon={Info}>
              <Prose paragraphs={project.overview} />
            </CaseSection>

            <div className="grid gap-12 sm:grid-cols-2 sm:gap-8">
              <CaseSection eyebrow="The problem" title="Why it exists" icon={Target}>
                <BulletList items={project.problem} />
              </CaseSection>
              <CaseSection eyebrow="The approach" title="What I'm doing about it" icon={Lightbulb}>
                <BulletList items={project.solution} />
              </CaseSection>
            </div>

            <CaseSection eyebrow="Architecture" title="How it's structured" icon={Layers}>
              <ol className="grid gap-4 sm:grid-cols-2">
                {project.architecture.map((layer, layerIndex) => (
                  <li
                    key={layer.title}
                    className="panel relative flex flex-col gap-2 rounded-2xl p-5"
                  >
                    <span className="font-mono text-xs text-accent">
                      {String(layerIndex + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-semibold tracking-tight">{layer.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{layer.description}</p>
                  </li>
                ))}
              </ol>
            </CaseSection>

            <CaseSection eyebrow="Features" title="Key capabilities" icon={Check}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CaseSection>

            <CaseSection eyebrow="Challenges" title="What made it hard" icon={Puzzle}>
              <BulletList items={project.challenges} />
            </CaseSection>

            <CaseSection eyebrow="Lessons" title="What I took away" icon={Lightbulb}>
              <BulletList items={project.lessons} />
            </CaseSection>

            <CaseSection eyebrow="Next" title="Where it goes from here" icon={Rocket}>
              <BulletList items={project.futureImprovements} />
            </CaseSection>
          </div>

          {/* aside */}
          <Reveal as="div" className="lg:sticky lg:top-24 lg:self-start">
            <aside className="panel flex flex-col gap-6 rounded-3xl p-6">
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                  Status
                </span>
                <StatusBadge status={project.status} className="w-fit" />
                <p className="pt-1 text-sm leading-relaxed text-muted">
                  {projectStatuses[project.status].description}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-border pt-5">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                  Category
                </span>
                <span className="text-sm text-muted">{categoryLabel(project.category)}</span>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-border pt-5">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                  Timeline
                </span>
                <span className="text-sm text-muted">{project.timeline}</span>
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-5">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">
                  Built with
                </span>
                <ul className="flex flex-wrap gap-1.5">
                  {project.technologies.map((technology) => (
                    <li key={technology}>
                      <TechChip>{technology}</TechChip>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300/90">
                  {project.disclaimer}
                </p>
              </div>
            </aside>
          </Reveal>
        </Container>
      </Section>

      {/* prev / next */}
      <Section bordered className="py-12 sm:py-14">
        <Container className="grid gap-4 sm:grid-cols-2">
          <ProjectNav direction="previous" project={previous} />
          <ProjectNav direction="next" project={next} />
        </Container>
      </Section>

      {/* related */}
      {related.length > 0 ? (
        <Section bordered>
          <Container>
            <SectionHeading
              eyebrow="Keep exploring"
              title="More projects"
              description="A couple of other things I've been working on."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <ProjectCard key={item.slug} project={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaSection />
    </>
  );
}

function CaseSection({
  eyebrow,
  title,
  icon: IconComponent,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-accent">
          <IconComponent className="size-3.5" aria-hidden={true} />
          {eyebrow}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-base leading-relaxed text-muted">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProjectNav({
  direction,
  project,
}: {
  direction: "previous" | "next";
  project: Project;
}) {
  const isNext = direction === "next";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group panel flex flex-col gap-1.5 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40",
        isNext ? "sm:items-end sm:text-right" : "",
      )}
    >
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-faint">
        {!isNext ? <ArrowLeft className="size-3.5" aria-hidden="true" /> : null}
        {isNext ? "Next project" : "Previous project"}
        {isNext ? <ArrowRight className="size-3.5" aria-hidden="true" /> : null}
      </span>
      <span className="text-base font-semibold tracking-tight transition-colors group-hover:text-accent">
        {project.name}
      </span>
      <span className="text-sm text-muted">{project.summary}</span>
    </Link>
  );
}
