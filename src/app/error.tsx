"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error in the browser console for local debugging.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Something broke on this page
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted">
          An unexpected error occurred while rendering this section. You can retry, or head back
          home and try a different route.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-faint">reference: {error.digest}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} size="md">
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
        <Link
          href="/"
          className="rounded-full border border-border-strong px-5 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          Back home
        </Link>
      </div>
    </Container>
  );
}
