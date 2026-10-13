import { describe, expect, it } from "vitest";
import {
  completeInput,
  executeCommand,
  getCompletions,
  parseInput,
  pushHistory,
  resolveCommand,
  type TerminalConfig,
} from "@/lib/terminal";

const config: TerminalConfig = {
  responses: {
    help: "help text",
    about: "about text",
    projects: "project list",
    clear: "",
  },
  aliases: { "?": "help", ls: "projects", whoami: "about", cls: "clear" },
  commands: ["help", "about", "projects", "clear"],
};

describe("parseInput", () => {
  it("trims, collapses whitespace and lowercases the command", () => {
    expect(parseInput("  HELP   Me ")).toEqual({ command: "help", args: ["me"] });
  });

  it("returns an empty command for blank input", () => {
    expect(parseInput("   ")).toEqual({ command: "", args: [] });
  });
});

describe("resolveCommand", () => {
  it("maps aliases to canonical commands", () => {
    expect(resolveCommand("ls", config.aliases)).toBe("projects");
  });

  it("passes through unknown commands unchanged", () => {
    expect(resolveCommand("deploy", config.aliases)).toBe("deploy");
  });
});

describe("executeCommand", () => {
  it("returns none for empty input", () => {
    const result = executeCommand("", config);
    expect(result.kind).toBe("none");
    expect(result.lines).toHaveLength(0);
  });

  it("resolves aliases before lookup", () => {
    const result = executeCommand("ls", config);
    expect(result.kind).toBe("output");
    expect(result.command).toBe("projects");
    expect(result.lines).toEqual(["project list"]);
  });

  it("reports an error with a hint for unknown commands", () => {
    const result = executeCommand("sudo rm -rf", config);
    expect(result.kind).toBe("error");
    expect(result.lines[0]).toContain("command not found");
    expect(result.lines.join(" ")).toContain("help");
  });

  it("signals clear as a dedicated kind", () => {
    expect(executeCommand("cls", config).kind).toBe("clear");
  });

  it("supports `help <command>` for a specific command", () => {
    const result = executeCommand("help about", config);
    expect(result.kind).toBe("output");
    expect(result.lines).toEqual(["about text"]);
  });

  it("errors helpfully when help target is unknown", () => {
    const result = executeCommand("help nope", config);
    expect(result.kind).toBe("error");
    expect(result.lines[0]).toContain("No help available");
  });
});

describe("getCompletions / completeInput", () => {
  it("lists every command for empty input", () => {
    expect(getCompletions("", config)).toEqual(config.commands);
  });

  it("filters by prefix", () => {
    expect(getCompletions("pro", config)).toEqual(["projects"]);
  });

  it("returns nothing once arguments are present", () => {
    expect(getCompletions("help ab", config)).toEqual([]);
  });

  it("completes a unique prefix to the full command", () => {
    expect(completeInput("pro", config)).toBe("projects");
  });

  it("leaves input untouched when there is nothing to complete", () => {
    expect(completeInput("zzz", config)).toBe("zzz");
  });
});

describe("pushHistory", () => {
  it("ignores empty input", () => {
    expect(pushHistory([], "   ")).toEqual([]);
  });

  it("does not repeat the most recent entry", () => {
    expect(pushHistory(["help"], "help")).toEqual(["help"]);
  });

  it("enforces the history limit", () => {
    const history = ["a", "b", "c"];
    expect(pushHistory(history, "d", 3)).toEqual(["b", "c", "d"]);
  });
});
