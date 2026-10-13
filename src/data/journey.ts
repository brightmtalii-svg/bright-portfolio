import type { TimelineEntry } from "@/types";

/**
 * EDUCATION & JOURNEY
 * ===================
 * Only verified, non-invented milestones are listed. Exact dates are left
 * deliberately loose ("Present", "Ongoing") — replace them with real dates as
 * they become available. Do not add employers, awards or certificates here.
 */

export const journey: TimelineEntry[] = [
  {
    id: "bsc-information-technology",
    period: "Present",
    title: "BSc Information Technology",
    subtitle: "Maseno University, Kenya",
    description:
      "Currently pursuing a Bachelor of Science in Information Technology. Coursework covers programming, data structures, systems, databases and the foundations of computing that everything else is built on.",
    icon: "graduation",
    current: true,
    tags: ["Education", "Current"],
  },
  {
    id: "software-development-practice",
    period: "Ongoing",
    title: "Software development practice",
    subtitle: "Independent projects & coursework",
    description:
      "Building practical applications to turn theory into habit: Python tools, a student records prototype, and structured application projects that focus on architecture rather than shortcuts.",
    icon: "code",
    tags: ["Projects", "Python", "Architecture"],
  },
  {
    id: "artificial-intelligence",
    period: "Ongoing",
    title: "Exploring artificial intelligence",
    subtitle: "Self-directed study",
    description:
      "Experiments with local language models, prompt design and developer-focused assistants — learning how intelligent systems behave when you can inspect every layer.",
    icon: "brain",
    tags: ["AI", "Experiments"],
  },
  {
    id: "robotics-and-technology",
    period: "Ongoing",
    title: "Robotics & technology exploration",
    subtitle: "Hardware experiments",
    description:
      "Working with microcontrollers, sensors and automation to understand how software behaves once it leaves the screen and meets real-world constraints.",
    icon: "chip",
    tags: ["Robotics", "Embedded"],
  },
  {
    id: "continuous-development",
    period: "Continuous",
    title: "Continuous professional development",
    subtitle: "Documentation, open source & self-study",
    description:
      "Reading official documentation, studying system design and security fundamentals, and deliberately practising the tools used by professional engineering teams.",
    icon: "book",
    tags: ["Learning", "Growth"],
  },
];

export const education = {
  degree: "Bachelor of Science in Information Technology",
  institution: "Maseno University",
  location: "Kenya",
  status: "In progress",
  summary:
    "Studying information technology with a focus on software engineering fundamentals, programming, data and systems.",
};
