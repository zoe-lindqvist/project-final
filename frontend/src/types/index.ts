export interface User {
  id: string;
  email: string;
  name?: string;
  accessToken?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}
export type Mood = "happy" | "sad" | "relaxed" | "energetic" | "anxious";

export interface MoodEntry {
  id: string;
  userId: string;
  userInput: string;
  mood: string; // Add this property
  shared: false; // For privacy setting
  content: string; // Assuming content is the journal entry text
  moodAnalysis: string;
  suggestedSong: {
    title: string;
    artist: string;
    genre?: string;
    spotifyUrl?: string;
    previewUrl?: string;
  };
  createdAt: string;

  likes: string[];
  comments: Comment[];
}

export interface SearchResult {
  id: string;
  userName: string;
}
