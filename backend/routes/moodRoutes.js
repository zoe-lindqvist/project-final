import express from "express";
import OpenAI from "openai";
import axios from "axios";
import dotenv from "dotenv";
import Mood from "../models/Mood.js";
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
    const userId = new mongoose.Types.ObjectId(req.user._id); // ✅ Ensure it's an ObjectId

    const mood = await Mood.findById(id);
    if (!mood) {
      return res.status(404).json({ error: "Mood entry not found" });
    }

    // Check if user has already liked the mood
    const alreadyLiked = mood.likes.some((like) => like.equals(userId)); // ✅ Use `.equals()`

    if (!alreadyLiked) {
      mood.likes.push(userId); // ✅ Store as ObjectId
    } else {
      mood.likes = mood.likes.filter((like) => !like.equals(userId)); // ✅ Properly remove user
    }

    await mood.save();
    res.json({
      success: true,
      message: alreadyLiked ? "Unliked the mood" : "Liked the mood",
      likes: mood.likes.map((like) => like.toString()), // Convert ObjectId to string
      likesCount: mood.likes.length, // Send likes count separately
    });
  } catch (error) {
    console.error("Error updating like:", error);
    res.status(500).json({ error: "Failed to update like" });
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
      userId: req.user._id,
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
      userId: req.user._id,
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

// GET route to fetch the latest mood entries for the feed
router.get("/feed", async (req, res) => {
  try {
    const feedEntries = await Mood.find({ shared: true })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(feedEntries);
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ error: "Failed to fetch mood feed." });
  }
});

export default router;
