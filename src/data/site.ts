import type { NavItem } from "@/types";

/**
 * Global site configuration.
 *
 * `url` is read from NEXT_PUBLIC_SITE_URL. Set it in `.env.local` (or in your
 * hosting dashboard) so canonical URLs, Open Graph tags, sitemap.xml and
 * robots.txt point at the real domain. It falls back to localhost for dev.
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const site = {
  url: (rawUrl && rawUrl.length > 0 ? rawUrl : "http://localhost:3000").replace(/\/$/, ""),
  name: "Bright Mtalii",
  shortName: "Bright",
  monogram: "BM",
  role: "Software Developer & Technology Enthusiast",
  headline: "Software Developer | AI & Automation Enthusiast | Technology Innovator",
  description:
    "Portfolio of Bright Mtalii — an Information Technology student and aspiring software engineer building practical applications, exploring AI-powered systems and turning ideas into meaningful digital solutions.",
  keywords: [
    "Bright Mtalii",
    "Software Developer",
    "Software Engineer Portfolio",
    "Python Developer",
    "AI Enthusiast",
    "Automation",
    "Full-Stack Developer",
    "Maseno University",
    "Information Technology",
    "Kenya Developer",
  ],
  locale: "en_KE",
  themeColorDark: "#09090B",
  themeColorLight: "#F7F7F9",
} as const;

export const navigation: NavItem[] = [
  { href: "/", label: "Home", description: "Back to the top", icon: "home" },
  { href: "/about", label: "About", description: "The mind behind the code", icon: "user" },
  { href: "/projects", label: "Projects", description: "Things I have been building", icon: "layers" },
  { href: "/skills", label: "Skills", description: "Technologies and interests", icon: "cpu" },
  { href: "/journey", label: "Journey", description: "Education and growth", icon: "route" },
  { href: "/contact", label: "Contact", description: "Let's build something", icon: "mail" },
];

/** Turns a relative path into an absolute URL for metadata and the sitemap. */
export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
