import { User, MoodEntry, Badge } from "../types";

// Example conditions for earning badges
const BADGES: Badge[] = [
  {
    id: "streak-3",
    name: "3-Day Streak",
    description: "Logged moods for 3 days!",
    icon: "🔥",
  },
  {
    id: "streak-7",
    name: "One Week Streak",
    description: "Logged moods for 7 days!",
    icon: "🔥🔥",
  },
  {
    id: "entries-10",
    name: "Journal Enthusiast",
    description: "Wrote 10 mood entries!",
    icon: "📖",
  },
];
// Function to determine which badges should be awarded
export const checkForNewBadges = (
  user: User,
  moodEntries: MoodEntry[]
): Badge[] => {
  let newBadges: Badge[] = [];
  const now = new Date().toISOString();

  // Check for streak badges
  if (user.streak === 3)
    newBadges.push({
      ...BADGES.find((b) => b.id === "streak-3"),
      unlockedAt: now,
    } as Badge);
  if (user.streak === 7)
    newBadges.push({
      ...BADGES.find((b) => b.id === "streak-7"),
      unlockedAt: now,
    } as Badge);

  // Check for journal entry count badge
  if (moodEntries.length >= 10)
    newBadges.push({
      ...BADGES.find((b) => b.id === "entries-10"),
      unlockedAt: now,
    } as Badge);

  // Ensure `user.badges` is always an array
  newBadges = newBadges.filter(
    (badge) => badge && !(user.badges ?? []).some((b) => b.id === badge.id)
  );

  return newBadges;
};
