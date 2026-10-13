"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Download, Menu } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { Monogram } from "@/components/ui/monogram";
import { navigation, site } from "@/data/site";
import { person } from "@/data/personal";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  /** True when a CV file actually exists in /public/resume. */
  resumeAvailable: boolean;
}

export function SiteHeader({ resumeAvailable }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-foreground"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50">
        <motion.div
          className="h-0.5 origin-left bg-gradient-to-r from-accent via-accent-cyan to-accent"
          style={reduceMotion ? undefined : { scaleX: progress }}
          aria-hidden="true"
        />

        <div className="glass border-b border-border">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-5 sm:px-8 lg:h-[4.5rem] lg:justify-between lg:px-10">
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-full py-1 pr-2"
              aria-label={`${site.name} — home`}
            >
              <Monogram glow className="transition-transform duration-300 group-hover:scale-105" />
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-semibold tracking-tight">{person.name}</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-faint">
                  {site.monogram} · {person.degree.split(" ")[0]}
                </span>
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-0.5 rounded-full border border-border bg-card/60 p-1">
                {navigation.map((item) => {
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                          isActive
                            ? "text-foreground"
                            : "text-muted hover:text-foreground",
                        )}
                      >
                        {isActive ? (
                          <motion.span
                            layoutId="nav-active-pill"
                            className="absolute inset-0 -z-10 rounded-full border border-accent/30 bg-accent/10"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        ) : null}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <div className="hidden items-center gap-1 sm:flex">
                {person.socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} profile`}
                    className="grid size-10 place-items-center rounded-full border border-transparent text-muted transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    {social.id === "github" ? (
                      <GitHubIcon className="size-[1.05rem]" />
                    ) : (
                      <LinkedInIcon className="size-[1.05rem]" />
                    )}
                  </a>
                ))}
              </div>

              <ThemeToggle className="hidden sm:grid" />

              {resumeAvailable ? (
                <a
                  href={person.resume.path}
                  download={person.resume.fileName}
                  className="hidden h-10 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-transform duration-300 hover:-translate-y-0.5 lg:inline-flex"
                >
                  <Download className="size-4" aria-hidden="true" />
                  CV
                </a>
              ) : (
                <span
                  title="Add your CV to public/resume/ to enable this button"
                  className="hidden h-10 items-center gap-2 rounded-full border border-dashed border-border px-4 font-mono text-xs text-faint lg:inline-flex"
                >
                  CV soon
                </span>
              )}

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                className="grid size-10 place-items-center rounded-full border border-border-strong bg-card text-muted transition-colors hover:text-foreground lg:hidden"
              >
                <Menu className="size-[1.15rem]" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={closeMenu} resumeAvailable={resumeAvailable} />
    </>
  );
}
