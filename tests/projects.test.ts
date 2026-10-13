import { describe, expect, it } from "vitest";
import {
  getFeaturedProjects,
  getProjectBySlug,
  getProjectSlugs,
  getUsedCategories,
  projectCategories,
  projects,
} from "@/data/projects";

describe("project data integrity", () => {
  it("has at least one project and one featured project", () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(getFeaturedProjects().length).toBeGreaterThan(0);
  });

  it("uses unique slugs", () => {
    const slugs = getProjectSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses lowercase, url-safe slugs", () => {
    for (const slug of getProjectSlugs()) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("references only known categories", () => {
    const ids = new Set(projectCategories.map((category) => category.id));
    for (const project of projects) {
      expect(ids.has(project.category)).toBe(true);
    }
  });

  it("provides the fields the UI relies on", () => {
    for (const project of projects) {
      expect(project.name.length).toBeGreaterThan(0);
      expect(project.summary.length).toBeGreaterThan(10);
      expect(project.tagline.length).toBeGreaterThan(0);
      expect(project.technologies.length).toBeGreaterThan(0);
      expect(project.overview.length).toBeGreaterThan(0);
      expect(project.architecture.length).toBeGreaterThan(0);
      expect(project.disclaimer.length).toBeGreaterThan(0);
    }
  });

  it("only exposes links when they are real http(s) URLs", () => {
    for (const project of projects) {
      for (const value of [project.links.github, project.links.live]) {
        if (value !== undefined) {
          expect(value).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("leaves thumbnails null or pointing at /public images", () => {
    for (const project of projects) {
      if (project.thumbnail !== null) {
        expect(project.thumbnail.startsWith("/")).toBe(true);
      }
    }
  });
});

describe("project selectors", () => {
  it("finds a project by slug", () => {
    const slug = getProjectSlugs()[0];
    expect(getProjectBySlug(slug)?.slug).toBe(slug);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("only returns categories that have projects", () => {
    const used = getUsedCategories();
    expect(used.length).toBeGreaterThan(0);
    for (const category of used) {
      expect(projects.some((project) => project.category === category.id)).toBe(true);
    }
  });
});
