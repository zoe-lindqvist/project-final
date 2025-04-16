import { create } from "zustand";
import { persist } from "zustand/middleware"; // Sparar datan lokalt i webbläsaren
import { useAuthStore } from "./useAuthStore";
import type { MoodEntry } from "../types";
import { moodCategories, mapToCategory } from "../utils/moodUtils";

// Definierar API:ets bas-URL, där backend-anrop görs
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Definierar gränssnittet för Zustand-storen
interface MoodState {
  entries: MoodEntry[];
  streak: number;
  analyzing: boolean; // Visar om analysen pågår
  moodSuggestion: string | null; // AI:s förslag på humör
  songSuggestion: {
    // Rekommenderad låt baserad på humör
    title: string;
    artist: string;
    genre?: string;
    spotifyUrl?: string;
  } | null;

  resetMoodData: () => void; // Funktion för att återställa lagrade humördata
  analyzeMood: (userInput: string) => Promise<void>; // Funktionen skickar en förfrågan till API:t för att analysera humöret.
  // Funktion för att spara en anteckning
  saveMoodEntry: (
    entry: Omit<MoodEntry, "id" | "createdAt" | "likes" | "comments">
  ) => Promise<void>; // Funktion för att spara en ny humöranteckning
  getMoodStats: (days: number) => { [key: string]: number }; // Funktion för att beräkna statistik över humördata
  getUserEntries: (userId: string) => Promise<void>; // Funktion hämta användarens entries/anteckningar
}
// Skapar en Zustand-store med persistens för att lagra humördata
export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      entries: [],
      streak: 0,
      analyzing: false,
      moodSuggestion: null,
      songSuggestion: null,

      // Återställer humördata när en ny användare loggar in
      resetMoodData: () => {
        set({
          entries: [], // Clear mood entries
          streak: 0,
          moodSuggestion: null,
          songSuggestion: null,
        });
      },

      // Anropar backend för att analysera användarens humör
      analyzeMood: async (userInput: string) => {
        // om användaren inte har skrivit något eller analysen redan pågår returneras
        if (!userInput.trim() || get().analyzing) return; // Förhindrar tom input eller dubletter

        // Visar att analysen pågår
        set({ analyzing: true });

        // Skickar en POST-förfrågan till API:t för att analysera humöret
        try {
          const response = await fetch(`${API_BASE_URL}/api/moods/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userInput }),
          });
          // Om förfrågan misslyckas kastas ett fel och analysen avbryts
          if (!response.ok) {
            throw new Error("Failed to analyze mood.");
          }
          // Om förfrågan lyckas sparas svaret i variabeln data
          const data = await response.json();
          // Sparar AI:s förslag på humör och rekommenderad låt i storen
          set({
            moodSuggestion: data.mood,
            songSuggestion: data.songRecommendation || {
              title: "Unknown Title",
              artist: "Unknown Artist",
              genre: "Unknown Genre",
              spotifyUrl: "#",
            },
          });
          // Om analysen misslyckas visas ett felmeddelande
        } catch (error) {
          console.error("Error analyzing mood:", error);
        } finally {
          // Döljer att analysen pågår
          set({ analyzing: false });
        }
      },

      // Sparar en ny mood entry i databasen
      saveMoodEntry: async (entry) => {
        // Hämtar användaren från autentiseringsstoren
        const user = useAuthStore.getState().user;
        // Om användaren inte är autentiserad visas ett felmeddelande
        if (!user) {
          console.error("User not authenticated");
          // Returnerar från funktionen
          return;
        }

        // Hämtar användarens access token från autentiseringsstoren
        try {
          const token =
            // Hämtar användarens access token från autentiseringsstoren eller localStorage
            useAuthStore.getState().accessToken ||
            localStorage.getItem("accessToken");

          const category = mapToCategory(entry.moodAnalysis);

          const response = await fetch(`${API_BASE_URL}/api/moods/save`, {
            // Skickar en POST-förfrågan till API:t för att spara en ny mood entry
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
          // Om förfrågan misslyckas kastas ett fel och sparandet avbryts
          if (!response.ok) {
            throw new Error("Failed to save mood.");
          }
          // Om förfrågan lyckas sparas den sparade mood entryn i variabeln savedEntry
          const savedEntry = await response.json();
          // sparar den sparade mood entryn i storen
          set((state) => ({
            entries: [savedEntry.mood, ...state.entries],
          }));
          // Hämtar användarens entries/anteckningar från databasen
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
