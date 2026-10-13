import { z } from "zod";

/**
 * Schema for the `/api/ask` request body. The client and the server share this
 * so validation can never drift between them.
 */
export const askSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Please enter a question.")
    .max(500, "That question is a little long — keep it under 500 characters."),
});

export type AskInput = z.infer<typeof askSchema>;

export type AskFieldErrors = Partial<Record<keyof AskInput, string>>;

/** Convert a Zod error into a flat `{ field: message }` map for the UI. */
export function formatAskFieldErrors(error: z.ZodError): AskFieldErrors {
  const fieldErrors: AskFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in fieldErrors)) {
      fieldErrors[key as keyof AskInput] = issue.message;
    }
  }
  return fieldErrors;
}