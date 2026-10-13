import { NextResponse } from "next/server";
import { ask, askProvider } from "@/lib/ask";
import { askSchema, formatAskFieldErrors } from "@/lib/ask/validation";
import { rateLimit } from "@/lib/rate-limit";
import type { AskResponse } from "@/types";

const RATE_LIMIT_MAX = Number(process.env.ASK_RATE_LIMIT_MAX ?? 30);
const RATE_LIMIT_WINDOW_MS = Number(process.env.ASK_RATE_LIMIT_WINDOW_MS ?? 60_000);

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function json(body: AskResponse, status: number): NextResponse<AskResponse> {
  return NextResponse.json(body, { status });
}

/**
 * POST /api/ask
 *
 * The single server-side entry point for the Ask Bright assistant. Today it
 * runs the local deterministic engine; when ASK_PROVIDER="llm" is configured
 * it delegates to an external model instead. Either way the client never
 * holds a key and only this endpoint talks to a provider.
 */
export async function POST(request: Request): Promise<NextResponse<AskResponse>> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(
      { ok: false, provider: askProvider, id: "error", answer: "", error: "The request body could not be read." },
      400,
    );
  }

  const parsed = askSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        provider: askProvider,
        id: "invalid",
        answer: "",
        error: "Please check the highlighted fields and try again.",
        fieldErrors: formatAskFieldErrors(parsed.error),
      },
      422,
    );
  }

  const limit = rateLimit(clientIp(request), {
    name: "ask",
    max: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!limit.ok) {
    const seconds = Math.max(1, Math.ceil(limit.retryAfterMs / 1000));
    return json(
      {
        ok: false,
        provider: askProvider,
        id: "rate-limited",
        answer: "",
        error: `Too many questions from this connection. Please wait about ${seconds} seconds and try again.`,
      },
      429,
    );
  }

  try {
    const result = await ask(parsed.data.message);
    return json({ ok: true, provider: result.provider, id: result.id, answer: result.answer }, 200);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("[ask] answering failed", { provider: askProvider, detail });
    return json(
      {
        ok: false,
        provider: askProvider,
        id: "error",
        answer: "",
        error:
          "The assistant failed to answer right now. Please try again shortly, or use the contact form.",
      },
      502,
    );
  }
}