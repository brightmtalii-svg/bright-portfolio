import { person } from "./personal";
import { site } from "./site";
import { projectCategories, projectStatuses, projects } from "./projects";
import { skillLevels, skills } from "./skills";
import { education, journey } from "./journey";
import { services } from "./services";
import { isResumeAvailable } from "@/lib/resume";
import type { AskIntent, Project } from "@/types";

/**
 * ASK BRIGHT — KNOWLEDGE BASE
 * ===========================
 * This is the source of truth for everything the assistant can talk about.
 *
 * Rules that keep answers honest:
 *  - Every `answer` builder reads from the existing `src/data/*` files, so
 *    answers can never drift from (or invent) portfolio facts.
 *  - `keywords` are the only thing that decides *when* an intent fires. Add a
 *    phrase and Bright starts understanding that phrasing. They are matched on
 *    word boundaries, so "hi" never matches inside "this".
 *  - Order matters on exact ties (earlier intents win), so specific intents are
 *    listed before generic ones.
 *
 * To teach Bright something new: add an intent below (unique `id`, `keywords`,
 * an `answer` builder over real data) and it is picked up automatically.
 */

/** Extra keyword aliases per project, keyed by slug. */
const projectExtraKeywords: Record<string, string[]> = {
  "bright-ai": ["brightai", "local assistant project"],
  tuchat: ["tu chat"],
  "student-management-system": ["student records"],
  "university-healthcare-management-system": ["healthcare", "healthcare system", "hospital"],
  "robotics-automation": ["robotics and hardware"],
};

function projectIntent(project: Project): AskIntent {
  const category = projectCategories.find((item) => item.id === project.category);
  const statusLabel = projectStatuses[project.status]?.label ?? project.status;
  const label = category?.label ?? project.category;
  const keywords = Array.from(
    new Set([
      project.name.toLowerCase(),
      project.slug.replace(/-/g, " "),
      ...(projectExtraKeywords[project.slug] ?? []).map((alias) => alias.toLowerCase()),
    ]),
  );

  return {
    id: `project-${project.slug}`,
    keywords,
    answer: () =>
      [
        `${project.name}`,
        `  ${statusLabel} · ${project.timeline} · ${label}`,
        "",
        project.tagline || project.summary,
        "",
        `Technologies: ${project.technologies.join(", ")}`,
        "",
        project.disclaimer,
        "",
        `Full write-up: /projects/${project.slug}`,
      ].join("\n"),
  };
}

function skillLine(): string {
  if (skills.length === 0) return "No skills listed yet.";
  return skills
    .map((category) => {
      const detail = category.skills
        .map(
          (skill) =>
            `${skill.name} (${skillLevels[skill.level].short}${
              skill.note ? ` — ${skill.note}` : ""
            })`,
        )
        .join("; ");
      return `• ${category.label}: ${detail}`;
    })
    .join("\n");
}

function timelineLine(): string {
  if (journey.length === 0) return "No journey entries listed yet.";
  return journey
    .map((entry) => `• ${entry.title} — ${entry.period}. ${entry.description}`)
    .join("\n");
}

export const knowledgeIntents: AskIntent[] = [
  {
    id: "greeting",
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"],
    answer: () =>
      [
        "Hello! I'm Ask Bright — the assistant for this portfolio.",
        "",
        `You can ask me about ${site.name}'s projects, skills, education, contact details or availability — or anything else on this site.`,
        "What would you like to know?",
      ].join("\n"),
  },
  {
    id: "identity",
    keywords: ["your name", "what are you called", "what is your name", "what's your name"],
    answer: () => "I'm Ask Bright, a small assistant built into Bright Mtalii's portfolio.".trim(),
  },
  {
    id: "what-are-you",
    keywords: ["are you ai", "are you a robot", "are you human", "are you real", "how do you work"],
    answer: () =>
      "I'm a local, deterministic assistant. By default no LLM or external AI service processes this conversation — answers are generated on this server from Bright's own portfolio data via /api/ask. The architecture is ready to switch to a real model later, but that stays optional and server-side.".trim(),
  },
  ...projects.map(projectIntent),
  {
    id: "project-count",
    keywords: ["how many projects", "number of projects", "project count", "count"],
    answer: () => {
      const names = projects.map((project) => project.name).join(", ");
      return `Bright has ${projects.length} public project${
        projects.length === 1 ? "" : "s"
      } on this site: ${names}.`;
    },
  },
  {
    id: "best-language",
    keywords: [
      "favorite language",
      "primary language",
      "best language",
      "preferred language",
      "language do you prefer",
      "main language",
      "python",
    ],
    answer: () => {
      const python = skills.flatMap((category) => category.skills).find((skill) => skill.name === "Python");
      const note = python?.note ? ` ${python.note}` : "";
      return `Bright's primary programming language is Python — level: ${skillLevels.practical.short}.${note} He also works with JavaScript, TypeScript and C-family languages through coursework.`;
    },
  },
  {
    id: "ai",
    keywords: [
      "artificial intelligence",
      "ai",
      "machine learning",
      "language models",
      "llm",
      "intelligent systems",
    ],
    answer: () => {
      const experiment = journey.find((entry) => entry.id === "artificial-intelligence");
      const project = projects.find((item) => item.slug === "bright-ai");
      return [
        "Artificial intelligence is one of Bright's main interests.",
        "",
        experiment ? `${experiment.subtitle}: ${experiment.description}` : "",
        "",
        project
          ? `He's exploring it hands-on through the "Bright AI" project — ${project.summary}`
          : "",
        "",
        "It's an area of interest, not a marketed skill yet.",
      ]
        .filter(Boolean)
        .join("\n");
    },
  },
  {
    id: "cybersecurity",
    keywords: ["cyber security", "cybersecurity", "security", "hacking", "pentest", "data protection"],
    answer: () => {
      const trait = person.traits.find((item) => item.icon === "shield");
      return [
        "Bright is deliberately security-minded for a student.",
        "",
        trait ? `${trait.title}: ${trait.description}` : "",
        "He studies secure validation, least privilege and safe failure — it's an area of interest rather than a certification.",
      ]
        .filter(Boolean)
        .join("\n");
    },
  },
  {
    id: "robotics",
    keywords: ["robotics", "robots", "microcontrollers", "sensors", "hardware", "embedded"],
    answer: () => {
      const entry = journey.find((item) => item.id === "robotics-and-technology");
      return [
        "Bright explores robotics and embedded systems.",
        "",
        entry ? `${entry.subtitle}: ${entry.description}` : "",
        "",
        "Software that has to work in the physical world, where sensors lie and timing is everything.",
      ]
        .filter(Boolean)
        .join("\n");
    },
  },
  {
    id: "this-site",
    keywords: [
      "built with",
      "tech stack",
      "technology stack",
      "what is this website built with",
      "frameworks",
      "what powers this",
    ],
    answer: () =>
      [
        "This portfolio runs on the Next.js App Router (Next 16 + React 19) with TypeScript, Tailwind CSS v4 and Motion for the animations.",
        "",
        "Content lives in src/data and renders across the site — the project gallery, the interactive terminal, the contact API and this assistant all read from the same files.",
        "",
        "The contact endpoint (/api/contact) validates with Zod, rate-limits requests and can deliver via a provider; /api/ask is the assistant's server-side endpoint.",
      ].join("\n"),
  },
  {
    id: "contact",
    keywords: [
      "contact",
      "email",
      "email address",
      "get in touch",
      "reach out",
      "send a message",
      "github",
      "linkedin",
      "social",
      "socials",
      "hire me",
    ],
    answer: () => {
      const socialLines = person.socials.map((social) => `  ${social.label.padEnd(9)} ${social.href}`);
      const emailLine = person.email
        ? `  Email     ${person.email}`
        : "  Email     not shown here — use the contact form";
      return ["Here's how to reach Bright:", "", ...socialLines, emailLine, "", "Contact form: /contact"].join("\n");
    },
  },
  {
    id: "location",
    keywords: [
      "location",
      "where do you live",
      "where are you from",
      "where are you located",
      "where are you based",
      "based",
      "country",
      "based in",
      "kenya",
      "city",
    ],
    answer: () => `Bright is based in ${person.location}, where he studies at ${person.university}.`,
  },
  {
    id: "resume",
    keywords: ["resume", "cv", "curriculum vitae", "download cv", "cover letter"],
    answer: () => {
      if (isResumeAvailable()) {
        return `Yes — Bright's CV is available at ${person.resume.path} (downloaded as ${person.resume.fileName}).`;
      }
      return "Not yet — no résumé is published on this site yet (only a real file is ever linked, never a placeholder). Ask through the contact form and Bright will share one.";
    },
  },
  {
    id: "availability",
    keywords: [
      "available",
      "availability",
      "internship",
      "internships",
      "collaboration",
      "collaborate",
      "hire",
      "hiring",
      "work with",
      "opportunities",
      "opportunity",
    ],
    answer: () =>
      [
        `Availability: ${person.availability.label}.`,
        "",
        person.availability.detail,
        "",
        "The best way to start a conversation is the contact form.",
      ].join("\n"),
  },
  {
    id: "experience",
    keywords: [
      "experience",
      "work experience",
      "employment",
      "employed",
      "job",
      "jobs",
      "career",
      "work history",
      "positions",
    ],
    answer: () =>
      [
        "Bright is at the beginning of his engineering path: he's a full-time Information Technology student and isn't currently employed.",
        "",
        "The portfolio deliberately lists no employment history, awards or certifications — those pages will stay honest until real milestones exist.",
        "",
        "What he offers today is recorded in his availability note: open to learning opportunities, internships and collaboration.",
      ].join("\n"),
  },
  {
    id: "credentials",
    keywords: ["certification", "certifications", "certificate", "award", "awards", "achievements", "credentials"],
    answer: () =>
      "No certifications or awards are listed — Bright's portfolio refuses to invent any. Check the site again as real milestones are added, or ask through the contact form.".trim(),
  },
  {
    id: "personal-details",
    keywords: ["age", "how old", "phone", "phone number", "salary", "birthday", "home address", "net worth"],
    answer: () =>
      "I don't have that and I won't make it up. Private details like age, phone number, salary or exact dates aren't part of this portfolio. If it matters, the contact form is the right channel.".trim(),
  },
  {
    id: "interests",
    keywords: ["interests", "interest", "passion", "hobbies", "what are you into", "focus areas"],
    answer: () => {
      const focus = person.focusAreas.join(", ");
      const serviceTitles = services.map((service) => service.title).join("; ");
      return `Bright's focus areas: ${focus}.\n\nAreas he's building practical ability in: ${serviceTitles}.`;
    },
  },
  {
    id: "skills",
    keywords: ["skills", "skill", "technologies", "technologies you use", "stack", "tools", "languages"],
    answer: () => `Here are Bright's skills by group (levels are qualitative — no invented percentages):\n\n${skillLine()}`,
  },
  {
    id: "services",
    keywords: ["services", "offering", "what do you offer", "can you build", "build for you", "freelance", "commercial", "deliverables"],
    answer: () => {
      const lines = services.map(
        (service) => `• ${service.title} (${service.maturity}) — ${service.description}`,
      );
      return [`What Bright is developing practical ability in:`, "", ...lines, "", "Note the honest maturity labels — these are capability areas, not established commercial services."].join("\n");
    },
  },
  {
    id: "education",
    keywords: [
      "education",
      "degree",
      "university",
      "college",
      "study",
      "studies",
      "studying",
      "school",
      "coursework",
      "course",
      "bsc",
    ],
    answer: () =>
      [
        `${education.degree}`,
        `${education.institution} — ${education.location} (${education.status})`,
        "",
        education.summary,
      ].join("\n"),
  },
  {
    id: "learning",
    keywords: ["learning", "journey", "timeline", "what are you learning", "roadmap", "growth"],
    answer: () => `Here's Bright's educational and growth journey:\n\n${timelineLine()}`,
  },
  {
    id: "capabilities",
    keywords: [
      "help",
      "what can you do",
      "what can you answer",
      "how do you work",
      "commands",
      "capabilities",
      "what do you know",
      "what do you do",
      "guide me",
    ],
    answer: () =>
      [
        "I can answer from Bright's portfolio: his background, projects, skills, education, contact details, availability and more — plus this site's tech stack.",
        "",
        "Ask naturally, tap a suggestion below, or try phrases like \"what projects has Bright built?\".",
      ].join("\n"),
  },
  {
    id: "projects",
    keywords: ["projects", "project", "built", "what have you built", "portfolio projects", "things you've built", "work"],
    answer: () =>
      [
        `Bright has ${projects.length} public project${projects.length === 1 ? "" : "s"}:`,
        "",
        ...projects.map((project) => {
          const status = projectStatuses[project.status]?.label ?? project.status;
          return `• ${project.name} — ${status}. ${project.summary}`;
        }),
        "",
        "Ask about any by name for the full story, or visit /projects.",
      ].join("\n"),
  },
  {
    id: "thanks",
    keywords: ["thank you", "thanks", "thx", "appreciate it"],
    answer: () => "You're welcome! Ask me anything else about Bright or the portfolio.",
  },
  {
    id: "farewell",
    keywords: ["bye", "goodbye", "see you", "cya", "good night"],
    answer: () => "Anytime — see you around. Bright's contact page is open if you want to reach out.",
  },
  {
    id: "about",
    keywords: [
      "who are you",
      "who is bright",
      "who is bright mtalii",
      "tell me about yourself",
      "tell me about bright",
      "introduce yourself",
      "about yourself",
      "about you",
      "about him",
      "who is he",
      "who is the developer",
      "background",
      "who built this",
    ],
    answer: () =>
      [
        `${person.name} — ${site.role}`,
        "",
        person.heroIntro,
        "",
        `  Studying    ${person.degree}, ${person.university} (${person.location})`,
        `  Focus       ${person.focusAreas.slice(0, 4).join(", ")}`,
        `  Availability ${person.availability.label}`,
        "",
        "Ask me about his projects, skills or education — or read the full story on the About page.",
      ].join("\n"),
  },
];