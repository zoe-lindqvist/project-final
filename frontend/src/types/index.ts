export interface User {
  id: string;
  email: string;
  name?: string;
  accessToken?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
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
  | "nervous"
  | "relaxed"
  | "motivated";

// export interface MoodEntry {
//   id: string;
//   userId: string;
//   userName?: string;
//   content: string;
//   mood: Mood; // Change `string` to `Mood`
//   songRecommendation?: {
//     title: string;
//     artist: string;
//     genre?: string;
//     spotifyUrl?: string;
//   };
//   createdAt: string;
//   likes: string[];
//   comments: Comment[];
//   isPrivate: boolean;
// }
