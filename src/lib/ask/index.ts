import { answerQuestion } from "./engine";
import type { AskAnswer } from "@/types";

/**
 * Ask Bright — answer pipeline.
 *
 * This is the single seam between the HTTP route and the answering logic.
 * Today it always answers locally and deterministically. Switching to a real
 * LLM later is a configuration change (`ASK_PROVIDER="llm"` + credentials) —
 * no client code needs to change because the client only ever talks to
 * `/api/ask`.
 */

export type AskResult = {
  provider: "local" | "llm";
  id: string;
  answer: string;
};

/** The built-in deterministic engine. Exported for tests. */
export function askLocal(message: string): AskAnswer {
  return answerQuestion(message);
}

export const askProvider: "local" | "llm" =
  process.env.ASK_PROVIDER?.trim() === "llm" ? "llm" : "local";

export async function ask(message: string): Promise<AskResult> {
  if (askProvider === "llm") {
    const { runLlmAnswer } = await import("./llm");
    return runLlmAnswer(message);
  }

  const result = askLocal(message);
  return {
    provider: "local",
    id: result.id,
    answer: result.answer,
  };
}