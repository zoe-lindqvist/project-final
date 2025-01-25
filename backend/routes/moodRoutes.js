import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import Mood from "../models/Mood.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/analyze", async (req, res) => {
  try {
    const { userInput } = req.body;

    const prompt = `
      Analyze the following user input and provide a JSON response. 
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

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that outputs JSON.",
        },
        { role: "user", content: prompt },
      ],
    });

    // Attempt to parse AI response as JSON
    const aiResponse = JSON.parse(response.choices[0].message.content.trim());

    res.json({
      mood: aiResponse.mood,
      songRecommendation: aiResponse.songRecommendation || {
        title: "Unknown Title",
        artist: "Unknown Artist",
        genre: "Unknown Genre",
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
    const { userInput, moodAnalysis, suggestedSong } = req.body;

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

// import express from "express";
// import Mood from "../models/Mood.js";

// const router = express.Router();

// // POST route to add a new mood entry
// router.post("/add", async (req, res) => {
//   try {
//     const { userId, userInput, moodAnalysis, suggestedSong } = req.body;

//     if (!userId || !userInput || !moodAnalysis || !suggestedSong) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     const newMood = new Mood({
//       userId,
//       userInput,
//       moodAnalysis,
//       suggestedSong,
//     });

//     await newMood.save();
//     res
//       .status(201)
//       .json({ message: "Mood entry created successfully", newMood });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // GET all mood entries
// router.get("/", async (req, res) => {
//   try {
//     const moods = await Mood.find()
//       .populate("userId", "username")
//       .populate("comments.userId", "username");
//     res.json(moods);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;
