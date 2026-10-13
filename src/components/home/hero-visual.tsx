"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

interface CodeLine {
  indent?: number;
  tokens: { text: string; tone: "key" | "fn" | "str" | "num" | "comment" | "plain" | "prop" }[];
}

const toneClasses: Record<CodeLine["tokens"][number]["tone"], string> = {
  key: "text-accent-cyan",
  fn: "text-accent",
  str: "text-emerald-500 dark:text-emerald-400",
  num: "text-amber-500 dark:text-amber-300",
  comment: "text-faint italic",
  prop: "text-sky-600 dark:text-sky-300",
  plain: "text-foreground/85",
};

const snippet: CodeLine[] = [
  {
    tokens: [
      { text: "class", tone: "key" },
      { text: " Builder", tone: "fn" },
      { text: ":", tone: "plain" },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: "name", tone: "prop" },
      { text: " = ", tone: "plain" },
      { text: '"Bright Mtalii"', tone: "str" },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: "focus", tone: "prop" },
      { text: " = [", tone: "plain" },
      { text: '"software"', tone: "str" },
      { text: ", ", tone: "plain" },
      { text: '"ai"', tone: "str" },
      { text: ", ", tone: "plain" },
      { text: '"automation"', tone: "str" },
      { text: "]", tone: "plain" },
    ],
  },
  { tokens: [{ text: "", tone: "plain" }] },
  {
    indent: 1,
    tokens: [
      { text: "def", tone: "key" },
      { text: " build", tone: "fn" },
      { text: "(self, idea):", tone: "plain" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: "# turn the idea into something usable", tone: "comment" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: "while", tone: "key" },
      { text: " ", tone: "plain" },
      { text: "curious", tone: "prop" },
      { text: ":", tone: "plain" },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: "return", tone: "key" },
      { text: " ", tone: "plain" },
      { text: "self", tone: "prop" },
      { text: ".", tone: "plain" },
      { text: "ship", tone: "fn" },
      { text: "(idea, tests=", tone: "plain" },
      { text: "True", tone: "num" },
      { text: ")", tone: "plain" },
    ],
  },
];

const floatingBadges = [
  { label: "Python", className: "-left-4 top-16", delay: 0 },
  { label: "Next.js", className: "-right-5 top-8", delay: 0.6 },
  { label: "AI / LLMs", className: "-right-3 bottom-16", delay: 1.2 },
];

/**
 * Hero visual: a code-editor card that tilts gently toward the pointer on
 * devices with a fine pointer. Parallax is disabled entirely for visitors who
 * prefer reduced motion or use a touch device.
 */
export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), {
    stiffness: 120,
    damping: 20,
  });
  const glowX = useTransform(pointerX, [-0.5, 0.5], [35, 65]);
  const glowY = useTransform(pointerY, [-0.5, 0.5], [30, 70]);
  const sheen = useTransform([glowX, glowY], ([x, y]: number[]) => {
    return `radial-gradient(320px circle at ${x}% ${y}%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 62%)`;
  });

  useEffect(() => {
    if (reduceMotion) return;
    const node = containerRef.current;
    if (!node) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    };
    const handleLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerleave", handleLeave);
    return () => {
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-xl [perspective:1400px]"
    >
      {/* ambient gradients */}
      <div
        className="pointer-events-none absolute -inset-10 -z-10 animate-float-slow rounded-[3rem] opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(45% 55% at 30% 25%, var(--glow) 0%, transparent 70%), radial-gradient(40% 50% at 75% 70%, color-mix(in oklab, var(--accent-cyan) 30%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative rounded-3xl border border-border bg-card/90 shadow-card backdrop-blur"
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
      >
        {/* cursor-following sheen */}
        {!reduceMotion ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-60"
            style={{ background: sheen }}
          />
        ) : null}

        {/* window chrome */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-red-500/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="font-mono text-xs text-muted">builder.py</span>
          <span className="ml-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[0.65rem] text-emerald-500 dark:text-emerald-400">
            ● running
          </span>
        </div>

        {/* code */}
        <div className="overflow-hidden px-4 py-4 sm:px-5">
          <pre className="font-mono text-[0.72rem] leading-relaxed sm:text-[0.8rem]">
            <code>
              {snippet.map((line, index) => (
                <span key={index} className="flex gap-4">
                  <span className="w-4 shrink-0 select-none text-right text-faint/60">
                    {index + 1}
                  </span>
                  <span style={{ paddingLeft: `${(line.indent ?? 0) * 1.1}rem` }}>
                    {line.tokens.map((token, tokenIndex) => (
                      <span key={tokenIndex} className={toneClasses[token.tone]}>
                        {token.text}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        </div>

        {/* status bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-4 py-2.5 font-mono text-[0.65rem] text-faint sm:text-xs">
          <span className="text-accent">main</span>
          <span>Python 3</span>
          <span className="ml-auto">no fake commits — learning in public</span>
        </div>
      </motion.div>

      {/* floating chips */}
      {floatingBadges.map((badge) => (
        <motion.span
          key={badge.label}
          className={`absolute hidden rounded-full border border-border-strong bg-surface/95 px-3 py-1.5 font-mono text-xs text-muted shadow-lg backdrop-blur sm:block ${badge.className}`}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduceMotion ? 0 : badge.delay, duration: 0.5 }}
          aria-hidden="true"
        >
          {badge.label}
        </motion.span>
      ))}
    </div>
  );
}
