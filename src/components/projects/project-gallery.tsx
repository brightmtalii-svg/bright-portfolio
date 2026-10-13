"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { projectCategories, projectStatuses } from "@/data/projects";
import type { Project, ProjectCategory, ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "status" | "name";

const statusOrder: Record<ProjectStatus, number> = {
  "in-development": 0,
  prototype: 1,
  completed: 2,
  concept: 3,
};

function categoryLabel(id: string): string {
  return projectCategories.find((category) => category.id === id)?.label ?? id;
}

export function ProjectGallery({
  projects,
  categories,
}: {
  projects: Project[];
  categories: ProjectCategory[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();

    const result = projects.filter((project) => {
      if (category !== "all" && project.category !== category) return false;
      if (status !== "all" && project.status !== status) return false;
      if (needle.length === 0) return true;

      const haystack = [
        project.name,
        project.summary,
        project.tagline,
        categoryLabel(project.category),
        ...project.technologies,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });

    return result.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "status") return statusOrder[a.status] - statusOrder[b.status];
      if (a.featured === b.featured) return a.name.localeCompare(b.name);
      return a.featured ? -1 : 1;
    });
  }, [projects, category, status, sort, deferredQuery]);

  const isFiltered = category !== "all" || status !== "all" || query.trim().length > 0;

  function reset(): void {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setSort("featured");
  }

  return (
    <div className="flex flex-col gap-8">
      {/* toolbar */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, technologies…"
              aria-label="Search projects"
              className="h-11 w-full rounded-xl border border-border-strong bg-card pl-10 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-faint focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
            />
            {query.length > 0 ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-faint transition-colors hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="sr-only">Filter by status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
                className="h-11 rounded-xl border border-border-strong bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent/60"
              >
                <option value="all">All statuses</option>
                {(Object.keys(projectStatuses) as ProjectStatus[]).map((key) => (
                  <option key={key} value={key}>
                    {projectStatuses[key].label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="sr-only">Sort projects</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-11 rounded-xl border border-border-strong bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent/60"
              >
                <option value="featured">Featured first</option>
                <option value="status">By status</option>
                <option value="name">By name</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterPill active={category === "all"} onClick={() => setCategory("all")}>
            All
          </FilterPill>
          {categories.map((item) => (
            <FilterPill
              key={item.id}
              active={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* results */}
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-faint" aria-live="polite">
          Showing {filtered.length} of {projects.length} project{projects.length === 1 ? "" : "s"}
        </p>
        {isFiltered ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            <X className="size-3.5" aria-hidden="true" />
            Reset filters
          </button>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="panel flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
          <div className="grid size-12 place-items-center rounded-2xl border border-border-strong bg-card text-faint">
            <Search className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium">No projects match those filters.</p>
            <p className="text-sm text-muted">
              Try a broader search or reset the filters to see everything.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-border-strong bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/50"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-accent/50 bg-accent/10 text-accent"
          : "border-border-strong bg-card text-muted hover:border-accent/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}