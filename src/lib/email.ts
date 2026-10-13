/**
 * Contact form delivery.
 *
 * Providers are implemented with `fetch` only — no SDKs, no extra dependencies:
 *
 *   resend  -> POST https://api.resend.com/emails   (needs RESEND_API_KEY)
 *   webhook -> POST CONTACT_WEBHOOK_URL with JSON   (Formspree, Zapier, Make…)
 *   none    -> development mode: nothing is sent and the API says so honestly
 *
 * Credentials are read from the server environment at call time and are never
 * exposed to the browser bundle.
 */

export type DeliveryProvider = "resend" | "webhook" | "none";

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  meta: {
    submittedAt: string;
    ip: string;
    userAgent: string;
  };
}

export interface DeliveryResult {
  delivered: boolean;
  provider: DeliveryProvider;
  /** Human readable reason, safe to surface in the UI. */
  detail: string;
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

function readProvider(): DeliveryProvider {
  const raw = (process.env.EMAIL_PROVIDER ?? "").trim().toLowerCase();
  if (raw === "resend" || raw === "webhook") return raw;

  // Be forgiving: if a credential exists but EMAIL_PROVIDER was not set,
  // infer the provider rather than silently discarding the message.
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.CONTACT_WEBHOOK_URL) return "webhook";
  return "none";
}

export interface DeliveryConfig {
  provider: DeliveryProvider;
  configured: boolean;
  /** What is missing, for the health of the request and for the docs. */
  missing: string[];
}

export function getDeliveryConfig(): DeliveryConfig {
  const provider = readProvider();
  const missing: string[] = [];

  if (provider === "resend") {
    if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
    if (!process.env.CONTACT_TO_EMAIL) missing.push("CONTACT_TO_EMAIL");
  }

  if (provider === "webhook" && !process.env.CONTACT_WEBHOOK_URL) {
    missing.push("CONTACT_WEBHOOK_URL");
  }

  return { provider, configured: missing.length === 0 && provider !== "none", missing };
}

function buildSubject(message: ContactMessage): string {
  return `[Portfolio] ${message.subject}`;
}

function buildTextBody(message: ContactMessage): string {
  return [
    "New message from the portfolio contact form",
    "",
    `Name:      ${message.name}`,
    `Email:     ${message.email}`,
    `Subject:   ${message.subject}`,
    `Sent at:   ${message.meta.submittedAt}`,
    `IP:        ${message.meta.ip}`,
    "",
    "Message",
    "-------",
    message.message,
    "",
    `User agent: ${message.meta.userAgent}`,
  ].join("\n");
}

function buildHtmlBody(message: ContactMessage): string {
  const rows: [string, string][] = [
    ["Name", message.name],
    ["Email", message.email],
    ["Subject", message.subject],
    ["Sent at", message.meta.submittedAt],
  ];

  return `<!doctype html>
<html><body style="font-family:ui-sans-serif,system-ui,sans-serif;background:#09090b;padding:24px;color:#fafafa">
  <div style="max-width:560px;margin:0 auto;background:#18181f;border:1px solid #2a2a33;border-radius:14px;padding:24px">
    <h1 style="font-size:18px;margin:0 0 4px">New portfolio message</h1>
    <p style="color:#a1a1aa;margin:0 0 20px;font-size:13px">Sent from the contact form</p>
    ${rows
      .map(
        ([label, value]) =>
          `<p style="margin:0 0 6px;font-size:13px"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`,
      )
      .join("\n    ")}
    <hr style="border:none;border-top:1px solid #2a2a33;margin:20px 0" />
    <pre style="white-space:pre-wrap;font-size:14px;line-height:1.6;margin:0">${escapeHtml(message.message)}</pre>
  </div>
</body></html>`;
}

async function sendWithResend(message: ContactMessage): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return {
      delivered: false,
      provider: "resend",
      detail: "Resend credentials are incomplete (RESEND_API_KEY / CONTACT_TO_EMAIL).",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: message.email,
      subject: buildSubject(message),
      text: buildTextBody(message),
      html: buildHtmlBody(message),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return {
      delivered: false,
      provider: "resend",
      detail: `Resend responded with ${response.status}. ${detail.slice(0, 180)}`.trim(),
    };
  }

  return { delivered: true, provider: "resend", detail: "Message delivered via Resend." };
}

async function sendWithWebhook(message: ContactMessage): Promise<DeliveryResult> {
  const url = process.env.CONTACT_WEBHOOK_URL;

  if (!url) {
    return {
      delivered: false,
      provider: "webhook",
      detail: "CONTACT_WEBHOOK_URL is not configured.",
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      submittedAt: message.meta.submittedAt,
      text: buildTextBody(message),
      html: buildHtmlBody(message),
    }),
  });

  if (!response.ok) {
    return {
      delivered: false,
      provider: "webhook",
      detail: `The webhook responded with ${response.status}.`,
    };
  }

  return { delivered: true, provider: "webhook", detail: "Message delivered via webhook." };
}

export async function deliverContactMessage(
  message: ContactMessage,
): Promise<DeliveryResult> {
  const config = getDeliveryConfig();

  if (config.provider === "none" || !config.configured) {
    // Development mode: log so the developer can see the payload, and be honest
    // in the response instead of pretending a delivery happened.
    console.info("[contact] delivery not configured — message was not sent", {
      provider: config.provider,
      missing: config.missing,
      from: message.email,
      subject: message.subject,
      receivedAt: message.meta.submittedAt,
    });

    return {
      delivered: false,
      provider: "none",
      detail:
        "No email provider is configured, so this message was validated but not delivered.",
    };
  }

  try {
    if (config.provider === "resend") return await sendWithResend(message);
    return await sendWithWebhook(message);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown transport error";
    return {
      delivered: false,
      provider: config.provider,
      detail: `Delivery failed: ${reason}`,
    };
  }
}
