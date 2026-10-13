import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AskBot } from "@/components/ask/ask-bot";

function jsonResponse(payload: unknown) {
  return { ok: true, json: async () => payload };
}

describe("AskBot", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps the panel closed until the launcher is used", () => {
    render(<AskBot />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open ask bright/i })).toBeInTheDocument();
  });

  it("opens a dialog with suggested questions for first-time visitors", () => {
    render(<AskBot />);
    fireEvent.click(screen.getByRole("button", { name: /open ask bright/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/suggested questions/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Who is Bright?" })).toBeInTheDocument();
  });

  it("sends a question to /api/ask and renders the answer", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ ok: true, provider: "local", id: "about", answer: "Bright is a student." }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<AskBot />);
    fireEvent.click(screen.getByRole("button", { name: /open ask bright/i }));
    fireEvent.click(screen.getByRole("button", { name: "Who is Bright?" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/ask");
    expect(await screen.findByText("Bright is a student.", {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it("shows a typing indicator while waiting for an answer", async () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));

    render(<AskBot />);
    fireEvent.click(screen.getByRole("button", { name: /open ask bright/i }));
    fireEvent.click(screen.getByRole("button", { name: "Who is Bright?" }));

    expect(await screen.findByText(/bright is typing/i)).toBeInTheDocument();
  });

  it("surfaces an honest error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    render(<AskBot />);
    fireEvent.click(screen.getByRole("button", { name: /open ask bright/i }));
    fireEvent.click(screen.getByRole("button", { name: "Who is Bright?" }));

    expect(
      await screen.findByText(/couldn't reach the answer service/i, {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    render(<AskBot />);
    fireEvent.click(screen.getByRole("button", { name: /open ask bright/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("restores the conversation from session storage", async () => {
    window.sessionStorage.setItem(
      "bm-ask-session",
      JSON.stringify([
        { role: "user", text: "Earlier question" },
        { role: "assistant", text: "Earlier answer" },
      ]),
    );

    render(<AskBot />);
    fireEvent.click(screen.getByRole("button", { name: /open ask bright/i }));

    expect(await screen.findByText("Earlier question")).toBeInTheDocument();
    expect(screen.getByText("Earlier answer")).toBeInTheDocument();
    // A returning visitor has already asked, so suggestions are hidden.
    expect(screen.queryByText(/suggested questions/i)).not.toBeInTheDocument();
  });
});