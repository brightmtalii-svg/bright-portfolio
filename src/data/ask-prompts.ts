/**
 * ASSISTANT PROMPTS
 * =================
 * Static copy for the Ask Bright chat UI and the fallback the local engine
 * returns. This file is imported by client components, so it must stay free of
 * Node-only imports (no fs, no server data) — keep it pure strings.
 *
 * The actual answers live in `src/data/knowledge.ts`; edit those answer
 * builders to change what Bright can talk about.
 */

export const assistantGreeting =
  "Hi, I'm Ask Bright — the assistant for this portfolio. " +
  "Ask me about Bright's projects, skills, education, how to contact him, or this site itself. " +
  "If I don't know something, I'll say so honestly instead of making it up.";

export const assistantError =
  "Sorry — I couldn't reach the answer service just now. Please try again in a moment.";

/** Shown as quick one-tap questions for first-time visitors. */
export function suggestedQuestions(): string[] {
  return [
    "Who is Bright?",
    "What projects have you built?",
    "What are your skills?",
    "How can I contact you?",
    "Where do you study?",
    "Are you available for internships?",
  ];
}

/** Returned when no intent matches — never invents facts. */
export const unsupportedAnswer =
  "I don't have an answer for that one, and I'd rather be honest than make something up. " +
  "Try asking about Bright's projects, skills, education, contact details, or availability. " +
  "If it's something more specific, the best route is the contact form on the site.";