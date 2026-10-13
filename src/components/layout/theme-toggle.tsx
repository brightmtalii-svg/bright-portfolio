"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

/**
 * Theme toggle.
 *
 * Both icons are always rendered; CSS decides which one is visible based on the
 * `dark` class on <html>. That keeps server and client markup identical, so
 * there is no hydration mismatch before React takes over.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      className={cn(
        "relative grid size-10 place-items-center rounded-full border border-border-strong bg-card text-muted",
        "transition-colors duration-300 hover:border-accent/50 hover:text-foreground",
        className,
      )}
    >
      <Sun className="hidden size-[1.05rem] dark:block" strokeWidth={1.75} aria-hidden="true" />
      <Moon className="block size-[1.05rem] dark:hidden" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
