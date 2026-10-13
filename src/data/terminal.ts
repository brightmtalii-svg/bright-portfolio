import { person } from "./personal";
import { projects } from "./projects";
import { skills } from "./skills";
import { education } from "./journey";
import { site } from "./site";

/**
 * TERMINAL CONTENT
 * ================
 * The interactive terminal is front-end only — it never touches a shell.
 * Add a new command by adding an entry to `terminalResponses`, its description
 * to `terminalCommandHelp`, and (optionally) an alias to `terminalAliases`.
 */

export const terminalCommandHelp: { command: string; description: string }[] = [
  { command: "help", description: "List the available commands" },
  { command: "about", description: "Who I am and what I work on" },
  { command: "skills", description: "Languages, tools and areas of interest" },
  { command: "projects", description: "Projects currently in progress" },
  { command: "education", description: "Where I study and what I'm learning" },
  { command: "contact", description: "How to get in touch" },
  { command: "clear", description: "Clear the terminal output" },
];

export const terminalAliases: Record<string, string> = {
  "?": "help",
  ls: "projects",
  whoami: "about",
  stack: "skills",
  edu: "education",
  mail: "contact",
  social: "contact",
  cls: "clear",
};

export const terminalCommands: string[] = terminalCommandHelp.map((entry) => entry.command);

const projectList = projects
  .map((project) => `  • ${project.name} — ${project.summary}`)
  .join("\n");

const skillLines = skills
  .map(
    (category) =>
      `  ${category.label}: ${category.skills.map((skill) => skill.name).join(", ")}`,
  )
  .join("\n");

export const terminalResponses: Record<string, string> = {
  help: [
    "Available commands",
    "",
    ...terminalCommandHelp.map(
      (entry) => `  ${entry.command.padEnd(10)} ${entry.description}`,
    ),
    "",
    "Tip: press Tab to complete and ↑ / ↓ to browse your history.",
  ].join("\n"),

  about: [
    `${person.name} — ${site.role}`,
    "",
    person.heroIntro,
    "",
    `  Location      ${person.location}`,
    `  Studying      ${person.degree}, ${person.university}`,
    `  Focus         ${person.focusAreas.slice(0, 4).join(", ")}`,
    `  Availability  ${person.availability.label}`,
  ].join("\n"),

  skills: [`Technologies & interests`, "", skillLines].join("\n"),

  projects: [
    `Projects (${projects.length})`,
    "",
    projectList,
    "",
    "Run `open ./projects` — or visit the Projects page for the full case studies.",
  ].join("\n"),

  education: [
    "Education & learning",
    "",
    `  ${education.degree}`,
    `  ${education.institution} — ${education.location} (${education.status})`,
    "",
    education.summary,
    "",
    "  Also learning through: independent projects, documentation, and",
    "  experiments with AI, automation and robotics.",
  ].join("\n"),

  contact: [
    "Let's connect",
    "",
    ...person.socials.map((social) => `  ${social.label.padEnd(9)} ${social.href}`),
    person.email
      ? `  Email     ${person.email}`
      : "  Email     not configured — use the contact form on /contact",
    "",
    "Use the contact form to send a message directly.",
  ].join("\n"),

  clear: "",
};

export const terminalBanner: string[] = [
  `${person.name} — ${site.role}`,
  "Interactive terminal · front-end only, no shell access.",
  "Type `help` to see what's available.",
];
