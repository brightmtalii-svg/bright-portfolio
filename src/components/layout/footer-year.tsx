import { cacheLife } from "next/cache";
import { copyrightYear } from "@/lib/utils";

/**
 * The footer copyright year reads `new Date()`, which is an unstable value at
 * prerender time. Wrapping it in `use cache` lets the year be computed once and
 * baked into the static shell instead of forcing the whole page dynamic.
 */
async function getCopyrightYear(): Promise<string> {
  "use cache";
  cacheLife("max");
  return copyrightYear();
}

export async function FooterYear() {
  const year = await getCopyrightYear();
  return <>© {year}</>;
}
