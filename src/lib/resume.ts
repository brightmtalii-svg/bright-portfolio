import { existsSync } from "node:fs";
import path from "node:path";
import { person } from "@/data/personal";

/**
 * A CV should only be advertised once a real file exists in /public.
 * Shared by the root layout (header/footer buttons) and the Ask Bright
 * assistant, so they can never disagree about whether a résumé exists.
 */
export function isResumeAvailable(): boolean {
  try {
    const relative = person.resume.path.replace(/^\//, "");
    return existsSync(path.join(process.cwd(), "public", relative));
  } catch {
    return false;
  }
}