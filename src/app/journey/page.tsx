import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { JourneyTimeline } from "@/components/journey/journey-timeline";
import { CtaSection } from "@/components/home/cta-section";
import { person } from "@/data/personal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Journey",
  description:
    "The education and learning path of Bright Mtalii — studying Information Technology at Maseno University while building software, exploring AI and learning in public.",
  path: "/journey",
  keywords: ["Bright Mtalii journey", "Maseno University", "IT student", "learning timeline"],
});

export default function JourneyPage() {
  return (
    <>
      <PageHero
        eyebrow="Journey"
        current="Journey"
        title={
          <>
            Still early — and{" "}
            <span className="text-gradient-static">moving deliberately.</span>
          </>
        }
        description="Education and self-directed learning, without the inflated résumé language. This is where I've been and where I'm choosing to go next."
      >
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-faint">
          <span>
            <span className="text-muted">Status:</span> {person.availability.open ? "Open to learning opportunities" : "Focused on study"}
          </span>
          <span>
            <span className="text-muted">Study:</span> {person.university}
          </span>
        </div>
      </PageHero>

      <JourneyTimeline />
      <CtaSection />
    </>
  );
}
