"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import type { AskChatMessage } from "@/types";

/** Respect the OS reduced-motion preference; default to animating otherwise. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reveals `text` progressively, like an assistant typing it out. */
export function useTypewriter(text: string, run: boolean): string {
  const [reducedMotion] = useState(prefersReducedMotion);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!run || reducedMotion) return;

    // Longer answers type faster so nobody waits around for a wall of text.
    const chunk = Math.max(2, Math.min(12, Math.ceil(text.length / 140)));
    let index = 0;

    const interval = window.setInterval(() => {
      index += chunk;
      setDisplay(text.slice(0, index));
      if (index >= text.length) window.clearInterval(interval);
    }, 20);

    return () => window.clearInterval(interval);
  }, [text, run, reducedMotion]);

  // Static when not animating (history, errors) or when motion is reduced.
  return run && !reducedMotion ? display : text;
}

export function AskAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-cyan font-mono font-semibold text-white",
        size === "sm" && "size-6 text-[0.55rem]",
        size === "md" && "size-9 text-xs",
      )}
      aria-hidden="true"
    >
      {site.monogram}
    </span>
  );
}

/** Animated three-dot "Bright is typing…" indicator. */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2" role="status">
      <AskAvatar size="sm" />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-1.5 animate-bounce rounded-full bg-muted"
            style={{ animationDelay: `${dot * 0.15}s` }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">Bright is typing</span>
      </div>
    </div>
  );
}

export function AskMessage({
  message,
  animate = false,
}: {
  message: AskChatMessage;
  /** Runs the typewriter reveal (currently typing/streamed answers). */
  animate?: boolean;
}) {
  const text = useTypewriter(message.text, animate && !message.error);

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm leading-relaxed text-accent-foreground">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <AskAvatar size="sm" />
      <div
        className={cn(
          "min-w-0 max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md border px-4 py-2.5 text-sm leading-relaxed",
          message.error
            ? "border-red-500/30 bg-red-500/10 text-red-500"
            : "border-border bg-card text-foreground",
        )}
      >
        {text}
      </div>
    </div>
  );
}