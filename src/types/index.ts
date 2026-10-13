/**
 * Shared domain types for the portfolio.
 *
 * Everything rendered by the site is described here so that content can live
 * in `src/data/*` and stay fully decoupled from presentation.
 */

/* ------------------------------- Navigation ------------------------------- */

export interface NavItem {
  /** Route the link points to (must exist in `src/app`). */
  href: string;
  /** Visible label. */
  label: string;
  /** Short description used by the mobile menu. */
  description: string;
  /** Lucide icon key resolved in `src/components/layout/nav-icons.tsx`. */
  icon: string;
}

/* --------------------------------- Projects -------------------------------- */

export type ProjectStatus = "concept" | "in-development" | "prototype" | "completed";

export interface ProjectCategory {
  /** Stable identifier used by the gallery filters. */
  id: string;
  label: string;
  description: string;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ArchitectureLayer {
  title: string;
  description: string;
}

export interface Project {
  /** URL segment: /projects/<slug>. Keep it short, lowercase and unique. */
  slug: string;
  name: string;
  /** Id of one of the entries in `projectCategories`. */
  category: string;
  /** One-line description used on cards and in the sitemap. */
  summary: string;
  /** Longer introduction used at the top of the detail page. */
  tagline: string;
  status: ProjectStatus;
  /** Shown on the card and detail page. Free text, e.g. "2025 — Present". */
  timeline: string;
  /** Whether the project is highlighted on the home page. */
  featured: boolean;
  technologies: string[];
  /**
   * Path to an image inside /public, or `null` to render the generated
   * placeholder artwork instead. See README → "Add project screenshots".
   */
  thumbnail: string | null;
  /**
   * Descriptive alt text for `thumbnail`. Falls back to a generic
   * "<name> preview" when omitted.
   */
  thumbnailAlt?: string;
  /**
   * How the thumbnail was produced, so conceptual art is never presented as a
   * real screenshot. When omitted the UI shows a neutral caption.
   */
  thumbnailKind?: "illustration" | "screenshot";
  screenshots: ProjectScreenshot[];
  links: {
    /** Only rendered when a real, public URL is configured. */
    github?: string;
    live?: string;
  };
  overview: string[];
  problem: string[];
  solution: string[];
  architecture: ArchitectureLayer[];
  features: string[];
  challenges: string[];
  lessons: string[];
  futureImprovements: string[];
  /** Honest note about the maturity of the project. */
  disclaimer: string;
}

/* ---------------------------------- Skills --------------------------------- */

export type SkillLevel = "practical" | "learning" | "interest";

export interface Skill {
  name: string;
  level: SkillLevel;
  /** Optional honest qualifier, e.g. "used in coursework". */
  note?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  icon: string;
  accent: "purple" | "cyan";
  skills: Skill[];
}

/* ---------------------------------- Journey -------------------------------- */

export interface TimelineEntry {
  id: string;
  /** Free text period. Use words such as "Present" until exact dates exist. */
  period: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  /** Highlights the entry as ongoing/current. */
  current?: boolean;
  tags: string[];
}

/* --------------------------------- Services -------------------------------- */

export interface Service {
  id: string;
  title: string;
  description: string;
  /** Honest maturity label shown on the card. */
  maturity: string;
  icon: string;
  deliverables: string[];
}

/* ---------------------------------- Terminal ------------------------------- */

export interface TerminalLine {
  id: number;
  type: "input" | "output" | "error" | "muted";
  content: string;
}

/* ------------------------------- Contact form ------------------------------ */

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot field — must stay empty. */
  company?: string;
}

export interface ContactResponse {
  ok: boolean;
  /** Machine readable status used by the UI. */
  code: "sent" | "queued" | "dev-mode" | "invalid" | "rate-limited" | "error";
  message: string;
  /** Field level errors returned by server-side validation. */
  fieldErrors?: Partial<Record<keyof ContactFormValues, string>>;
}

/* --------------------------------- Ask Bright ------------------------------ */

/** A single knowledge intent the deterministic engine can match. */
export interface AskIntent {
  /** Stable id returned to the client (also used in tests and logs). */
  id: string;
  /**
   * Lowercase phrases / words used to match a question. Single words match on
   * token boundaries (so "hi" never matches inside "this"); multi-word phrases
   * must appear contiguously and count for more when scoring.
   */
  keywords: string[];
  /** Builds the answer from live data — never from hardcoded claims. */
  answer: () => string;
}

/** The deterministic engine's verdict for one question. */
export interface AskAnswer {
  /** Matched intent id, or "fallback" when nothing matched. */
  id: string;
  answer: string;
  /** 0 when unanswered (fallback). Unique among intents for matched answers. */
  score: number;
  /** The keywords that actually matched (useful for tests and debugging). */
  matched: string[];
}

/** Payload sent by the chat UI to `/api/ask`. */
export interface AskRequest {
  message: string;
}

/** Response returned by `/api/ask`. */
export interface AskResponse {
  ok: boolean;
  /** Which engine answered: "local" (deterministic) or "llm" (external). */
  provider: "local" | "llm";
  id: string;
  answer: string;
  error?: string;
  /** Field-level validation errors (invalid payloads only). */
  fieldErrors?: Record<string, string>;
}

/** A rendered chat message in the UI (client-only, session scoped). */
export interface AskChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Shown with the very first assistant reply (first-time visitors). */
  suggestions?: string[];
  /** True when the assistant failed to answer (network/API error). */
  error?: boolean;
}
