import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { person } from "@/data/personal";
import { cn } from "@/lib/utils";

/** Reusable social link row used in the hero, contact page and footer. */
export function SocialLinks({
  className,
  size = "md",
  showLabels = false,
}: {
  className?: string;
  size?: "sm" | "md";
  showLabels?: boolean;
}) {
  const box = size === "sm" ? "size-9" : "size-10";

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {person.socials.map((social) => (
        <li key={social.id}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${social.label} profile${showLabels ? "" : ` (opens in a new tab)`}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border-strong bg-card text-muted",
              "transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground",
              showLabels ? "h-10 px-4" : box,
              showLabels ? "" : "justify-center",
            )}
          >
            {social.id === "github" ? (
              <GitHubIcon className="size-[1.05rem]" />
            ) : (
              <LinkedInIcon className="size-[1.05rem]" />
            )}
            {showLabels ? <span className="text-sm">{social.label}</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
