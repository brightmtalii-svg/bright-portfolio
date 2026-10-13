import type {
  Project,
  ProjectCategory,
  ProjectStatus,
} from "@/types";

/**
 * PROJECT CONTENT
 * ===============
 * Every project record lives here — cards, filters, the detail pages and the
 * sitemap all read from this file. To add a project:
 *
 *   1. Copy one of the objects below.
 *   2. Give it a unique, lowercase `slug`.
 *   3. Pick a `category` id from `projectCategories` and a `status`.
 *   4. Leave `thumbnail` as `null` to use the generated placeholder artwork,
 *      or point it at an image in /public (e.g. "/images/projects/foo.webp").
 *      These illustrations are conceptual artwork, not screenshots — set
 *      `thumbnailKind: "illustration"` and a descriptive `thumbnailAlt` so the
 *      UI never claims they show the running application.
 *   5. Only add `links.github` / `links.live` when a public URL really exists.
 *
 * Nothing here claims professional delivery. Each entry carries a `disclaimer`
 * describing its honest maturity level.
 */

export const projectStatuses: Record<
  ProjectStatus,
  { label: string; description: string; order: number }
> = {
  concept: {
    label: "Concept",
    description: "Explored on paper and in small experiments. No usable build yet.",
    order: 0,
  },
  "in-development": {
    label: "In development",
    description: "Actively being built, redesigned or rewritten.",
    order: 1,
  },
  prototype: {
    label: "Prototype",
    description: "Runs end to end for a limited scope, still rough around the edges.",
    order: 2,
  },
  completed: {
    label: "Completed",
    description: "Reached the scope that was planned for this learning cycle.",
    order: 3,
  },
};

export const projectCategories: ProjectCategory[] = [
  {
    id: "artificial-intelligence",
    label: "Artificial Intelligence",
    description: "Language models, assistants and intelligent tooling.",
  },
  {
    id: "software-development",
    label: "Software Development",
    description: "Application structure, modular architecture and tooling.",
  },
  {
    id: "python-development",
    label: "Python Development",
    description: "Python applications, data handling and the standard library.",
  },
  {
    id: "full-stack-system-design",
    label: "Full-Stack System Design",
    description: "End-to-end product thinking: interfaces, services and data.",
  },
  {
    id: "embedded-systems",
    label: "Embedded Systems",
    description: "Microcontrollers, sensors and automation experiments.",
  },
];

export const projects: Project[] = [
  {
    slug: "bright-ai",
    name: "Bright AI",
    category: "artificial-intelligence",
    summary:
      "An experimental personal assistant exploring local language models and developer-focused interactions.",
    tagline:
      "A playground for learning how language models behave when they run on your own machine.",
    status: "in-development",
    timeline: "Ongoing",
    featured: true,
    technologies: ["Python", "Local LLMs", "Prompt design", "CLI tooling"],
    thumbnail: "/images/projects/bright-ai.webp",
    thumbnailAlt:
      "Conceptual illustration for Bright AI — a terminal assistant wired to a local language model.",
    thumbnailKind: "illustration",
    screenshots: [],
    links: {},
    overview: [
      "Bright AI is a personal research project rather than a product. The goal is to understand what it actually takes to give a language model a useful, developer-shaped interface.",
      "The current direction is a small assistant that answers questions about code, summarises notes and keeps a local record of previous sessions — all running against a model hosted on my own machine so I can see exactly what is happening under the hood.",
    ],
    problem: [
      "Hosted AI assistants hide almost everything: the prompt, the model configuration and the cost of each interaction. That makes it hard to learn how these systems really work.",
      "Developer workflows are also fragmented — notes, snippets and questions live in a dozen different places with no single place to ask.",
    ],
    solution: [
      "Build a deliberately small assistant around a local language model so the prompt, context window and inference settings are all visible and editable.",
      "Design the interaction around the terminal first, because that is where I already work, and expose every command so nothing is a black box.",
    ],
    architecture: [
      {
        title: "Interface layer",
        description:
          "A command-line front end that handles input, command history and rendering of model output.",
      },
      {
        title: "Assistant core",
        description:
          "Prompt assembly, session state and message history kept in plain files so experiments are reproducible.",
      },
      {
        title: "Model runtime",
        description:
          "A local inference server exposing a stable HTTP interface, so the assistant is not tied to one specific model.",
      },
      {
        title: "Memory store",
        description:
          "Lightweight local persistence for sessions and notes, designed to be inspected by hand.",
      },
    ],
    features: [
      "Conversational question answering with visible prompt construction",
      "Local session history that can be reviewed and replayed",
      "Swappable model backend behind a single HTTP contract",
      "Terminal-first interface that stays usable without a GUI",
    ],
    challenges: [
      "Managing context length — deciding what the model should remember and what can safely be dropped.",
      "Keeping responses useful without over-engineering prompt templates.",
      "Running inference on modest hardware without making every interaction painfully slow.",
    ],
    lessons: [
      "Prompt engineering is a systems problem: structure and context matter more than clever wording.",
      "A stable interface between the assistant and the model makes it possible to experiment without rewriting everything.",
      "Interfaces that expose their internals teach you far more than polished ones that hide them.",
    ],
    futureImprovements: [
      "Add retrieval over my own notes so answers reference real material.",
      "Introduce a small evaluation harness so prompt changes can be compared instead of guessed at.",
      "Explore a minimal web interface sharing the same core as the CLI.",
    ],
    disclaimer:
      "This is a personal learning project in active development. It is not published, hosted or offered as a service.",
  },
  {
    slug: "tuchat",
    name: "TUCHAT",
    category: "software-development",
    summary:
      "A software project exploring structured application development and modular architecture.",
    tagline:
      "An exploration of how to structure an application so features can be added without rewriting the base.",
    status: "in-development",
    timeline: "Ongoing",
    featured: true,
    technologies: ["Application architecture", "Modular design", "Python", "Web fundamentals"],
    thumbnail: "/images/projects/tuchat.webp",
    thumbnailAlt:
      "Conceptual illustration for TUCHAT — a layered, modular application architecture.",
    thumbnailKind: "illustration",
    screenshots: [],
    links: {},
    overview: [
      "TUCHAT is where I practise the parts of software engineering that are invisible in a screenshot: module boundaries, naming, configuration and the discipline of keeping one concern in one place.",
      "The focus is deliberately architectural. Each feature is small, but it must plug into the same structure — the point is the shape of the codebase, not the size of the feature list.",
    ],
    problem: [
      "Learning to code tends to produce single-file applications that become impossible to extend once they grow.",
      "Without a deliberate structure, adding the third or fourth feature means touching everything that already works.",
    ],
    solution: [
      "Define clear layers — input, application logic and data — and forbid shortcuts between them.",
      "Keep configuration and secrets outside the code, and make every module acceptable to test in isolation.",
    ],
    architecture: [
      {
        title: "Presentation",
        description: "Thin interface layer responsible only for input handling and output formatting.",
      },
      {
        title: "Application services",
        description: "Use-case functions that orchestrate the domain without knowing about the interface.",
      },
      {
        title: "Domain model",
        description: "Core entities and rules, with no dependency on frameworks or storage.",
      },
      {
        title: "Infrastructure",
        description: "Storage, configuration and external adapters behind small interfaces.",
      },
    ],
    features: [
      "Layered module structure with explicit dependencies",
      "Configuration handled through environment variables",
      "Small, single-responsibility modules",
      "Documented extension points for new features",
    ],
    challenges: [
      "Resisting the urge to let a quick feature reach across layers.",
      "Naming things well enough that the structure explains itself.",
      "Finding the right size for a module — too small is noise, too large is a new monolith.",
    ],
    lessons: [
      "Architecture is a set of constraints you choose on purpose, not a diagram you draw afterwards.",
      "Refactoring early is cheaper than explaining a tangled structure later.",
      "Consistent conventions reduce the amount of thinking required to add a feature.",
    ],
    futureImprovements: [
      "Add automated tests around the application layer.",
      "Document the architecture with real diagrams once the structure settles.",
      "Introduce a proper data layer abstraction to support more than one storage backend.",
    ],
    disclaimer:
      "An educational project focused on architecture practice. No public release or hosted deployment exists yet.",
  },
  {
    slug: "student-management-system",
    name: "Student Management System",
    category: "python-development",
    summary:
      "A Python application exploring student registration, data validation, object-oriented programming and modular application design.",
    tagline:
      "Object-oriented Python applied to a familiar real-world problem: keeping student records accurate.",
    status: "prototype",
    timeline: "Coursework & self-study",
    featured: true,
    technologies: ["Python", "OOP", "Input validation", "File persistence"],
    thumbnail: "/images/projects/student-management.webp",
    thumbnailAlt:
      "Conceptual illustration for the Student Management System — student records and validation.",
    thumbnailKind: "illustration",
    screenshots: [],
    links: {},
    overview: [
      "A console application that registers students, validates their details and keeps records searchable. It started as a way to practise object-oriented Python and grew into an exercise in defensive input handling.",
      "The interesting part turned out to be validation: deciding what counts as a valid record, where that check belongs, and how to report a problem without crashing three functions later.",
    ],
    problem: [
      "Manual record keeping makes duplicates and incomplete entries easy to create.",
      "Beginner data-handling code tends to trust its input, so a single bad value can corrupt the whole dataset.",
    ],
    solution: [
      "Model each student as an object with its own validation rules, so an invalid record cannot exist.",
      "Separate storage from the domain model, allowing the same logic to work against files now and a database later.",
    ],
    architecture: [
      {
        title: "Entities",
        description: "Student and record classes that own their own invariants and validation.",
      },
      {
        title: "Service layer",
        description: "Registration, search and update operations expressed as clear use cases.",
      },
      {
        title: "Persistence",
        description: "A small repository abstraction over file storage, swappable for a database.",
      },
      {
        title: "Presentation",
        description: "A menu-driven console interface with readable error reporting.",
      },
    ],
    features: [
      "Student registration with field-level validation",
      "Search and lookup by identifier or name",
      "Duplicate detection with clear error messages",
      "Persistent records that survive application restarts",
    ],
    challenges: [
      "Designing validation that rejects bad data without making the interface hostile.",
      "Keeping the storage format readable and easy to migrate later.",
      "Handling unexpected input gracefully instead of letting exceptions escape.",
    ],
    lessons: [
      "Validation belongs with the data it protects — invariants are worth enforcing in one place.",
      "Object-oriented design pays off exactly when the rules get complicated.",
      "Good error messages are part of the user interface, not an afterthought.",
    ],
    futureImprovements: [
      "Move persistence to SQLite with a real schema and migrations.",
      "Add automated tests for the validation rules.",
      "Introduce unit and course entities to model the university domain properly.",
    ],
    disclaimer:
      "A learning prototype built during coursework and self-study. It is not connected to any real institution's data.",
  },
  {
    slug: "university-healthcare-management-system",
    name: "University Healthcare Management System",
    category: "full-stack-system-design",
    summary:
      "A university healthcare software concept focused on secure, role-based workflows and system architecture.",
    tagline:
      "A system-design study of the hardest part of healthcare software: who is allowed to see what.",
    status: "concept",
    timeline: "Concept & design",
    featured: true,
    technologies: ["System design", "Role-based access control", "Data modelling", "Security"],
    thumbnail: "/images/projects/healthcare-system.webp",
    thumbnailAlt:
      "Conceptual illustration for the University Healthcare Management System — role-based access to clinical records.",
    thumbnailKind: "illustration",
    screenshots: [],
    links: {},
    overview: [
      "This project is currently a design study. Before writing application code I mapped the actors — students, clinical staff, administrators — and the data each of them should and should not be able to reach.",
      "The output so far is a set of workflows, an entity model and a security posture. It is intentionally unfinished because the design questions are the valuable part.",
    ],
    problem: [
      "Healthcare records are among the most sensitive data a university holds, yet campus systems often grant broad access because fine-grained permissions are difficult to model.",
      "Appointments, prescriptions and student records tend to live in separate systems that do not share a consistent identity model.",
    ],
    solution: [
      "Design permissions as data rather than branching logic: a role matrix that can be reviewed and audited by a human.",
      "Model the domain around encounters — a single record of a visit — and let access rules follow from the actor's relationship to that encounter.",
    ],
    architecture: [
      {
        title: "Identity & roles",
        description: "A single identity per person with roles attached, rather than per-system accounts.",
      },
      {
        title: "Access control layer",
        description: "Central authorisation checks driven by a reviewable role-permission matrix.",
      },
      {
        title: "Domain services",
        description: "Appointments, encounters, prescriptions and student records as separate bounded concerns.",
      },
      {
        title: "Audit trail",
        description: "Append-only records of who accessed which sensitive data and when.",
      },
    ],
    features: [
      "Role matrix covering students, clinical staff and administrators",
      "Encounter-centric data model for visits and treatment",
      "Audit-first design for sensitive record access",
      "Planned appointment and prescription workflows",
    ],
    challenges: [
      "Balancing clinical practicality — staff need speed — against least privilege.",
      "Deciding where authorisation belongs so it cannot be bypassed by a new feature.",
      "Modelling consent and sensitive categories without over-complicating the schema.",
    ],
    lessons: [
      "Security requirements shape the data model; they cannot be layered on top afterwards.",
      "Designing permissions as data makes them reviewable by non-engineers.",
      "Writing the failure cases before the happy path exposes the real complexity.",
    ],
    futureImprovements: [
      "Prototype the access control layer with tests that prove denied access is denied.",
      "Draft data retention and audit-review policies alongside the technical design.",
      "Explore a minimal appointment module as the first vertical slice.",
    ],
    disclaimer:
      "A conceptual system design study. No patient or student data is involved and no clinical system exists.",
  },
  {
    slug: "robotics-automation",
    name: "Robotics & Automation",
    category: "embedded-systems",
    summary:
      "A collection of robotics and hardware experiments involving sensors, microcontrollers and automation.",
    tagline:
      "Software that has to work in the physical world, where sensors lie and timing is everything.",
    status: "prototype",
    timeline: "Ongoing lab experiments",
    featured: false,
    technologies: ["Microcontrollers", "Sensors", "Embedded C/C++", "Python automation"],
    thumbnail: "/images/projects/robotics.webp",
    thumbnailAlt:
      "Conceptual illustration for Robotics & Automation — a microcontroller reading sensors and driving actuators.",
    thumbnailKind: "illustration",
    screenshots: [],
    links: {},
    overview: [
      "A set of small hardware experiments: reading sensors, driving actuators and wiring the results back into software. Each one is chosen because it teaches something that pure software work does not.",
      "The recurring theme is the gap between a simulation and a device. Sensor noise, timing and power are all real constraints that no unit test can fully model.",
    ],
    problem: [
      "Software abstractions assume clean input; the physical world produces gradients, noise and missing readings.",
      "Automation projects fail in ways that are invisible in code — a loose wire looks exactly like a logic bug.",
    ],
    solution: [
      "Treat the sensor layer as an unreliable boundary: filter, validate and fail loudly rather than trust a single reading.",
      "Keep device logic small and observable so behaviour can be reasoned about with basic instruments.",
    ],
    architecture: [
      {
        title: "Sensing",
        description: "Sensor reads with filtering and calibration applied close to the hardware.",
      },
      {
        title: "Control loop",
        description: "Deterministic logic that turns readings into actuator commands.",
      },
      {
        title: "Host bridge",
        description: "A serial or network link that streams data to a Python script for logging and analysis.",
      },
      {
        title: "Automation scripts",
        description: "Python tooling that schedules routines and records the results of each run.",
      },
    ],
    features: [
      "Sensor acquisition with basic noise filtering",
      "Deterministic control logic for actuators",
      "Data logging to a host machine for review",
      "Automation scripts that repeat experiments consistently",
    ],
    challenges: [
      "Debugging systems where a hardware fault and a software fault look identical.",
      "Keeping timing predictable when the control loop matters.",
      "Working within limited memory and processing power.",
    ],
    lessons: [
      "Defensive input handling matters even more at the hardware boundary than in web code.",
      "Observability is not a luxury — logging is what makes embedded debugging possible.",
      "Physical constraints force simplicity, and simple code is easier to trust.",
    ],
    futureImprovements: [
      "Build a repeatable test rig so experiments can be compared across runs.",
      "Explore closed-loop control with feedback instead of fixed sequences.",
      "Integrate a lightweight dashboard for live telemetry.",
    ],
    disclaimer:
      "A collection of personal hardware experiments at various stages. Not a finished product or research contribution.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

/** All category labels that actually have at least one project. */
export function getUsedCategories(): ProjectCategory[] {
  const used = new Set(projects.map((project) => project.category));
  return projectCategories.filter((category) => used.has(category.id));
}
