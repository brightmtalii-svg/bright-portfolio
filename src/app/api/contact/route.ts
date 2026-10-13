import { NextResponse } from "next/server";
import { deliverContactMessage, type ContactMessage } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, formatFieldErrors, sanitizeText } from "@/lib/validation";
import type { ContactResponse } from "@/types";

const RATE_LIMIT_MAX = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5);
const RATE_LIMIT_WINDOW_MS = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000);

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function json(body: ContactResponse, status: number): NextResponse<ContactResponse> {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(
      { ok: false, code: "invalid", message: "The request body could not be read." },
      400,
    );
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        code: "invalid",
        message: "Please check the highlighted fields and try again.",
        fieldErrors: formatFieldErrors(parsed.error),
      },
      422,
    );
  }

  const data = parsed.data;

  // Honeypot tripped: behave exactly like a success so bots learn nothing,
  // but never deliver anything.
  if (data.company && data.company.length > 0) {
    return json(
      { ok: true, code: "sent", message: "Thanks — your message has been sent." },
      200,
    );
  }

  const ip = clientIp(request);
  const limit = rateLimit(ip, {
    name: "contact",
    max: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!limit.ok) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfterMs / 60000));
    return json(
      {
        ok: false,
        code: "rate-limited",
        message: `Too many messages from this connection. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      },
      429,
    );
  }

  const message: ContactMessage = {
    name: sanitizeText(data.name),
    email: sanitizeText(data.email),
    subject: sanitizeText(data.subject),
    message: sanitizeText(data.message),
    meta: {
      submittedAt: new Date().toISOString(),
      ip,
      userAgent: request.headers.get("user-agent") ?? "unknown",
    },
  };

  const result = await deliverContactMessage(message);

  if (result.delivered) {
    return json(
      {
        ok: true,
        code: "sent",
        message: "Thanks for reaching out — your message is on its way. I'll reply as soon as I can.",
      },
      200,
    );
  }

  if (result.provider === "none") {
    return json(
      {
        ok: true,
        code: "dev-mode",
        message:
          "Message validated, but no email provider is configured yet so nothing was delivered. Set EMAIL_PROVIDER (and its credentials) to enable delivery.",
      },
      200,
    );
  }

  // A provider was configured but the send failed — surface it honestly.
  console.error("[contact] delivery failed", { provider: result.provider, detail: result.detail });

  return json(
    {
      ok: false,
      code: "error",
      message:
        "Something went wrong while sending your message. Please try again shortly, or reach out through GitHub or LinkedIn.",
    },
    502,
  );
}
