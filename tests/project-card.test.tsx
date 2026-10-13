import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/project-card";
import { projectCategories, projects } from "@/data/projects";

const project = projects[0];

function categoryLabel(id: string): string {
  return projectCategories.find((category) => category.id === id)?.label ?? id;
}

describe("ProjectCard", () => {
  it("renders the project name, summary and category", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByRole("heading", { name: project.name })).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();
    expect(screen.getByText(categoryLabel(project.category))).toBeInTheDocument();
  });

  it("links to the project detail page", () => {
    render(<ProjectCard project={project} />);

    const links = screen.getAllByRole("link", { name: project.name });
    expect(links.some((link) => link.getAttribute("href") === `/projects/${project.slug}`)).toBe(
      true,
    );
  });

  it("renders the generated placeholder artwork when no thumbnail is set", () => {
    const withoutThumbnail = { ...project, thumbnail: null };
    const { container } = render(<ProjectCard project={withoutThumbnail} />);

    expect(within(container).queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("View details")).toBeInTheDocument();
  });

  it("shows a featured badge for featured projects", () => {
    const featured = { ...project, featured: true };
    render(<ProjectCard project={featured} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });
});
