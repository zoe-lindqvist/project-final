/**
 * Mood & Comment Models
 * -----------------------------------
 * Defines the database schema for user moods and comments.
 *
 * - `MoodSchema`: Stores user mood entries, AI analysis, song suggestions, likes, and comments.
 * - `CommentSchema`: Embedded schema for user comments on mood entries.
 * - Includes references to `User` for tracking authors.
 * - Applies a `.toJSON` transformation to convert `_id` to `id` for frontend compatibility.
 */

import mongoose, { Schema } from "mongoose";

/**
 * Comment Schema
 * - Represents a comment on a mood entry.
 * - Stores user reference, comment text, and timestamp.
 */
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

// Transform _id to id in JSON responses
CommentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

/**
 * Mood Schema
 * - Stores user-inputted moods, AI mood analysis, and suggested songs.
 * - Supports likes and comments from other users.
 * - Allows users to share moods publicly or keep them private.
 */
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
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked this mood
  comments: [CommentSchema],
});

// Transform _id to id
MoodSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export const Comment = mongoose.model("Comment", CommentSchema);
export const Mood = mongoose.model("Mood", MoodSchema);
