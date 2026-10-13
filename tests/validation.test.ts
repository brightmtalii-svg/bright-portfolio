import { describe, expect, it } from "vitest";
import {
  contactSchema,
  formatFieldErrors,
  MESSAGE_MIN_LENGTH,
  sanitizeText,
} from "@/lib/validation";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Hello there, Bright",
  message: "This is a sufficiently long message that passes validation checks.",
  company: "",
};

describe("contactSchema", () => {
  it("accepts a valid submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a message shorter than the minimum", () => {
    const result = contactSchema.safeParse({ ...valid, message: "too short" });
    expect(result.success).toBe(false);
  });

  it("accepts a filled honeypot so the route can silently discard it", () => {
    const result = contactSchema.safeParse({ ...valid, company: "spam" });
    expect(result.success).toBe(true);
  });

  it("exposes the minimum message length constant", () => {
    expect(MESSAGE_MIN_LENGTH).toBe(20);
  });
});

describe("formatFieldErrors", () => {
  it("flattens zod issues into a field -> message map", () => {
    const result = contactSchema.safeParse({ ...valid, name: "A", email: "bad" });
    expect(result.success).toBe(false);
    if (result.success) return;

    const errors = formatFieldErrors(result.error);
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
  });

  it("keeps only the first error per field", () => {
    const result = contactSchema.safeParse({ ...valid, message: "" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(typeof formatFieldErrors(result.error).message).toBe("string");
  });
});

describe("sanitizeText", () => {
  it("strips control characters", () => {
    expect(sanitizeText("hello\u0000world")).toBe("helloworld");
  });

  it("collapses runs of spaces", () => {
    expect(sanitizeText("a    b")).toBe("a b");
  });

  it("trims surrounding whitespace", () => {
    expect(sanitizeText("   padded   ")).toBe("padded");
  });
});
