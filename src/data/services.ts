import type { Service } from "@/types";

/**
 * WHAT I CAN BUILD
 * ================
 * These describe the areas Bright is developing practical ability in. Each card
 * carries an honest `maturity` label so nothing reads like an established
 * commercial service. Change the copy when the capability genuinely levels up.
 */

export const services: Service[] = [
  {
    id: "python-automation",
    title: "Python Automation",
    description:
      "Turning repetitive manual work into small, dependable scripts — file handling, data cleaning, scheduled routines and command-line tooling.",
    maturity: "Developing capability",
    icon: "terminal",
    deliverables: ["Scripts & CLI tools", "Data processing", "Task automation"],
  },
  {
    id: "web-application-development",
    title: "Web Application Development",
    description:
      "Building responsive interfaces with React and Next.js, backed by clear component structure, accessible markup and honest content architecture.",
    maturity: "Learning by building",
    icon: "layout",
    deliverables: ["Responsive UI", "Component architecture", "Accessible markup"],
  },
  {
    id: "ai-assisted-software",
    title: "AI-Assisted Software Solutions",
    description:
      "Experimenting with language models and intelligent interfaces — prompt design, local model tooling and AI features that stay inspectable.",
    maturity: "Exploratory",
    icon: "brain",
    deliverables: ["Prototype assistants", "Prompt & context design", "Local model tooling"],
  },
  {
    id: "software-prototyping",
    title: "Software Prototyping",
    description:
      "Taking an idea from a sentence to a working prototype so it can be tested early, before effort is spent perfecting the wrong thing.",
    maturity: "Developing capability",
    icon: "blocks",
    deliverables: ["Concept to prototype", "Architecture sketches", "Iterative refinement"],
  },
  {
    id: "technical-problem-solving",
    title: "Technical Problem-Solving",
    description:
      "Breaking a vague problem into parts that can be verified — data modelling, validation, security-minded design and careful debugging.",
    maturity: "Core strength",
    icon: "puzzle",
    deliverables: ["Problem decomposition", "Debugging", "Secure design habits"],
  },
];
