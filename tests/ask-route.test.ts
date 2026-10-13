// @vitest-environment node
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/ask/route";
import type { AskResponse } from "@/types";

function ask(body: string): Promise<Response> {
  return POST(
    new Request("http://localhost/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }),
  );
}

describe("POST /api/ask", () => {
  it("answers a valid question with the local engine", async () => {
    const response = await ask(JSON.stringify({ message: "Who is Bright?" }));
    expect(response.status).toBe(200);

    const body = (await response.json()) as AskResponse;
    expect(body.ok).toBe(true);
    expect(body.provider).toBe("local");
    expect(body.id).toBe("about");
    expect(body.answer.length).toBeGreaterThan(0);
  });

  it("rejects an empty message with field errors", async () => {
    const response = await ask(JSON.stringify({ message: "   " }));
    expect(response.status).toBe(422);

    const body = (await response.json()) as AskResponse;
    expect(body.ok).toBe(false);
    expect(body.fieldErrors?.message).toBeTruthy();
  });

  it("rejects an over-long message", async () => {
    const response = await ask(JSON.stringify({ message: "a".repeat(501) }));
    expect(response.status).toBe(422);
  });

  it("rejects a malformed body", async () => {
    const response = await ask("not json");
    expect(response.status).toBe(400);
  });

  it("rate-limits a flood of questions", async () => {
    let sawRateLimit = false;
    for (let index = 0; index < 40 && !sawRateLimit; index += 1) {
      const response = await ask(JSON.stringify({ message: "hi" }));
      if (response.status === 429) sawRateLimit = true;
    }
    // Default window is generous (30/min) so this only trips near the end.
    expect(sawRateLimit).toBe(true);
  });
});