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
  shared: {
    type: Boolean,
    default: false, // False means private, true means shared to feed
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

export const Comment = mongoose.model("Comment", CommentSchema);
export const Mood = mongoose.model("Mood", MoodSchema);
