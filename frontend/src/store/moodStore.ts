import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import type { MoodEntry, Badge } from "../types";
import { moodCategories, mapToCategory } from "../utils/moodUtils";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface MoodState {
  entries: MoodEntry[];
  streak: number;
  analyzing: boolean;
  moodSuggestion: string | null;
  songSuggestion: {
    title: string;
    artist: string;
    genre?: string;
    spotifyUrl?: string;
  } | null;

  resetMoodData: () => void;
  analyzeMood: (userInput: string) => Promise<void>;
  saveMoodEntry: (
    entry: Omit<MoodEntry, "id" | "createdAt" | "likes" | "comments">
  ) => Promise<void>;
  getMoodStats: (days: number) => { [key: string]: number };
  getUserEntries: (userId: string) => Promise<void>;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      entries: [],
      streak: 0, // Initialize streak here
      analyzing: false,
      moodSuggestion: null,
      songSuggestion: null,

      // Reset mood data when a new user logs in
      resetMoodData: () => {
        set({
          entries: [], // Clear mood entries
          streak: 0, // Reset streak
          moodSuggestion: null,
          songSuggestion: null,
        });
      },

      // Analyze mood by calling the backend API
      analyzeMood: async (userInput: string) => {
        if (!userInput.trim() || get().analyzing) return; // Prevent invalid input or duplicate requests

        set({ analyzing: true });

        try {
          const response = await fetch(`${API_BASE_URL}/api/moods/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userInput }),
          });

          if (!response.ok) {
            throw new Error("Failed to analyze mood.");
          }

          const data = await response.json();

          set({
            moodSuggestion: data.mood,
            songSuggestion: data.songRecommendation || {
              title: "Unknown Title",
              artist: "Unknown Artist",
              genre: "Unknown Genre",
              spotifyUrl: "#",
            },
          });
        } catch (error) {
          console.error("Error analyzing mood:", error);
        } finally {
          set({ analyzing: false });
        }
      },

      // Save mood entry to backend
      saveMoodEntry: async (entry) => {
        const user = useAuthStore.getState().user;
        if (!user) {
          console.error("User not authenticated");
          return;
        }

        try {
          const token =
            useAuthStore.getState().accessToken ||
            localStorage.getItem("accessToken");

          const category = mapToCategory(entry.moodAnalysis);

          const response = await fetch(`${API_BASE_URL}/api/moods/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              userInput: entry.userInput,
              moodAnalysis: entry.moodAnalysis,
              suggestedSong: {
                title: entry.suggestedSong?.title || "Unknown Title",
                artist: entry.suggestedSong?.artist || "Unknown Artist",
                genre: entry.suggestedSong?.genre || "Unknown Genre",
                spotifyLink: entry.suggestedSong?.spotifyUrl || "#",
              },
              shared: false,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save mood.");
          }

          const savedEntry = await response.json();

          set((state) => ({
            entries: [savedEntry.mood, ...state.entries],
          }));

          const { fetchUser } = useAuthStore.getState();
          await fetchUser(user.id);
        } catch (error) {
          console.error("Error saving mood entry:", error);
        }
      },

      getUserEntries: async (userId: string) => {
        const token =
          useAuthStore.getState().accessToken ||
          localStorage.getItem("accessToken");

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/moods/profile/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch moods.");
          }

          const data = await response.json();
          set({ entries: data }); // Update the Zustand store with the fetched moods
        } catch (error) {
          console.error("Error fetching moods:", error);
        }
      },

      getMoodStats: (days: number) => {
        const entries = get().entries;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days); // Calculate the cutoff date

        // Filter entries for the past `days`
        const recentEntries = entries.filter((entry) => {
          const entryDate = new Date(entry.createdAt).getTime();
          return entryDate >= cutoffDate.getTime(); // Compare timestamps
        });

        // Count occurrences of each mapped mood category
        const moodCounts: { [key: string]: number } = {};

        recentEntries.forEach((entry) => {
          const category = mapToCategory(entry.moodAnalysis); // Convert mood text to category
          moodCounts[category] = (moodCounts[category] || 0) + 1;
        });

        const totalEntries = recentEntries.length;

        if (totalEntries === 0) {
          return {}; // Return an empty object if no moods found
        }

        // Convert counts to percentages
        Object.keys(moodCounts).forEach((mood) => {
          moodCounts[mood] = Math.round(
            (moodCounts[mood] / totalEntries) * 100
          );
        });
        return moodCounts;
      },
    }),
    {
      name: "mood-storage",
    }
  )
);
