import { site } from "./site";

/**
 * Everything about Bright Mtalii that is not a project, skill or timeline entry.
 * Edit this file to personalise the site — components read from here.
 *
 * Honesty rules followed by this file:
 *  - No employment history, certifications or awards are implied.
 *  - `email` is intentionally empty until you configure it, so the UI can tell
 *    visitors to configure it instead of inventing an address.
 *  - `profileImage` is `null` until you add a real photograph.
 */

export const person = {
  name: site.name,
  firstName: "Bright",
  lastName: "Mtalii",
  monogram: site.monogram,
  headline: site.headline,

  /** Rotating words in the hero. Keep them short — they animate one by one. */
  rotatingHeadlines: [
    "Building Software.",
    "Exploring Intelligence.",
    "Engineering Tomorrow.",
  ],

  /** Paragraph shown directly under the hero heading. */
  heroIntro:
    "I'm an Information Technology student and aspiring software engineer passionate about building practical applications, exploring AI-powered systems, and transforming ideas into meaningful digital solutions.",

  location: "Kenya",
  university: "Maseno University",
  degree: "BSc Information Technology",
  studyNote: "Currently pursuing a Bachelor of Science in Information Technology.",

  /** Longer About-page paragraphs. */
  bio: [
    "I am Bright Mtalii, an Information Technology student at Maseno University in Kenya and an aspiring software engineer. My work sits at the intersection of curiosity and craft: I like taking an idea, breaking it down into systems, and turning it into software that someone can actually use.",
    "Most of my time goes into learning by building. I write a lot of Python, explore the JavaScript and TypeScript ecosystem, and spend my evenings experimenting with artificial intelligence, automation and the kind of developer tooling that makes hard problems feel manageable.",
    "I am equally fascinated by the invisible parts of software — architecture, data modelling, security and the decisions that keep a system maintainable years after the first commit. Cybersecurity and robotics are two areas I keep returning to because they force me to think about how software behaves in the real, physical world.",
    "I am at the beginning of a long engineering path and I am honest about that. What I can offer today is momentum: a habit of building, a willingness to be corrected, and a genuine interest in solving problems that matter to people.",
  ],

  /** Honest, non-inflated descriptors used by the About page cards. */
  traits: [
    {
      icon: "compass",
      title: "Systems thinker",
      description:
        "I enjoy mapping a problem end to end — data, interfaces and failure modes — before writing a line of code.",
    },
    {
      icon: "wrench",
      title: "Practical builder",
      description:
        "I learn by shipping small, complete things rather than collecting half-finished experiments.",
    },
    {
      icon: "shield",
      title: "Security aware",
      description:
        "Studying cybersecurity habits: validating input, respecting least privilege and designing for safe failure.",
    },
    {
      icon: "atom",
      title: "Perpetual student",
      description:
        "Coursework, documentation, open source and independent experiments are all part of my routine.",
    },
  ],

  /** Areas Bright keeps coming back to. Used on About and Skills pages. */
  focusAreas: [
    "Software Engineering",
    "Artificial Intelligence",
    "Python Development",
    "Full-Stack Web Development",
    "Cybersecurity",
    "Robotics & Automation",
    "Developer Tools",
    "Intelligent Systems",
  ],

  socials: [
    {
      id: "github",
      label: "GitHub",
      handle: "brightmtalii-svg",
      href: "https://github.com/brightmtalii-svg",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      handle: "Bright Mtalii",
      href: "https://www.linkedin.com/in/bright-mtalii-5ab0563b1",
    },
  ],

  /**
   * Contact address. Set NEXT_PUBLIC_CONTACT_EMAIL in `.env.local`.
   * While it is empty the UI shows a configuration hint instead of a fake address.
   */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "brightmtalii@gmail.com",

  /** CV link rendered in the header + footer when the file exists. */
  resume: {
    path: "/resume/Bright_Mtalii_Software_Developer_CV.pdf",
    fileName: "Bright_Mtalii_Software_Developer_CV.pdf",
  },

  /**
   * Drop a real photograph at `public/images/profile/bright-mtalii.jpg`
   * and point this at it (e.g. "/images/profile/bright-mtalii.jpg").
   * While it is `null` a monogram placeholder is rendered — never a fake face.
   */
  //profileImage: null as string | null,
  profileImage: "/images/profile/bright-mtalii.jpg",

  /** Editable availability indicator shown in the hero. */
  availability: {
    open: true,
    label: "Open to learning opportunities, internships and collaboration",
    detail:
      "Studying full-time at Maseno University while building projects independently. Not currently employed or offering commercial services.",
  },

  /**
   * A single sentence distilled from the bio — used in the footer and OG image.
   */
  closingLine: "Built with curiosity, engineered with purpose.",
} as const;

export type Person = typeof person;
