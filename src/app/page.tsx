import type { Metadata } from "next";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";
import { SkillsMarquee } from "@/components/home/skills-marquee";
import { SkillsPreview } from "@/components/home/skills-preview";
import { TerminalSection } from "@/components/home/terminal-section";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: site.headline,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <SkillsMarquee />
      <FeaturedProjects />
      <TerminalSection />
      <SkillsPreview />
      <ServicesSection />
      <CtaSection />
    </>
  );
}
