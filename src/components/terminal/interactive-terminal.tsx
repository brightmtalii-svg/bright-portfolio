"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CornerDownLeft, RotateCcw } from "lucide-react";
import {
  completeInput,
  executeCommand,
  getCompletions,
  pushHistory,
  type CommandResult,
  type TerminalConfig,
} from "@/lib/terminal";
import {
  terminalAliases,
  terminalBanner,
  terminalCommands,
  terminalResponses,
} from "@/data/terminal";
import { person } from "@/data/personal";
import type { TerminalLine } from "@/types";
import { cn } from "@/lib/utils";

const config: TerminalConfig = {
  responses: terminalResponses,
  aliases: terminalAliases,
  commands: terminalCommands,
};

let lineCounter = 0;
function nextId(): number {
  lineCounter += 1;
  return lineCounter;
}

const prompt = `${person.firstName.toLowerCase()}@portfolio:~$`;

export function InteractiveTerminal() {
  const reduceMotion = useReducedMotion();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const bootedRef = useRef(false);

  // Print the banner once on mount.
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    const banner = terminalBanner.map((content, index) => ({
      id: nextId(),
      type: (index === 0 ? "output" : "muted") as TerminalLine["type"],
      content,
    }));
    setLines(banner);
  }, []);

  // Auto-scroll to the latest output.
  useEffect(() => {
    const node = outputRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  function print(entry: { type: TerminalLine["type"]; content: string }): void {
    setLines((current) => [...current, { id: nextId(), type: entry.type, content: entry.content }]);
  }

  function run(raw: string): void {
    const trimmed = raw.trim();
    if (trimmed.length > 0) setHistory((h) => pushHistory(h, trimmed));
    setHistoryIndex(-1);

    print({ type: "input", content: `${prompt} ${raw}` });

    const result = executeCommand(raw, config);
    handleResult(result);
  }

  function handleResult(result: CommandResult): void {
    if (result.kind === "clear") {
      setLines([]);
      return;
    }
    if (result.kind === "none") return;

    const type: TerminalLine["type"] = result.kind === "error" ? "error" : "output";
    for (const content of result.lines) {
      print({ type, content });
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        run(input);
        setInput("");
        break;
      case "ArrowUp": {
        event.preventDefault();
        if (history.length === 0) return;
        const index = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(index);
        setInput(history[index]);
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        if (historyIndex === -1) return;
        const index = historyIndex + 1;
        if (index >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(index);
          setInput(history[index]);
        }
        break;
      }
      case "Tab": {
        event.preventDefault();
        setInput((current) => completeInput(current, config));
        break;
      }
      default:
        break;
    }
  }

  const completions =
    input.trim().length > 0 ? getCompletions(input, config) : [];
  const showHint = focused && completions.length > 0;

  return (
    <div
      className="overflow-hidden rounded-3xl border border-border bg-[#0B0B10] shadow-card dark:border-border"
      onClick={() => inputRef.current?.focus()}
    >
      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-border/70 bg-[#101016] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-red-500/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="font-mono text-xs text-[#8A8A94]">{prompt}</span>
        <button
          type="button"
          onClick={() => setLines([])}
          aria-label="Clear terminal output"
          title="Clear output"
          className="ml-auto grid size-7 place-items-center rounded-md text-[#8A8A94] transition-colors hover:bg-white/10 hover:text-[#FAFAFA]"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      {/* output */}
      <div
        ref={outputRef}
        className="max-h-72 min-h-64 overflow-y-auto overscroll-contain px-4 py-4 font-mono text-[0.78rem] leading-relaxed sm:max-h-80 sm:text-sm"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              className={cn(
                "whitespace-pre-wrap break-words",
                line.type === "input" && "text-[#EDEDF0]",
                line.type === "output" && "text-[#A1A1AA]",
                line.type === "error" && "text-red-400",
                line.type === "muted" && "text-[#5C5C66]",
              )}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.14 }}
            >
              {line.type === "input" ? (
                <span className="flex flex-wrap">
                  <span className="mr-2 text-accent-cyan">{prompt}</span>
                  {line.content.replace(`${prompt} `, "")}
                </span>
              ) : (
                line.content
              )}
            </motion.div>
          ))}

          {/* active input line */}
          <div className="mt-1 flex items-center gap-2 text-[#EDEDF0]">
            <span className="shrink-0 text-accent-cyan">{prompt}</span>
            <span className="relative flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Terminal input"
                aria-autocomplete="list"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                className="w-full bg-transparent text-[#EDEDF0] caret-accent-cyan outline-none placeholder:text-[#5C5C66]"
                placeholder="type 'help' and press Enter"
              />
              <span
                className={cn(
                  "pointer-events-none absolute -right-0 top-1/2 h-4 w-2 -translate-y-1/2 rounded-[1px] bg-accent-cyan",
                  focused ? "opacity-100" : "opacity-0",
                )}
                aria-hidden="true"
              />
            </span>
          </div>
        </AnimatePresence>
      </div>

      {/* completion hint bar */}
      <AnimatePresence>
        {showHint ? (
          <motion.div
            key="hint"
            className="flex flex-wrap items-center gap-1.5 border-t border-border/70 px-4 py-2"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          >
            <CornerDownLeft className="size-3 text-[#5C5C66]" aria-hidden="true" />
            {completions.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => {
                  setInput(candidate);
                  inputRef.current?.focus();
                }}
                className="rounded-md border border-[#232328] bg-[#14141A] px-2 py-0.5 font-mono text-[0.7rem] text-[#A1A1AA] transition-colors hover:border-accent/40 hover:text-[#FAFAFA]"
              >
                {candidate}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* status bar */}
      <div className="flex items-center gap-4 border-t border-border/70 bg-[#101016] px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#5C5C66]">
        <span>↑↓ history</span>
        <span>tab complete</span>
        <span className="ml-auto hidden sm:inline">local · no shell access</span>
      </div>
    </div>
  );
}