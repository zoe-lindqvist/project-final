import axios from "axios";
import { User, MoodEntry, Badge } from "../types";
import { useAuthStore } from "../store/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Function to determine which badges should be awarded
export const checkForNewBadges = async (
  user: User,
  moodEntries: MoodEntry[]
): Promise<Badge[]> => {
  let newBadges: Badge[] = [];
  const now = new Date().toISOString();

  // Fetch badges from the backend if needed
  const existingBadges = user.badges || [];
  const userStreak = user.streak ?? 0;

  try {
    // Fetch all available badges from the database
    const response = await axios.get(`${API_BASE_URL}/api/badges`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const availableBadges: Badge[] = response.data;

    // Check for streak badges
    if (
      userStreak >= 3 &&
      !existingBadges.some((badge) => badge.id === "streak-3")
    ) {
      const badge = availableBadges.find((b) => b.id === "streak-3");
      if (badge) {
        newBadges.push({ ...badge, unlockedAt: now });
      }
    }

    if (
      userStreak >= 7 &&
      !existingBadges.some((badge) => badge.id === "streak-7")
    ) {
      const badge = availableBadges.find((b) => b.id === "streak-7");
      if (badge) {
        newBadges.push({ ...badge, unlockedAt: now });
      }
    }

    if (
      moodEntries.length >= 10 &&
      !existingBadges.some((badge) => badge.id === "entries-10")
    ) {
      const badge = availableBadges.find((b) => b.id === "entries-10");
      if (badge) {
        newBadges.push({ ...badge, unlockedAt: now });
      }
    }

    // Sync new badges with backend
    if (newBadges.length > 0) {
      await syncBadgesWithBackend(user.id, newBadges);

      // Re-fetch updated user data
      const { fetchUser } = useAuthStore.getState();
      await fetchUser(user.id);
    }
  } catch (error) {
    console.error("Error checking for new badges:", error);
  }

  return newBadges;
};
// Function to sync badges with the backend
const syncBadgesWithBackend = async (userId: string, badges: Badge[]) => {
  try {
    for (const badge of badges) {
      await axios.post(
        `${API_BASE_URL}/api/badges/unlock`,
        {
          userId,
          badgeId: badge.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Error syncing badges with backend:", error);
  }
};
