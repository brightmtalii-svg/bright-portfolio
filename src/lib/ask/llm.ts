import { person } from "@/data/personal";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

/**
 * Optional LLM provider for Ask Bright.
 *
 * Everything here is server-side only and reads secrets from process env —
 * nothing is ever shipped to the browser. By default the site does NOT use an
 * LLM (`ASK_PROVIDER` is unset, so `/api/ask` answers locally and
 * deterministically). To enable a real model later:
 *
 *   ASK_PROVIDER="llm"
 *   ASK_API_KEY="..."          # any OpenAI-compatible API key
 *   ASK_BASE_URL="..."         # default https://api.openai.com/v1 (LM Studio /
 *                              # Ollama gateways also work here)
 *   ASK_MODEL="..."            # default gpt-4o-mini
 *   ASK_SYSTEM_PROMPT="..."    # optional override
 *
 * The system prompt is assembled from the same `src/data` the local engine
 * uses, so the model is grounded in real portfolio facts and told to stay
 * honest when it doesn't know something.
 */

export class AskLlmError extends Error {}

const ASK_BASE_URL = (process.env.ASK_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
const ASK_MODEL = process.env.ASK_MODEL ?? "gpt-4o-mini";
const ASK_SYSTEM_PROMPT = process.env.ASK_SYSTEM_PROMPT;

function buildSystemPrompt(): string {
  const facts = [
    `Name: ${person.name}`,
    `Role: ${site.role}`,
    person.heroIntro,
    `Studying: ${person.degree} at ${person.university}, ${person.location}`,
    person.availability.label,
    `Projects: ${projects.map((project) => `${project.name} (${project.summary})`).join("; ")}`,
  ].join("\n");

  if (ASK_SYSTEM_PROMPT) return ASK_SYSTEM_PROMPT;

  return [
    `You are Ask Bright, an assistant embedded in ${site.name}'s portfolio.`,
    "Answer questions about Bright using ONLY the facts below. Do not invent",
    "details, projects, experience, certifications or contact information.",
    "If the facts don't cover the question, say you don't know and suggest the",
    "contact form. Keep answers concise and friendly.",
    "",
    "PORTFOLIO FACTS",
    "===============",
    facts,
  ].join("\n");
}

export async function runLlmAnswer(message: string): Promise<{ provider: "llm"; id: string; answer: string }> {
  const apiKey = process.env.ASK_API_KEY;
  if (!apiKey) {
    throw new AskLlmError("ASK_API_KEY is missing — set ASK_PROVIDER=llm together with ASK_API_KEY.");
  }

  const response = await fetch(`${ASK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ASK_MODEL,
      temperature: 0.4,
      max_tokens: 300,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: message.slice(0, 500) },
      ],
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new AskLlmError(`LLM provider returned ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const answer = payload.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    throw new AskLlmError("LLM provider returned an empty answer.");
  }

  return { provider: "llm", id: "llm", answer };
}