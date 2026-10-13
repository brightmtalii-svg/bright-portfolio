"use client";

import { useEffect, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { RotateCcw, Send, X } from "lucide-react";
import { AskMessage, AskAvatar, TypingIndicator } from "@/components/ask/ask-message";
import { suggestedQuestions } from "@/data/ask-prompts";
import { person } from "@/data/personal";
import type { AskChatMessage } from "@/types";
import { cn } from "@/lib/utils";

export interface AskPanelProps {
  messages: AskChatMessage[];
  pending: boolean;
  input: string;
  showSuggestions: boolean;
  /** Id of the single message that should play the typewriter effect. */
  animatedMessageId: string | null;
  panelRef: RefObject<HTMLDivElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (text: string) => void;
  onSuggestion: (question: string) => void;
  onClose: () => void;
  onClear: () => void;
  onPanelKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
}

export function AskPanel({
  messages,
  pending,
  input,
  showSuggestions,
  animatedMessageId,
  panelRef,
  listRef,
  inputRef,
  onInputChange,
  onSubmit,
  onSuggestion,
  onClose,
  onClear,
  onPanelKeyDown,
}: AskPanelProps) {
  // Keep the latest message in view.
  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, pending, listRef]);

  const canSend = input.trim().length > 0 && !pending;

  return (
    <div
      ref={panelRef}
      id="ask-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-panel-title"
      onKeyDown={onPanelKeyDown}
      className={cn(
        "animate-rise fixed bottom-24 right-5 left-5 z-50 flex max-h-[min(36rem,calc(100dvh-8rem))]",
        "w-auto flex-col overflow-hidden rounded-3xl border border-border-strong bg-surface shadow-card-hover sm:right-8 sm:w-[26rem]",
      )}
    >
      {/* gradient hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        aria-hidden="true"
      />

      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <AskAvatar />
        <div className="flex min-w-0 flex-col leading-tight">
          <h2 id="ask-panel-title" className="text-sm font-semibold tracking-tight">
            Ask Bright
          </h2>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
            {person.firstName}&apos;s portfolio · local answers
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onClear}
            disabled={messages.length <= 1}
            aria-label="Clear conversation"
            title="Clear conversation"
            className="grid size-9 place-items-center rounded-full text-faint transition-colors hover:bg-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            title="Close chat"
            className="grid size-9 place-items-center rounded-full text-faint transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-label="Chat with Ask Bright"
        aria-live="polite"
        className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-gutter:stable]"
      >
        {messages.map((message) => (
          <AskMessage
            key={message.id}
            message={message}
            animate={message.id === animatedMessageId}
          />
        ))}
        {pending ? <TypingIndicator /> : null}
      </div>

      {showSuggestions ? (
        <div className="px-4 pb-3">
          <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
            Suggested questions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions().map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onSuggestion(question)}
                disabled={pending}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <form
        className="border-t border-border p-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(input);
        }}
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            aria-label="Ask a question"
            placeholder="Ask me something…"
            autoComplete="off"
            maxLength={500}
            className="h-11 flex-1 rounded-full border border-border-strong bg-card px-4 text-sm text-foreground outline-none placeholder:text-faint focus:border-accent/60"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            title="Send"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground shadow-[0_10px_30px_-12px_var(--glow)] transition-transform duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
          >
            <Send className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 font-mono text-[0.6rem] leading-relaxed text-faint">
          Answered from this site&apos;s own data via /api/ask — no external AI by default.
        </p>
      </form>
    </div>
  );
}