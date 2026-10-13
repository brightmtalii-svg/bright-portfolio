import { InteractiveTerminal } from "@/components/terminal/interactive-terminal";
import { Reveal } from "@/components/ui/reveal";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { terminalCommands } from "@/data/terminal";

const highlights = [
  { command: "whoami", hint: "Who is Bright Mtalii?" },
  { command: "skills", hint: "Technologies I work with" },
  { command: "projects", hint: "What I've been building" },
  { command: "contact", hint: "How to reach me" },
  { command: "help", hint: "List every command" },
];

export function TerminalSection() {
  return (
    <Section id="terminal" className="overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-dot opacity-40 mask-fade-y"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Interactive shell"
              title={
                <>
                  Explore this portfolio like a{" "}
                  <span className="text-gradient-static">developer.</span>
                </>
              }
              description="An in-browser terminal with a small set of commands. It runs entirely on the client — no shell access, nothing leaves your browser."
            />

            <ul className="flex flex-col gap-2">
              {highlights.map((item) => (
                <li key={item.command} className="flex items-baseline gap-3 text-sm">
                  <code className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-xs text-accent-cyan">
                    {item.command}
                  </code>
                  <span className="text-muted">{item.hint}</span>
                </li>
              ))}
            </ul>

            <p className="font-mono text-xs text-faint">
              {terminalCommands.length} commands available · try{" "}
              <span className="text-muted">sudo make coffee</span>
            </p>
          </div>

          <Reveal delay={0.1}>
            <InteractiveTerminal />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
