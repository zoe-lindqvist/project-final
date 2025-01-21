import express from "express";
import Mood from "../models/Mood.js";

const router = express.Router();

// POST route to add a new mood entry
router.post("/add", async (req, res) => {
  try {
    const { userId, userInput, moodAnalysis, suggestedSong } = req.body;

    if (!userId || !userInput || !moodAnalysis || !suggestedSong) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newMood = new Mood({
      userId,
      userInput,
      moodAnalysis,
      suggestedSong,
    });

    await newMood.save();
    res
      .status(201)
      .json({ message: "Mood entry created successfully", newMood });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all mood entries
router.get("/", async (req, res) => {
  try {
    const moods = await Mood.find()
      .populate("userId", "username")
      .populate("comments.userId", "username");
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
