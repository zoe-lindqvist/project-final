import express from "express";
import OpenAI from "openai";
import axios from "axios";
import dotenv from "dotenv";
import { Mood, Comment } from "../models/Mood.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

import { authenticateUser } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/like/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Already a string

    const mood = await Mood.findById(id);
    if (!mood) {
      return res.status(404).json({ error: "Mood entry not found" });
    }

    // Convert likes array to string values before checking
    const likesArray = mood.likes.map((like) => like.toString());

    if (!likesArray.includes(userId)) {
      mood.likes.push(new mongoose.Types.ObjectId(userId)); // Store as ObjectId
    } else {
      mood.likes = mood.likes.filter((like) => like.toString() !== userId); // Ensure proper comparison
    }

    await mood.save();

    res.json({
      success: true,
      message: mood.likes.map((like) => like.toString()).includes(userId)
        ? "Liked the mood"
        : "Unliked the mood",
      likes: mood.likes.map((like) => like.toString()), // Convert to strings before sending to frontend
      likesCount: mood.likes.length,
    });
  } catch (error) {
    console.error("Error updating like:", error);
    res.status(500).json({ error: "Failed to update like" });
  }
});

// Add a comment to a mood entry
router.post("/:moodId/comments", authenticateUser, async (req, res) => {
  const { moodId } = req.params;
  const { text } = req.body;
  const userId = req.user.id; // Get authenticated user

  try {
    const mood = await Mood.findById(moodId);
    if (!mood) {
      return res.status(404).json({ message: "Mood entry not found" });
    }

    // Create the new comment
    const newComment = {
      userId: userId,
      comment: text,
      createdAt: new Date(),
    };

    // Add the comment to the mood entry
    mood.comments.push(newComment);
    await mood.save();

    // Re-fetch mood with populated `userId.username`
    const updatedMood = await Mood.findById(moodId)
      .populate("comments.userId", "username") // Ensure username is populated
      .exec();

    res.status(201).json({ comments: updatedMood.comments }); // Return comments with usernames
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ message: "Could not add comment", error: error.message });
  }
});

// Get all comments for a mood entry
router.get("/:moodId/comments", async (req, res) => {
  const { moodId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(moodId)) {
      return res.status(400).json({ message: "Invalid mood ID format" });
    }

    const mood = await Mood.findById(
      new mongoose.Types.ObjectId(moodId)
    ).populate("comments.userId", "username");

    if (!mood) {
      return res.status(404).json({ message: "Mood entry not found" });
    }

    res.status(200).json(mood.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "Could not fetch comments", error: error.message });
  }
});

// Function to get Spotify access token
const getSpotifyToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    throw new Error("Failed to obtain Spotify token");
  }
};

// Function to search for a track on Spotify using title and artist
const searchSpotifyTrack = async (title, artist) => {
  try {
    const token = await getSpotifyToken(); // Get access token
    const query = encodeURIComponent(`${title} ${artist}`);

    // Make a request to Spotify API to search for tracks
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if any tracks were found
    if (response.data.tracks.items.length > 0) {
      const track = response.data.tracks.items[0];
      return {
        title: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        spotifyUrl: track.external_urls.spotify, // Link to track on Spotify
        previewUrl: track.preview_url || null, // 30-second preview URL
      };
    }

    return null; // Return null if no track is found
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return null; // Handle error gracefully
  }
};

// Get all mood entries for a specific user profile by userId
router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userEntries = await Mood.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(userEntries);
  } catch (error) {
    console.error("Error fetching user entries:", error.message);
    res.status(500).json({ error: "Failed to fetch mood entries" });
  }
});

// Public profile for specific user
router.get("/public-profile/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const publicEntries = await Mood.find({ userId, shared: true }).sort({
      createdAt: -1,
    });

    // Fetch the user (excluding private info like email)
    const user = await User.findById(userId).select("username badges");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user, // Includes username and badges
      publicEntries, // Only public mood entries
    });
  } catch (error) {
    console.error("Error fetching public profile:", error.message);
    res.status(500).json({ error: "Failed to fetch public profile" });
  }
});

// POST route to analyze user input and provide mood-based song suggestions
router.post("/analyze", async (req, res) => {
  try {
    const { userInput } = req.body;

    // Construct the AI prompt to analyze the mood and suggest a song
    const prompt = `
      Analyze the following user input and provide a unique and creative song suggestion each time.
      Ensure the recommendations vary by genre, artist, and style to avoid repetition.
      Provide lesser-known or unexpected suggestions alongside popular ones, focusing on the given mood.
      Format the response as follows:
      {
        "mood": "<detected mood>",
        "songRecommendation": {
          "title": "<song title>",
          "artist": "<song artist>",
          "genre": "<song genre>"
        }
      }

      User input: "${userInput}"
    `;

    // Call OpenAI API for mood analysis and song recommendation
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that outputs JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 1.1, // Increase randomness for varied suggestions
    });

    // Parse AI response and extract song details
    const aiResponse = JSON.parse(response.choices[0].message.content.trim());

    // Search for the song on Spotify based on AI recommendation
    const spotifyTrack = await searchSpotifyTrack(
      aiResponse.songRecommendation.title,
      aiResponse.songRecommendation.artist
    );

    // Send the final response back to the client
    res.json({
      mood: aiResponse.mood,

      songRecommendation: {
        title:
          spotifyTrack?.title ||
          aiResponse.songRecommendation.title ||
          "Unknown Title",
        artist:
          spotifyTrack?.artist ||
          aiResponse.songRecommendation.artist ||
          "Unknown Artist",
        genre: aiResponse.songRecommendation.genre || "Unknown Genre", // Always use AI genre
        spotifyUrl: spotifyTrack?.spotifyUrl || "#", // Default link if Spotify track isn't found
        previewUrl: spotifyTrack?.previewUrl || null, // Use Spotify preview if available
      },
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Failed to analyze mood" });
  }
});

// POST route to save a new mood entry without sharing it (when user clicks "Save")
router.post("/save", authenticateUser, async (req, res) => {
  try {
    const { userInput, moodAnalysis, suggestedSong, shared } = req.body;

    const moodEntry = new Mood({
      userId: req.user.id,
      userInput,
      moodAnalysis,
      suggestedSong,
      shared: false, // Save as private
    });

    await moodEntry.save();
    res.status(201).json({
      success: true,
      message: "Mood saved to profile.",
      mood: moodEntry,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    res.status(500).json({ error: "Failed to save mood entry to profile." });
  }
});

// POST route to share a new mood entry (when user clicks "Share to feed")
router.post("/share", authenticateUser, async (req, res) => {
  try {
    const { userInput, moodAnalysis, suggestedSong } = req.body;

    const moodEntry = new Mood({
      userId: req.user.id,
      userInput,
      moodAnalysis,
      suggestedSong,
      shared: true, // Share to feed
    });

    await moodEntry.save();
    res.status(201).json({
      success: true,
      message: "Mood shared to feed.",
      mood: moodEntry,
    });
  } catch (error) {
    console.error("Error sharing mood:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
});

// -------------------------------------------------------------------
// Fetch the latest 10 moods (Specific Route)
// router.get("/latest", async (req, res) => {
//   try {
//     const latestMoods = await Mood.find({ shared: true })
//       .sort({ createdAt: -1 }) // sort by newest first
//       .limit(10); // limit to 10 moods
//     res.status(200).json(latestMoods);
//   } catch (error) {
//     console.error("Error fetching latest moods:", error);
//     res.status(500).json({ error: "Failed to fetch latest moods" });
//   }
// });
//----------------------------------------------------------

// GET route to display mood entries to feed (either all or only from followed users)
router.get("/feed", authenticateUser, async (req, res) => {
  try {
    const { filter } = req.query;
    let moods;
    if (filter === "following") {
      // Get the logged-in user's following list
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Fetch moods from followed users
      moods = await Mood.find({ userId: { $in: user.following }, shared: true })
        .sort({ createdAt: -1 })
        .populate("userId", "username id")
        .populate("comments.userId", "username id")
        .exec();
    } else {
      // Fetch all moods
      moods = await Mood.find({ shared: true })
        .sort({ createdAt: -1 })
        .populate("userId", "username")
        .populate("comments.userId", "username")
        .exec();
    }
    // :white_check_mark: Filter out moods where `userId` is null (due to deleted users)
    moods = moods.filter((mood) => mood.userId !== null);
    res.status(200).json(moods);
  } catch (error) {
    console.error("Error fetching mood feed:", error);
    res.status(500).json({ error: "Failed to fetch mood feed" });
  }
});

export default router;
