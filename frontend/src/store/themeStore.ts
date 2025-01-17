import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define interface for state structure
interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

// Create a Zustand store for managing theme state
export const useThemeStore = create<ThemeStore>(
  // Use the persist middleware to save state to local storage
  persist(
    // Define the initial state and actions for the store
    (set) => ({
      // Initial state: default to light mode
      isDark: false,
      // Define the toggle action to switch between light and dark mode
      toggle: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      // Configuration for the persist middleware
      name: "theme-storage", // Key under which state is saved in local storage
    }
  )
);
