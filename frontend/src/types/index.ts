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
export type Mood = "happy" | "sad" | "relaxed" | "energetic" | "anxious";

export interface MoodEntry {
  id: string;
  userId: string;
  userInput: string;
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
