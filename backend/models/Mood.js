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

CommentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
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
