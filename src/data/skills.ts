import type { SkillCategory, SkillLevel } from "@/types";

/**
 * SKILLS
 * ======
 * Levels are qualitative on purpose — no invented percentages.
 *
 *   practical -> I use this regularly and can complete work with it today.
 *   learning  -> I am actively studying this and use it with guidance or docs.
 *   interest  -> An area I am exploring or intend to go deeper into.
 */

export const skillLevels: Record<
  SkillLevel,
  { label: string; short: string; description: string }
> = {
  practical: {
    label: "Working knowledge",
    short: "Practical",
    description: "Used regularly; can complete real work with it today.",
  },
  learning: {
    label: "Currently learning",
    short: "Learning",
    description: "Actively studying and building with it, with documentation at hand.",
  },
  interest: {
    label: "Area of interest",
    short: "Exploring",
    description: "An area I am deliberately exploring and want to go deeper into.",
  },
};

export const skills: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    description: "Languages I write code in, and how confident I am with each.",
    icon: "braces",
    accent: "purple",
    skills: [
      { name: "Python", level: "practical", note: "Primary language — coursework, automation and projects." },
      { name: "JavaScript", level: "learning", note: "Modern syntax, async patterns and browser APIs." },
      { name: "TypeScript", level: "learning", note: "Types in this portfolio and small typed projects." },
      { name: "C", level: "learning", note: "Coursework; memory and pointer fundamentals." },
      { name: "C++", level: "learning", note: "Coursework; object-oriented fundamentals." },
      { name: "Java", level: "learning", note: "Coursework; classes, collections and OOP practice." },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    description: "Building interfaces that are accessible, responsive and fast.",
    icon: "layout",
    accent: "cyan",
    skills: [
      { name: "HTML5", level: "practical", note: "Semantic structure and accessible markup." },
      { name: "CSS3", level: "practical", note: "Layout, responsive design and modern selectors." },
      { name: "React", level: "learning", note: "Components, hooks and state." },
      { name: "Next.js", level: "learning", note: "App Router, server components and routing." },
      { name: "Tailwind CSS", level: "learning", note: "Utility-first styling and design tokens." },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    description: "Services, APIs and the data behind the interface.",
    icon: "server",
    accent: "purple",
    skills: [
      { name: "Python", level: "practical", note: "Scripts, application logic and validation." },
      { name: "Node.js", level: "learning", note: "Server-side JavaScript fundamentals." },
      { name: "REST APIs", level: "learning", note: "Designing and consuming JSON endpoints." },
    ],
  },
  {
    id: "tools",
    label: "Tools & Environment",
    description: "The daily toolchain I work in.",
    icon: "wrench",
    accent: "cyan",
    skills: [
      { name: "Git", level: "practical", note: "Branching, staging and reviewing history." },
      { name: "GitHub", level: "practical", note: "Repositories, issues and pull requests." },
      { name: "VS Code", level: "practical", note: "Primary editor, extensions and debugging." },
      { name: "Linux", level: "learning", note: "Shell, filesystem and package basics." },
      { name: "Windows", level: "practical", note: "Primary development environment." },
    ],
  },
  {
    id: "interests",
    label: "Areas of Interest",
    description: "Where I want to go next as an engineer — honestly, still early.",
    icon: "brain",
    accent: "purple",
    skills: [
      { name: "Artificial Intelligence", level: "interest", note: "Local models, assistants, evaluation." },
      { name: "Cybersecurity", level: "interest", note: "Secure design, validation, least privilege." },
      { name: "Robotics", level: "interest", note: "Sensors, control loops, embedded software." },
      { name: "Software Architecture", level: "interest", note: "Layered design and clear boundaries." },
      { name: "Automation", level: "interest", note: "Removing repetitive work with scripts." },
    ],
  },
];

/** Flat list used by the skills preview on the home page. */
export const coreTechnologies = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "REST APIs",
  "Git",
  "GitHub",
  "Linux",
  "C",
  "C++",
  "Java",
];
