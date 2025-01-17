import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

export const ThemeToggle = () => {
  // Extract the theme state and toggle function from the Zustand store
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
      aria-label="Toggle theme"
    >
      {/* Render the Sun icon for light mode */}
      <Sun
        className={`h-5 w-5 transition-all scale-100 rotate-0 dark:scale-0 dark:rotate-90 ${
          isDark ? "text-text-dark" : "text-text-light"
        }`}
      />
      {/* Render the Moon icon for dark mode */}
      <Moon
        className={`absolute h-5 w-5 top-2 left-2 transition-all scale-0 -rotate-90 dark:scale-100 dark:rotate-0 ${
          isDark ? "text-text-dark" : "text-text-light"
        }`}
      />
    </button>
  );
};
