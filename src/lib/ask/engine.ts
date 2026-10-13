import { unsupportedAnswer } from "@/data/ask-prompts";
import { knowledgeIntents } from "@/data/knowledge";
import type { AskAnswer, AskIntent } from "@/types";

/**
 * Deterministic question-answering engine for Ask Bright.
 *
 * Matching is pure and keyword-based: a question is normalized to lowercase
 * word tokens (accents and punctuation removed), then every intent is scored
 * by how many of its keywords appear. Multi-word phrases must appear
 * contiguously and count for more than single words, so "bright ai" beats a
 * generic "bright" match.
 *
 * The best-scoring intent wins. On a tie the longer phrase wins, then the one
 * with more distinct matches, then the earlier intent (so specific intents are
 * listed before generic ones in the knowledge base). No match above zero
 * falls back to the unsupported answer — which never invents facts.
 */

interface ScoredAskAnswer extends AskAnswer {
  /** Length of the longest matched keyword, used as a tie-breaker. */
  longestMatch: number;
}

/**
 * Filler words ignored when weighting a match. A phrase like
 * "tell me about bright" is really just the noun "bright", so it must NOT
 * outrank the much more specific "bright ai" phrase in another intent.
 * Matching still uses the full phrase; these only affect the score.
 */
const STOPWORDS = new Set([
  "a", "an", "the", "do", "does", "did", "is", "are", "am", "was", "were", "be", "been",
  "you", "your", "yours", "yourself", "i", "me", "my", "we", "he", "she", "they", "it", "its",
  "can", "could", "would", "should", "will", "tell", "about", "of", "to", "in", "on", "at",
  "for", "with", "and", "or", "but", "what", "whats", "how", "who", "whom", "whose", "where",
  "when", "why", "which", "have", "has", "had", "that", "this", "these", "those", "there",
  "here", "please", "some", "any", "more", "so", "just", "get", "got", "give", "know", "let",
]);

/** Lowercase, diacritics-stripped, punctuation-free, collapsed whitespace. */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalized word tokens of a piece of text. */
export function tokens(value: string): string[] {
  const normalized = normalize(value);
  return normalized.length > 0 ? normalized.split(" ") : [];
}

/** Keyword weight = number of meaningful (non-filler) tokens, minimum 1. */
export function keywordWeight(keyword: string): number {
  const meaningful = tokens(keyword).filter((token) => !STOPWORDS.has(token));
  return Math.max(1, meaningful.length);
}

/** True when a keyword's tokens appear contiguously inside the query tokens. */
export function matchesKeyword(queryTokens: string[], keyword: string): boolean {
  const parts = tokens(keyword);
  if (parts.length === 0 || parts.length > queryTokens.length) return false;

  if (parts.length === 1) return queryTokens.includes(parts[0]);

  for (let i = 0; i <= queryTokens.length - parts.length; i += 1) {
    let j = 0;
    while (j < parts.length && queryTokens[i + j] === parts[j]) j += 1;
    if (j === parts.length) return true;
  }
  return false;
}

export function answerQuestion(
  question: string,
  intents: AskIntent[] = knowledgeIntents,
): AskAnswer {
  const queryTokens = tokens(question);
  if (queryTokens.length === 0) {
    return { id: "fallback", answer: unsupportedAnswer, score: 0, matched: [] };
  }

  let best: ScoredAskAnswer | null = null;

  for (const intent of intents) {
    let score = 0;
    let longest = 0;
    const matched: string[] = [];

    for (const keyword of intent.keywords) {
      const weight = keywordWeight(keyword);
      if (weight > 0 && matchesKeyword(queryTokens, keyword)) {
        score += weight;
        longest = Math.max(longest, weight);
        matched.push(keyword);
      }
    }

    if (score === 0) continue;

    const isBetter =
      best === null ||
      score > best.score ||
      (score === best.score &&
        (longest > best.longestMatch ||
          (longest === best.longestMatch && matched.length > best.matched.length)));

    if (isBetter) {
      best = {
        id: intent.id,
        answer: intent.answer(),
        score,
        longestMatch: longest,
        matched,
      };
    }
  }

  if (!best) {
    return { id: "fallback", answer: unsupportedAnswer, score: 0, matched: [] };
  }

  return { id: best.id, answer: best.answer, score: best.score, matched: best.matched };
}