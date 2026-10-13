import { z } from "zod";

/**
 * Contact form schema — shared by the client (react-hook-form resolver) and the
 * server route handler, so validation can never drift between the two.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(80, "That name is a little too long."),
  email: z.email("Enter a valid email address.").max(160, "That email is too long."),
  subject: z
    .string()
    .trim()
    .min(3, "Add a short subject so I know what this is about.")
    .max(120, "Please keep the subject under 120 characters."),
  message: z
    .string()
    .trim()
    .min(20, "Please add a little more detail (at least 20 characters).")
    .max(4000, "Please keep the message under 4000 characters."),
  /**
   * Honeypot. Real people never see this field; bots fill everything.
   *
   * It deliberately accepts any value here so the request still validates: the
   * API route detects a non-empty value and silently returns a fake success,
   * which teaches bots nothing. Rejecting at the schema level would leak the
   * trap through a field error instead.
   */
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Convert a Zod error into a flat `{ field: message }` map for the UI. */
export function formatFieldErrors(error: z.ZodError): ContactFieldErrors {
  const fieldErrors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in fieldErrors)) {
      fieldErrors[key as keyof ContactInput] = issue.message;
    }
  }
  return fieldErrors;
}

export const MESSAGE_MIN_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 4000;

/** Strip control characters and collapse excessive whitespace/newlines. */
export function sanitizeText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}
