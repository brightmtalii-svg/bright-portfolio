import Image from "next/image";
import { cn } from "@/lib/utils";
import { person } from "@/data/personal";
import { Monogram } from "@/components/ui/monogram";

export interface ProfileAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const tile = {
  sm: "size-12 rounded-2xl",
  md: "size-24 rounded-3xl",
  lg: "size-40 rounded-[2rem]",
};

/**
 * Profile photograph placeholder.
 *
 * While `person.profileImage` is null a monogram tile is rendered instead of a
 * fake face. Point `person.profileImage` at a real image in /public (e.g.
 * "/images/profile/bright-mtalii.jpg") and it swaps to next/image automatically.
 */
export function ProfileAvatar({ size = "md", className }: ProfileAvatarProps) {
  const image = person.profileImage;

  return (
    <div
      className={cn(
        "relative select-none overflow-hidden border border-border bg-elevated",
        tile[size],
        className,
      )}
    >
      {image === null ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(70% 70% at 30% 20%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%), radial-gradient(60% 60% at 75% 75%, color-mix(in oklab, var(--accent-cyan) 26%, transparent), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="relative grid h-full w-full place-items-center">
            <Monogram size={size} className="bg-transparent ring-0" />
          </div>
        </>
      ) : (
        <Image
          src={image}
          alt={`Portrait of ${person.name}`}
          fill
          className="object-cover"
          sizes={size === "lg" ? "160px" : size === "md" ? "96px" : "48px"}
        />
      )}
    </div>
  );
}