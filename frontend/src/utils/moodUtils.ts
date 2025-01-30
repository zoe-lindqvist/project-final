import { MoodEntry, MoodCategory } from "../types";

// Predefined mood categories and keywords (sorted alphabetically)
export const moodCategories: Record<MoodCategory, string[]> = {
  anxious: [
    "anxious",
    "nervous",
    "worried",
    "stressed",
    "under pressure",
    "tense",
    "scared",
  ],
  angry: [
    "angry",
    "mad",
    "frustrated",
    "furious",
    "irritated",
    "enraged",
    "livid",
  ],
  calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "mellow"],
  confident: [
    "confident",
    "self-assured",
    "amazing",
    "awesome",
    "fantastic",
    "great",
    "incredible",
    "superb",
    "terrific",
    "wonderful",
  ],
  excited: [
    "excited",
    "thrilled",
    "elated",
    "ecstatic",
    "eager",
    "enthusiastic",
    "pumped",
    "anticipating",
  ],
  frustrated: [
    "frustrated",
    "frustration",
    "annoyed",
    "disheartened",
    "stuck",
    "conflicted",
    "confused",
  ],
  grateful: ["grateful", "thankful", "appreciative", "blessed", "fortunate"],
  happy: ["happy", "joyful", "ecstatic", "content", "cheerful", "overjoyed"],
  hopeful: ["hopeful", "optimistic", "encouraged", "positive"],
  lonely: ["lonely", "isolated", "alone", "abandoned", "unwanted"],
  motivated: [
    "motivated",
    "driven",
    "determined",
    "focused",
    "energized",
    "energetic",
    "inspired",
  ],
  nervous: ["nervous", "anxious", "jittery", "uncertain", "uneasy", "doubtful"],
  relaxed: ["relaxed", "calm", "serene", "chill"],
  sad: ["sad", "depressed", "heartbroken", "melancholy", "blue"],
  tired: ["tired", "exhausted", "drained", "weary"],
  mixed: ["mixed", "unsettled"],
};

// Function to map AI-generated mood to a category
export const mapToCategory = (aiMood: string): MoodCategory => {
  for (const [category, keywords] of Object.entries(moodCategories)) {
    if (keywords.some((keyword) => aiMood.toLowerCase().includes(keyword))) {
      return category as MoodCategory; // Return the first matching category
    }
  }
  return "mixed"; // Fallback if no match
};

// Function to filter entries by category
export const filterByCategory = (
  entries: MoodEntry[],
  selectedCategory: MoodCategory
) => {
  const keywords = moodCategories[selectedCategory]; // TypeScript now knows this is safe
  return entries.filter((entry) =>
    keywords.some((keyword) =>
      entry.moodAnalysis.toLowerCase().includes(keyword)
    )
  );
};
