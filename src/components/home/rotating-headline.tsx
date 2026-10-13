"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface RotatingHeadlineProps {
  phrases: readonly string[];
  className?: string;
  intervalMs?: number;
}

/**
 * Cycles through the professional headline phrases.
 * The full sentence is exposed to screen readers; the animated span is hidden
 * from them so assistive tech never hears a half-typed word.
 */
export function RotatingHeadline({
  phrases,
  className,
  intervalMs = 2600,
}: RotatingHeadlineProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const fullText = phrases.join(" ");
  const activePhrase = phrases[index] ?? "";

  useEffect(() => {
    if (reduceMotion || phrases.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, phrases.length, reduceMotion]);

  return (
    <p className={cn("relative", className)}>
      <span className="sr-only">{fullText}</span>

      {reduceMotion ? (
        <span aria-hidden="true" className="text-gradient-static">
          {phrases[0]}
        </span>
      ) : (
        <span aria-hidden="true" className="inline-flex flex-wrap items-baseline gap-x-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={activePhrase}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-gradient-static"
            >
              {activePhrase}
            </motion.span>
          </AnimatePresence>
          <span className="inline-block h-[1.1em] w-[2px] animate-caret bg-accent align-middle" />
        </span>
      )}
    </p>
  );
}
