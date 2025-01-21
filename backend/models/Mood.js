import mongoose, { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // User input from textarea
  userInput: {
    type: String,
    required: true,
  },
  // AI-generated mood analysis
  moodAnalysis: {
    type: String,
    required: true,
  },
  // Suggested song based on mood
  suggestedSong: {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    spotifyLink: {
      type: String,
      required: true,
    },
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Likes and comments from other users
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [CommentSchema],
});

export default mongoose.model("Mood", MoodSchema);
