"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Download, X } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Monogram } from "@/components/ui/monogram";
import { navigation, site } from "@/data/site";
import { person } from "@/data/personal";
import { cn } from "@/lib/utils";

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  resumeAvailable: boolean;
}

export function MobileNav({ open, onClose, resumeAvailable }: MobileNavProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  // Lock body scroll and close on Escape while the panel is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-navigation"
          className="fixed inset-x-0 top-0 z-40 lg:hidden"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div
            className="fixed inset-0 -z-10 bg-background/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.nav
            aria-label="Mobile"
            className="mx-3 mt-3 overflow-hidden rounded-3xl border border-border bg-surface/95 p-3 shadow-2xl backdrop-blur-xl sm:mx-5"
            initial={reduceMotion ? { y: 0 } : { y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? { y: 0 } : { y: -12, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-2 pt-1 pb-3">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3"
                aria-label={`${site.name} — home`}
              >
                <Monogram />
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">{person.name}</span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-faint">
                    {site.monogram} · portfolio
                  </span>
                </span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="grid size-10 place-items-center rounded-full border border-border-strong bg-card text-muted transition-colors hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <ul className="flex flex-col gap-1">
              {navigation.map((item, index) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <motion.li
                    key={item.href}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.04 * index + 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
                        isActive
                          ? "bg-accent/10 text-foreground"
                          : "text-muted hover:bg-foreground/5 hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-9 place-items-center rounded-xl border",
                          isActive
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-border bg-card text-muted",
                        )}
                      >
                        <Icon name={item.icon} className="size-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-xs text-faint">{item.description}</span>
                      </span>
                      <ArrowUpRight
                        className="ml-auto size-4 text-faint"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-3 flex items-center gap-2 border-t border-border px-1 pt-3">
              {resumeAvailable ? (
                <a
                  href={person.resume.path}
                  download={person.resume.fileName}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-foreground"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download CV
                </a>
              ) : (
                <span className="inline-flex h-11 flex-1 flex-col items-center justify-center rounded-full border border-dashed border-border text-xs text-faint">
                  CV not added yet
                  <span className="font-mono text-[0.6rem]">public/resume/</span>
                </span>
              )}
              <ThemeToggle />
            </div>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
