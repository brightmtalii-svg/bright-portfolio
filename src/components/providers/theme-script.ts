import { THEME_STORAGE_KEY } from "@/components/providers/theme-provider";

/**
 * Runs before first paint so the correct theme class is on <html> from the very
 * first frame — no flash of the wrong theme, no hydration mismatch.
 *
 * Dark is the default regardless of the operating system preference; an explicit
 * choice stored in localStorage always wins.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    var root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.classList.add("dark");
  }
})();
`.trim();
