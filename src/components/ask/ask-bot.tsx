"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Sparkles, X } from "lucide-react";
import { AskPanel } from "@/components/ask/ask-panel";
import { assistantError, assistantGreeting, suggestedQuestions } from "@/data/ask-prompts";
import type { AskChatMessage, AskResponse } from "@/types";
import { cn } from "@/lib/utils";

/** Ask Bright history is scoped to the current browser session (tab). */
const HISTORY_KEY = "bm-ask-session";
const MAX_HISTORY = 40;

function createGreeting(): AskChatMessage {
  return {
    id: "greeting",
    role: "assistant",
    text: assistantGreeting,
    suggestions: suggestedQuestions(),
  };
}

/** Restores this tab's previous conversation (worst case the fresh greeting). */
function createInitialMessages(): AskChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [createGreeting()];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [createGreeting()];

    const restored: AskChatMessage[] = [];
    for (const item of parsed.slice(-MAX_HISTORY)) {
      if (
        item &&
        typeof item === "object" &&
        "text" in item &&
        typeof (item as { text: unknown }).text === "string" &&
        ("role" in item && (item.role === "user" || item.role === "assistant"))
      ) {
        const message = item as { role: "user" | "assistant"; text: string };
        restored.push({ id: `session-${restored.length}`, role: message.role, text: message.text });
      }
    }
    return restored.length > 0 ? restored : [createGreeting()];
  } catch {
    /* corrupt or unavailable storage — keep the fresh greeting */
    return [createGreeting()];
  }
}

export function AskBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AskChatMessage[]>(createInitialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [animatedMessageId, setAnimatedMessageId] = useState<string | null>(null);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);

  const nextId = useCallback(() => `ask-${(idRef.current += 1)}`, []);

  // Persist the conversation for the session.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(messages.map(({ role, text }) => ({ role, text }))),
      );
    } catch {
      /* storage unavailable — the in-memory history still works */
    }
  }, [messages]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (text.length === 0 || pending) return;

      setMessages((current) => [...current, { id: nextId(), role: "user", text }]);
      setInput("");
      setPending(true);
      inputRef.current?.focus();

      let response: AskResponse | null = null;
      try {
        const result = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        const parsed: unknown = await result.json().catch(() => null);
        if (result.ok && parsed && typeof parsed === "object" && "answer" in parsed) {
          response = parsed as AskResponse;
        } else if (!result.ok && parsed && typeof parsed === "object" && "error" in parsed) {
          response = parsed as AskResponse;
        }
      } catch {
        /* network failure — handled below with the fallback error */
      }

      const answer = response && !response.ok && response.error ? response.error : response?.answer;
      const answerText = answer && answer.length > 0 ? answer : assistantError;
      const answerId = nextId();
      setMessages((current) => [
        ...current,
        {
          id: answerId,
          role: "assistant",
          text: answerText,
          error: response?.ok === false,
        },
      ]);
      setAnimatedMessageId(answerId);
      setPending(false);
      inputRef.current?.focus();
    },
    [pending, nextId],
  );

  const openChat = useCallback(() => setOpen(true), []);

  const closeChat = useCallback(() => {
    setOpen(false);
    setPending(false);
    setAnimatedMessageId(null);
    launcherRef.current?.focus();
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([createGreeting()]);
    setInput("");
    setPending(false);
    setAnimatedMessageId(null);
    inputRef.current?.focus();
  }, []);

  const handlePanelKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !panelRef.current.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last || !panelRef.current.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  const hasAsked = messages.some((message) => message.role === "user");
  const showSuggestions = open && !hasAsked && !pending;

  return (
    <>
      {open ? (
        <AskPanel
          panelRef={panelRef}
          listRef={listRef}
          inputRef={inputRef}
          messages={messages}
          pending={pending}
          input={input}
          showSuggestions={showSuggestions}
          animatedMessageId={animatedMessageId}
          onInputChange={setInput}
          onSubmit={() => {
            void send(input);
          }}
          onSuggestion={(question) => {
            void send(question);
          }}
          onClose={closeChat}
          onClear={clearConversation}
          onPanelKeyDown={handlePanelKeyDown}
        />
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        onClick={open ? closeChat : openChat}
        aria-expanded={open}
        aria-controls="ask-panel"
        aria-haspopup="dialog"
        aria-label={open ? "Close Ask Bright assistant" : "Open Ask Bright assistant"}
        className={cn(
          "fixed bottom-6 right-5 z-50 grid size-14 place-items-center rounded-full",
          "border border-border-strong bg-accent text-accent-foreground shadow-glow",
          "transition-transform duration-300 hover:-translate-y-0.5 sm:right-8",
        )}
      >
        {open ? (
          <X className="size-6" strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Sparkles className="size-6" strokeWidth={1.75} aria-hidden="true" />
        )}
        {/* availability dot */}
        <span
          className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-background"
          aria-hidden="true"
        />
      </button>
    </>
  );
}