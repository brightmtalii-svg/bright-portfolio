import { describe, expect, it } from "vitest";
import { answerQuestion, keywordWeight, matchesKeyword, normalize, tokens } from "@/lib/ask/engine";
import { knowledgeIntents } from "@/data/knowledge";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

describe("normalize / tokens", () => {
  it("lowercases, strips accents and punctuation", () => {
    expect(normalize("  Who's Bright?  ")).toBe("who s bright");
    expect(normalize("Résumé")).toBe("resume");
  });

  it("tokenizes into words and returns nothing for blank input", () => {
    expect(tokens("Tell me about AI!")).toEqual(["tell", "me", "about", "ai"]);
    expect(tokens("   ")).toEqual([]);
  });
});

describe("matchesKeyword", () => {
  it("matches single words on token boundaries, never inside a word", () => {
    expect(matchesKeyword(tokens("hi there"), "hi")).toBe(true);
    expect(matchesKeyword(tokens("this is a test"), "hi")).toBe(false);
  });

  it("requires phrases to appear contiguously", () => {
    expect(matchesKeyword(tokens("tell me about bright ai"), "bright ai")).toBe(true);
    expect(matchesKeyword(tokens("bright and eager ai"), "bright ai")).toBe(false);
  });
});

describe("keywordWeight", () => {
  it("ignores filler words so generic phrases don't outrank specific ones", () => {
    expect(keywordWeight("tell me about bright")).toBe(1);
    expect(keywordWeight("bright ai")).toBe(2);
    expect(keywordWeight("who are you")).toBe(1);
  });
});

describe("answerQuestion — intent routing", () => {
  const cases: Array<[string, string]> = [
    ["hello there", "greeting"],
    ["hi", "greeting"],
    ["What's your name?", "identity"],
    ["are you a robot?", "what-are-you"],
    ["Who is Bright?", "about"],
    ["tell me about Bright Mtalii", "about"],
    ["what projects have you built?", "projects"],
    ["how many projects do you have?", "project-count"],
    ["tell me about Bright AI", "project-bright-ai"],
    ["what is TUCHAT", "project-tuchat"],
    ["tell me about the student management system", "project-student-management-system"],
    ["tell me about the healthcare system", "project-university-healthcare-management-system"],
    ["what about robotics", "robotics"],
    ["what are your skills?", "skills"],
    ["what languages do you know?", "skills"],
    ["which language do you prefer?", "best-language"],
    ["do you work with AI?", "ai"],
    ["do you know cybersecurity?", "cybersecurity"],
    ["where do you study?", "education"],
    ["tell me about your education", "education"],
    ["how can I contact you?", "contact"],
    ["what's your email?", "contact"],
    ["where are you based?", "location"],
    ["what are your interests?", "interests"],
    ["are you available for internships?", "availability"],
    ["do you have work experience?", "experience"],
    ["do you have any certifications?", "credentials"],
    ["how old are you?", "personal-details"],
    ["what is this website built with?", "this-site"],
    ["do you have a CV?", "resume"],
    ["what do you offer?", "services"],
    ["what can you do?", "capabilities"],
    ["thanks!", "thanks"],
    ["bye", "farewell"],
    ["what's your favorite color?", "fallback"],
    ["asdfghjkl", "fallback"],
  ];

  it.each(cases)("routes %j to %s", (question, id) => {
    expect(answerQuestion(question).id).toBe(id);
  });

  it("returns the fallback for empty input, without inventing anything", () => {
    const result = answerQuestion("   ");
    expect(result.id).toBe("fallback");
    expect(result.score).toBe(0);
    expect(result.answer.toLowerCase()).toContain("don't have an answer");
  });
});

describe("answerQuestion — grounding (no fabrication)", () => {
  it("lists every real project by name in the projects answer", () => {
    const answer = answerQuestion("what projects have you built?").answer;
    for (const project of projects) {
      expect(answer).toContain(project.name);
    }
    expect(answer).toContain(String(projects.length));
  });

  it("answers about a project only from that project's own data", () => {
    const project = projects.find((item) => item.slug === "bright-ai")!;
    const answer = answerQuestion("tell me about Bright AI").answer;
    expect(answer).toContain(project.name);
    expect(answer).toContain(project.disclaimer);
    expect(answer).toContain(`/projects/${project.slug}`);
  });

  it("covers every skill group when asked about skills", () => {
    const answer = answerQuestion("what are your skills?").answer;
    for (const category of skills) {
      expect(answer).toContain(category.label);
    }
  });

  it("is deterministic for the same question", () => {
    const first = answerQuestion("tell me about your education").answer;
    const second = answerQuestion("tell me about your education").answer;
    expect(first).toBe(second);
  });

  it("never returns an empty answer for any intent", () => {
    for (const intent of knowledgeIntents) {
      expect(intent.answer().trim().length).toBeGreaterThan(0);
    }
  });

  it("has unique intent ids", () => {
    const ids = knowledgeIntents.map((intent) => intent.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});