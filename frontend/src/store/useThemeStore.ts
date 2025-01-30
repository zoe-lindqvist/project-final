import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define interface for state structure
interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

// Create a Zustand store for managing theme state
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state: Check localStorage, default to dark mode
      isDark: localStorage.getItem("theme") === "light" ? false : true,

      // Define the toggle action to switch between light and dark mode
      toggle: () => {
        set((state) => {
          const newTheme = !state.isDark ? "dark" : "light";
          localStorage.setItem("theme", newTheme); // Store theme preference
          document.documentElement.classList.toggle(
            "dark",
            newTheme === "dark"
          ); // Apply class to <html>
          return { isDark: !state.isDark };
        });
      },
    }),
    {
      name: "theme-storage", // Key under which state is saved in local storage
    }
  )
);
