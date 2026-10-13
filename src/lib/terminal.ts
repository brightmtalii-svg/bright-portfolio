/**
 * Pure terminal logic.
 *
 * Deliberately free of React and of any content: `executeCommand` receives the
 * response map as an argument, which keeps it trivial to unit test and keeps
 * arbitrary shell execution impossible — commands are a lookup table, nothing
 * more.
 */

export type CommandKind = "output" | "error" | "clear" | "none";

export interface CommandResult {
  kind: CommandKind;
  /** Lines to render, already newline-free. */
  lines: string[];
  /** The canonical command that matched, when one did. */
  command?: string;
}

export interface TerminalConfig {
  /** command name -> multi-line response. */
  responses: Record<string, string>;
  /** optional shorthands, e.g. `ls` -> `projects`. */
  aliases?: Record<string, string>;
  /** command names offered by Tab completion and `help` hints. */
  commands: string[];
}

/** Split a response string into rendered lines, preserving blank lines. */
export function toLines(value: string): string[] {
  if (value.length === 0) return [];
  return value.split("\n");
}

/** Normalise raw input: trim, collapse spaces, lowercase the command token. */
export function parseInput(raw: string): { command: string; args: string[] } {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (cleaned.length === 0) return { command: "", args: [] };
  const [first, ...rest] = cleaned.split(" ");
  return { command: first.toLowerCase(), args: rest.map((arg) => arg.toLowerCase()) };
}

/** Resolve aliases to a canonical command name. */
export function resolveCommand(
  command: string,
  aliases: Record<string, string> = {},
): string {
  if (command in aliases) return aliases[command];
  return command;
}

/** Execute one line of input against the configured command table. */
export function executeCommand(raw: string, config: TerminalConfig): CommandResult {
  const { command, args } = parseInput(raw);

  if (command.length === 0) {
    return { kind: "none", lines: [] };
  }

  const resolved = resolveCommand(command, config.aliases);

  if (resolved === "clear") {
    return { kind: "clear", lines: [], command: "clear" };
  }

  if (Object.prototype.hasOwnProperty.call(config.responses, resolved)) {
    const lines = toLines(config.responses[resolved]);

    // `help <command>` prints the help for a specific command.
    if (resolved === "help" && args.length > 0) {
      const target = resolveCommand(args[0].replace(/^--?/, ""), config.aliases);
      if (Object.prototype.hasOwnProperty.call(config.responses, target)) {
        return { kind: "output", lines: toLines(config.responses[target]), command: target };
      }
      return {
        kind: "error",
        lines: [`No help available for \`${args[0]}\`.`, ...unknownCommandHint(config)],
      };
    }

    return { kind: "output", lines, command: resolved };
  }

  return {
    kind: "error",
    lines: [`command not found: ${command}`, ...unknownCommandHint(config)],
  };
}

function unknownCommandHint(config: TerminalConfig): string[] {
  return [
    "",
    `Available commands: ${config.commands.join(", ")}`,
    "Type `help` for a description of each command.",
  ];
}

/** Tab completion candidates for the current input. */
export function getCompletions(raw: string, config: TerminalConfig): string[] {
  const { command, args } = parseInput(raw);
  if (args.length > 0) return [];
  if (command.length === 0) return [...config.commands];
  return config.commands.filter((candidate) => candidate.startsWith(command));
}

/** Longest common prefix — used to complete as far as the input is unambiguous. */
export function completeInput(raw: string, config: TerminalConfig): string {
  const completions = getCompletions(raw, config);
  if (completions.length === 0) return raw;
  const [first, ...rest] = completions;
  if (rest.length === 0) return first;
  let prefix = first;
  for (const candidate of rest) {
    while (!candidate.startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix.length > 0 ? prefix : raw;
}

/** Push a value onto a bounded history buffer (most recent last). */
export function pushHistory(history: string[], value: string, limit = 50): string[] {
  const trimmed = value.trim();
  if (trimmed.length === 0) return history;
  if (history[history.length - 1] === trimmed) return history;
  const next = [...history, trimmed];
  return next.length > limit ? next.slice(next.length - limit) : next;
}
