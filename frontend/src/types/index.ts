export interface User {
  id: string;
  _id?: string;
  email: string;
  name?: string;
  username: string;
  accessToken?: string;
  badges?: Badge[];
  streak?: number;
}

export interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  comment: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  userInput: string;
  mood: string; // Add this property
  category: string;
  shared: boolean; // For privacy setting
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

export type MoodCategory =
  | "happy"
  | "sad"
  | "angry"
  | "excited"
  | "calm"
  | "anxious"
  | "hopeful"
  | "frustrated"
  | "confident"
  | "tired"
  | "lonely"
  | "grateful"
  | "confused"
  | "relaxed"
  | "motivated"
  | "mixed";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}
