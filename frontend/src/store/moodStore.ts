import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import type { MoodEntry } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface MoodState {
  entries: MoodEntry[];
  analyzing: boolean;
  moodSuggestion: string | null;
  songSuggestion: {
    title: string;
    artist: string;
    genre?: string;
    spotifyUrl?: string;
  } | null;
  analyzeMood: (userInput: string) => Promise<void>;
  saveMoodEntry: (
    entry: Omit<MoodEntry, "id" | "createdAt" | "likes" | "comments">
  ) => Promise<void>;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      entries: [],
      analyzing: false,
      moodSuggestion: null,
      songSuggestion: null,

      // Analyze mood by calling the backend API
      analyzeMood: async (userInput: string) => {
        set({ analyzing: true });

        try {
          const response = await fetch(`${API_URL}/moods/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userInput }),
          });

          if (!response.ok) {
            throw new Error("Failed to analyze mood.");
          }

          const data = await response.json();
          console.log("API Response:", data);

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

          console.log("Authorization Header:", `Bearer ${token}`);

          const response = await fetch(`${API_URL}/moods/save`, {
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
          console.log("Saved Entry:", savedEntry);

          set((state) => ({
            entries: [savedEntry.mood, ...state.entries],
          }));
        } catch (error) {
          console.error("Error saving mood entry:", error);
        }
      },
    }),
    {
      name: "mood-storage",
    }
  )
);

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { useAuthStore } from "./useAuthStore";
// import type { MoodEntry, Comment } from "../types";

// export type Mood = "happy" | "sad" | "relaxed" | "energetic" | "anxious";
// export type Badge = {
//   id: string;
//   name: string;
//   description: string;
//   icon: string;
//   unlockedAt: string;
// };

// interface MoodState {
//   entries: MoodEntry[];
//   badges: Badge[];
//   streak: number;
//   lastEntryDate?: string;
//   addEntry: (
//     entry: Omit<MoodEntry, "id" | "createdAt" | "likes" | "comments">
//   ) => void;
//   deleteEntry: (id: string) => void;
//   updateEntry: (id: string, updates: Partial<MoodEntry>) => void;
//   toggleLike: (entryId: string, userId: string) => void;
//   addComment: (
//     entryId: string,
//     userId: string,
//     userName: string,
//     content: string
//   ) => void;
//   deleteComment: (entryId: string, commentId: string) => void;
//   getMoodStats: (days: number) => { [key in Mood]?: number };
//   getUserEntries: (userId: string) => MoodEntry[];
// }

// export const useMoodStore = create<MoodState>()(
//   persist(
//     (set, get) => ({
//       entries: [],
//       badges: [],
//       streak: 0,
//       addEntry: (entry) => {
//         const user = useAuthStore.getState().user;
//         if (!user) return;

//         const newEntry = {
//           ...entry,
//           id: crypto.randomUUID(),
//           userId: user.id,
//           userName: user.name,
//           createdAt: new Date().toISOString(),
//           likes: [],
//           comments: [],
//         };

//         set((state) => {
//           const today = new Date().toDateString();
//           const lastEntry = state.lastEntryDate
//             ? new Date(state.lastEntryDate).toDateString()
//             : null;
//           const isConsecutiveDay =
//             lastEntry === new Date(Date.now() - 86400000).toDateString();
//           const newStreak = isConsecutiveDay ? state.streak + 1 : 1;

//           const newBadges = [...state.badges];
//           if (newStreak === 7) {
//             newBadges.push({
//               id: "weekly-streak",
//               name: "Weekly Warrior",
//               description: "7 days journaling streak!",
//               icon: "🎯",
//               unlockedAt: new Date().toISOString(),
//             });
//           }

//           return {
//             entries: [newEntry, ...state.entries],
//             badges: newBadges,
//             streak: newStreak,
//             lastEntryDate: today,
//           };
//         });
//       },
//       deleteEntry: (id) =>
//         set((state) => ({
//           entries: state.entries.filter((entry) => entry.id !== id),
//         })),
//       updateEntry: (id, updates) =>
//         set((state) => ({
//           entries: state.entries.map((entry) =>
//             entry.id === id ? { ...entry, ...updates } : entry
//           ),
//         })),
//       toggleLike: (entryId, userId) =>
//         set((state) => ({
//           entries: state.entries.map((entry) => {
//             if (entry.id !== entryId) return entry;

//             const likes = entry.likes.includes(userId)
//               ? entry.likes.filter((id) => id !== userId)
//               : [...entry.likes, userId];

//             return { ...entry, likes };
//           }),
//         })),
//       addComment: (entryId, userId, userName, content) =>
//         set((state) => ({
//           entries: state.entries.map((entry) => {
//             if (entry.id !== entryId) return entry;

//             const newComment: Comment = {
//               id: crypto.randomUUID(),
//               userId,
//               userName,
//               content,
//               createdAt: new Date().toISOString(),
//             };

//             return {
//               ...entry,
//               comments: [...entry.comments, newComment],
//             };
//           }),
//         })),
//       deleteComment: (entryId, commentId) =>
//         set((state) => ({
//           entries: state.entries.map((entry) => {
//             if (entry.id !== entryId) return entry;
//             return {
//               ...entry,
//               comments: entry.comments.filter(
//                 (comment) => comment.id !== commentId
//               ),
//             };
//           }),
//         })),
//       getMoodStats: (days) => {
//         const entries = get().entries;
//         const cutoff = new Date();
//         cutoff.setDate(cutoff.getDate() - days);

//         const recentEntries = entries.filter(
//           (entry) => new Date(entry.createdAt) >= cutoff
//         );

//         const stats = recentEntries.reduce((acc, entry) => {
//           acc[entry.mood as Mood] = (acc[entry.mood as Mood] || 0) + 1;
//           return acc;
//         }, {} as { [key in Mood]?: number });

//         const total = recentEntries.length;
//         if (total === 0) return {};

//         Object.keys(stats).forEach((mood) => {
//           stats[mood as Mood] = Math.round(
//             (stats[mood as Mood]! / total) * 100
//           );
//         });

//         return stats;
//       },
//       getUserEntries: (userId) => {
//         return get().entries.filter(
//           (entry) =>
//             entry.userId === userId &&
//             (!entry.isPrivate ||
//               entry.userId === useAuthStore.getState().user?.id)
//         );
//       },
//     }),
//     {
//       name: "mood-storage",
//     }
//   )
// );
