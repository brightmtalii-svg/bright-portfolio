import type { Metadata } from "next";
import { person } from "@/data/personal";
import { absoluteUrl, site } from "@/data/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Route path, e.g. "/projects". */
  path: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  /** Absolute path to an OG image; defaults to the generated `/opengraph-image`. */
  image?: string;
}

/**
 * Build consistent per-page metadata: canonical URL, Open Graph and Twitter
 * cards all derive from the same inputs so they can never drift apart.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  image,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    keywords: [...site.keywords, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      type: type === "profile" ? "profile" : type,
      url,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${title} — ${site.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Site-wide metadata applied by the root layout. */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: absoluteUrl("/") }],
  creator: site.name,
  publisher: site.name,
  keywords: [...site.keywords],
  category: "technology",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    locale: site.locale,
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.headline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
    images: [absoluteUrl("/opengraph-image")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
};

/**
 * schema.org structured data. Only verified, public facts are described — no
 * invented employers, awards, credentials or contact details.
 */
export function personStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    alternateName: `${person.firstName} ${person.lastName}`,
    url: absoluteUrl("/"),
    description: site.description,
    jobTitle: "Information Technology Student & Aspiring Software Developer",
    knowsAbout: [...person.focusAreas],
    sameAs: person.socials.map((social) => social.href),
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: person.university,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "KE",
    },
  };
}

export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${person.name} — Portfolio`,
    url: absoluteUrl("/"),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: person.name,
    },
  };
}

/** Serialise JSON-LD safely for inline script injection. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
