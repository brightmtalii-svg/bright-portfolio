"use client";

import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Info, LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactSchema, MESSAGE_MAX_LENGTH } from "@/lib/validation";
import type { ContactFormValues, ContactResponse } from "@/types";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; message: string }
  | { kind: "dev"; message: string }
  | { kind: "error"; message: string };

const fieldBase =
  "w-full rounded-xl border bg-card px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-faint focus:ring-2 focus:ring-accent/20";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as Resolver<ContactFormValues>,
    defaultValues: { name: "", email: "", subject: "", message: "", company: "" },
    mode: "onBlur",
  });

  const messageValue = useWatch({ control, name: "message" }) ?? "";

  async function onSubmit(values: ContactFormValues): Promise<void> {
    setStatus({ kind: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as ContactResponse;

      if (data.fieldErrors) {
        for (const [field, message] of Object.entries(data.fieldErrors)) {
          setError(field as keyof ContactFormValues, { type: "server", message });
        }
      }

      if (data.ok) {
        setStatus(
          data.code === "dev-mode"
            ? { kind: "dev", message: data.message }
            : { kind: "sent", message: data.message },
        );
        reset({ name: "", email: "", subject: "", message: "", company: "" });
        return;
      }

      setStatus({ kind: "error", message: data.message });
    } catch {
      setStatus({
        kind: "error",
        message:
          "The message could not be sent — check your connection and try again, or reach out through GitHub or LinkedIn.",
      });
    }
  }

  const busy = isSubmitting || status.kind === "submitting";

  if (status.kind === "sent" || status.kind === "dev") {
    const isDev = status.kind === "dev";
    return (
      <div className="panel flex flex-col items-start gap-4 rounded-3xl p-6 sm:p-8">
        <span
          className={cn(
            "grid size-12 place-items-center rounded-2xl border",
            isDev
              ? "border-accent-cyan/35 bg-accent-cyan/10 text-accent-cyan"
              : "border-emerald-500/35 bg-emerald-500/10 text-emerald-500",
          )}
        >
          {isDev ? (
            <Info className="size-6" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="size-6" aria-hidden="true" />
          )}
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-semibold tracking-tight">
            {isDev ? "Message received — delivery not configured" : "Message sent"}
          </h2>
          <p className="text-sm leading-relaxed text-muted">{status.message}</p>
        </div>
        <Button variant="secondary" onClick={() => setStatus({ kind: "idle" })}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="panel flex flex-col gap-5 rounded-3xl p-6 sm:p-8"
    >
      {status.kind === "error" ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{status.message}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(errors.name)}
            className={cn(fieldBase, errors.name ? "border-red-500/50" : "border-border-strong focus:border-accent/60")}
            {...register("name")}
          />
        </Field>

        <Field label="Email address" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className={cn(fieldBase, errors.email ? "border-red-500/50" : "border-border-strong focus:border-accent/60")}
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Subject" htmlFor="subject" error={errors.subject?.message}>
        <input
          id="subject"
          type="text"
          placeholder="What would you like to talk about?"
          aria-invalid={Boolean(errors.subject)}
          className={cn(fieldBase, errors.subject ? "border-red-500/50" : "border-border-strong focus:border-accent/60")}
          {...register("subject")}
        />
      </Field>

      <Field
        label="Message"
        htmlFor="message"
        error={errors.message?.message}
        hint={`${messageValue.trim().length} / ${MESSAGE_MAX_LENGTH}`}
      >
        <textarea
          id="message"
          rows={6}
          placeholder="Tell me a little about what you have in mind…"
          aria-invalid={Boolean(errors.message)}
          className={cn(
            fieldBase,
            "resize-y",
            errors.message ? "border-red-500/50" : "border-border-strong focus:border-accent/60",
          )}
          {...register("message")}
        />
      </Field>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-faint">
          I read every message. No newsletters, no spam — just a reply.
        </p>
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        {hint ? <span className="font-mono text-[0.68rem] text-faint">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="size-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
