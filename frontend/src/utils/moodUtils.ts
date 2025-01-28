import { MoodEntry, MoodCategory } from "../types";

// Predefined mood categories and keywords
export const moodCategories: Record<MoodCategory, string[]> = {
  happy: ["happy", "joyful", "ecstatic", "content", "cheerful", "overjoyed"],
  sad: ["sad", "depressed", "heartbroken", "melancholy", "blue"],
  angry: ["angry", "mad", "frustrated", "furious", "irritated"],
  excited: ["excited", "thrilled", "elated", "ecstatic"],
  calm: ["calm", "peaceful", "relaxed", "serene"],
  anxious: ["anxious", "nervous", "worried", "stressed"],
  hopeful: ["hopeful", "optimistic", "encouraged", "positive"],
  frustrated: ["frustrated", "annoyed", "disheartened", "stuck"],
  confident: ["confident", "self-assured"],
  tired: ["tired", "exhausted", "drained", "weary"],
  lonely: ["lonely", "isolated", "alone"],
  grateful: ["grateful", "thankful", "appreciative"],
  nervous: ["nervous", "anxious", "jittery"],
  relaxed: ["relaxed", "calm", "serene"],
  motivated: ["motivated", "driven", "determined", "focused"],
};

// Function to map AI-generated mood to a category
export const mapToCategory = (aiMood: string): string => {
  for (const [category, keywords] of Object.entries(moodCategories)) {
    if (keywords.some((keyword) => aiMood.toLowerCase().includes(keyword))) {
      return category; // Return the first matching category
    }
  }
  return "uncategorized"; // Fallback if no match
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
