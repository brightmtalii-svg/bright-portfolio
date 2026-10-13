"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Floating back-to-top button that appears after the first screenful. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-24 right-5 z-40 grid size-11 place-items-center rounded-full border border-border-strong",
        "bg-card/90 text-muted shadow-lg backdrop-blur transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground sm:right-8",
      )}
    >
      <ArrowUp className="size-4" strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
