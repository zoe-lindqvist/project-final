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
    "terrified",
    "help",
    "jittery",
    "uncertain",
    "uneasy",
    "doubtful",
  ],
  angry: [
    "angry",
    "mad",
    "frustrated",
    "furious",
    "irritated",
    "enraged",
    "livid",
    "triggered",
  ],
  calm: ["calm", "peaceful", "relaxed", "serene", "tranquil", "mellow", "cool"],
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
    "adventurous",
    "proud",
    "explore",
  ],
  confused: ["confused", "puzzled"],
  excited: [
    "excited",
    "thrilled",
    "elated",
    "ecstatic",
    "eager",
    "enthusiastic",
    "pumped",
    "anticipating",
    "celebrating",
    "celebration",
    "amazed",
    "upbeat",
  ],
  frustrated: [
    "frustrated",
    "frustration",
    "annoyed",
    "disheartened",
    "stuck",
    "conflicted",
  ],
  grateful: ["grateful", "thankful", "appreciative", "blessed", "fortunate"],
  happy: [
    "happy",
    "joyful",
    "ecstatic",
    "content",
    "cheerful",
    "overjoyed",
    "friday",
    "fab",
    "super",
    "optimistic",
    "positive",
  ],
  hopeful: ["hopeful", "optimistic", "encouraged", "positive", "curious"],
  lonely: ["lonely", "isolated", "alone", "abandoned", "unwanted", "cold"],
  motivated: [
    "motivated",
    "driven",
    "determined",
    "focused",
    "energized",
    "energetic",
    "inspired",
  ],
  relaxed: ["relaxed", "calm", "serene", "chill"],
  sad: [
    "sad",
    "depressed",
    "heartbroken",
    "melancholy",
    "blue",
    "bad",
    "melancholic",
  ],
  tired: ["tired", "exhausted", "drained", "weary", "indifferent"],
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
  if (selectedCategory === "mixed") {
    return entries.filter(
      (entry) =>
        !Object.values(moodCategories).some((keywords) =>
          keywords.some((keyword) =>
            entry.moodAnalysis.toLowerCase().includes(keyword)
          )
        )
    );
  }
  const keywords = moodCategories[selectedCategory];
  return entries.filter((entry) =>
    keywords.some((keyword) =>
      entry.moodAnalysis.toLowerCase().includes(keyword)
    )
  );
};
