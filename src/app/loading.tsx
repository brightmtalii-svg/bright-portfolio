import { Container } from "@/components/ui/section";
import { Monogram } from "@/components/ui/monogram";

/** Shown while a route segment streams in. */
export default function Loading() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24">
      <Monogram size="lg" glow className="animate-pulse" />
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-faint">
        loading…
      </p>
      <span className="sr-only" role="status">
        Loading page content
      </span>
    </Container>
  );
}
