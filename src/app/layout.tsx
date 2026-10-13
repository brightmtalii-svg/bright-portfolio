import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/footer";
import { AskBot } from "@/components/ask/ask-bot";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { themeInitScript } from "@/components/providers/theme-script";
import { site } from "@/data/site";
import { isResumeAvailable } from "@/lib/resume";
import { defaultMetadata, jsonLdString, personStructuredData, websiteStructuredData } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: site.themeColorDark },
    { media: "(prefers-color-scheme: light)", color: site.themeColorLight },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const resumeAvailable = isResumeAvailable();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <SiteHeader resumeAvailable={resumeAvailable} />
          <main id="main" className="flex-1 pt-16 lg:pt-[4.5rem]">
            {children}
          </main>
          <SiteFooter />
          <AskBot />
        </ThemeProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(personStructuredData()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(websiteStructuredData()) }}
        />
      </body>
    </html>
  );
}
