import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { GitHubIcon } from "@/components/ui/brand-icons";
import { TechChip } from "@/components/projects/tech-chip";
import { StatusBadge } from "@/components/projects/status-badge";
import { ProjectThumbnail } from "@/components/projects/project-thumbnail";
import { projectCategories } from "@/data/projects";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

function categoryLabel(id: string): string {
  return projectCategories.find((category) => category.id === id)?.label ?? id;
}

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const maxTech = 4;
  const tech = project.technologies.slice(0, maxTech);
  const remaining = project.technologies.length - tech.length;

  return (
    <article
      className={cn(
        "group panel relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300",
        "hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover",
        className,
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.thumbnailAlt ?? `${project.name} preview`}
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ProjectThumbnail project={project} />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[0.7rem] font-medium text-muted">
            {categoryLabel(project.category)}
          </span>
          <StatusBadge status={project.status} withDescription />
          {project.featured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-accent">
              <Star className="size-3" aria-hidden="true" />
              Featured
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold tracking-tight">
            <Link
              href={`/projects/${project.slug}`}
              className="outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-2 focus-visible:after:ring-accent"
            >
              {project.name}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-muted">{project.summary}</p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {tech.map((item) => (
            <li key={item}>
              <TechChip>{item}</TechChip>
            </li>
          ))}
          {remaining > 0 ? (
            <li>
              <TechChip className="text-faint">+{remaining}</TechChip>
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            View details
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>

          <div className="relative z-10 flex items-center gap-1.5">
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} on GitHub`}
                className="grid size-8 place-items-center rounded-lg border border-border bg-card text-muted transition-colors hover:border-accent/50 hover:text-foreground"
              >
                <GitHubIcon className="size-4" />
              </a>
            ) : null}
            {project.links.live ? (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open the ${project.name} live site`}
                className="grid size-8 place-items-center rounded-lg border border-border bg-card text-muted transition-colors hover:border-accent/50 hover:text-foreground"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
