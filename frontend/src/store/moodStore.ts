import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import type { MoodEntry, Comment } from "../types";

export type Mood = "happy" | "sad" | "relaxed" | "energetic" | "anxious";
export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
};

interface MoodState {
  entries: MoodEntry[];
  badges: Badge[];
  streak: number;
  lastEntryDate?: string;
  addEntry: (
    entry: Omit<MoodEntry, "id" | "createdAt" | "likes" | "comments">
  ) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<MoodEntry>) => void;
  toggleLike: (entryId: string, userId: string) => void;
  addComment: (
    entryId: string,
    userId: string,
    userName: string,
    content: string
  ) => void;
  deleteComment: (entryId: string, commentId: string) => void;
  getMoodStats: (days: number) => { [key in Mood]?: number };
  getUserEntries: (userId: string) => MoodEntry[];
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      entries: [],
      badges: [],
      streak: 0,
      addEntry: (entry) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        const newEntry = {
          ...entry,
          id: crypto.randomUUID(),
          userId: user.id,
          userName: user.name,
          createdAt: new Date().toISOString(),
          likes: [],
          comments: [],
        };

        set((state) => {
          const today = new Date().toDateString();
          const lastEntry = state.lastEntryDate
            ? new Date(state.lastEntryDate).toDateString()
            : null;
          const isConsecutiveDay =
            lastEntry === new Date(Date.now() - 86400000).toDateString();
          const newStreak = isConsecutiveDay ? state.streak + 1 : 1;

          const newBadges = [...state.badges];
          if (newStreak === 7) {
            newBadges.push({
              id: "weekly-streak",
              name: "Weekly Warrior",
              description: "7 days journaling streak!",
              icon: "🎯",
              unlockedAt: new Date().toISOString(),
            });
          }

          return {
            entries: [newEntry, ...state.entries],
            badges: newBadges,
            streak: newStreak,
            lastEntryDate: today,
          };
        });
      },
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        })),
      toggleLike: (entryId, userId) =>
        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id !== entryId) return entry;

            const likes = entry.likes.includes(userId)
              ? entry.likes.filter((id) => id !== userId)
              : [...entry.likes, userId];

            return { ...entry, likes };
          }),
        })),
      addComment: (entryId, userId, userName, content) =>
        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id !== entryId) return entry;

            const newComment: Comment = {
              id: crypto.randomUUID(),
              userId,
              userName,
              content,
              createdAt: new Date().toISOString(),
            };

            return {
              ...entry,
              comments: [...entry.comments, newComment],
            };
          }),
        })),
      deleteComment: (entryId, commentId) =>
        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id !== entryId) return entry;
            return {
              ...entry,
              comments: entry.comments.filter(
                (comment) => comment.id !== commentId
              ),
            };
          }),
        })),
      getMoodStats: (days) => {
        const entries = get().entries;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        const recentEntries = entries.filter(
          (entry) => new Date(entry.createdAt) >= cutoff
        );

        const stats = recentEntries.reduce((acc, entry) => {
          acc[entry.mood as Mood] = (acc[entry.mood as Mood] || 0) + 1;
          return acc;
        }, {} as { [key in Mood]?: number });

        const total = recentEntries.length;
        if (total === 0) return {};

        Object.keys(stats).forEach((mood) => {
          stats[mood as Mood] = Math.round(
            (stats[mood as Mood]! / total) * 100
          );
        });

        return stats;
      },
      getUserEntries: (userId) => {
        return get().entries.filter(
          (entry) =>
            entry.userId === userId &&
            (!entry.isPrivate ||
              entry.userId === useAuthStore.getState().user?.id)
        );
      },
    }),
    {
      name: "mood-storage",
    }
  )
);
